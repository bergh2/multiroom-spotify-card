import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { styles } from './styles';
import { icons } from './icons';
import type { HomeAssistant, NowPlaying, Playlist, PlaylistLayout, PresetConfig, Speaker, SpeakerSectionConfig } from './types';
import { activePreset, deriveSpeakers, errorText, fingerprint, groupSummary, masterVolume, scaleVolumes } from './derive';
import { livePosition } from './position';
import * as media from './media-services';
import { clamp01, fmtTime } from './format';
import { throttle } from './throttle';

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

interface Override {
  vol?: number;
  on?: boolean;
  until: number;
}
interface SeekOverride {
  pos: number;
  until: number;
  stamp: string | null;
}

export type PlaylistStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface NowBarOptions {
  /** overrides the track title (e.g. "Starting on Alla…") */
  title?: string;
  /** second line; defaults to artist */
  subtitle?: string;
  /** show the busy spinner in place of the equalizer */
  busy?: boolean;
  disabled?: boolean;
  onPrev: () => Promise<unknown> | void;
  onPlayPause: () => Promise<unknown> | void;
  onNext: () => Promise<unknown> | void;
  onSeek: (seconds: number) => Promise<unknown> | void;
}

export interface PlaylistsView {
  layout: PlaylistLayout;
  count: number;
  columns: number;
  playlists: Playlist[];
  status: PlaylistStatus;
  error: string;
  activeUri: string | null;
  onPlay: (pl: Playlist) => void;
  onRetry: () => void;
}

export const OVERRIDE_MS = 1500;
const VOLUME_THROTTLE_MS = 150;

/**
 * Everything that does not depend on which integration starts the music:
 * hass change detection, speaker rows with optimistic/idle state, presets,
 * master volume, the picker sheet, the now-playing bar, playlist grids and toasts.
 */
export abstract class SpeakerCardBase extends LitElement {
  static override styles = styles;

  @state() protected _pickerOpen = false;
  @state() protected _toast = '';

  protected _hass?: HomeAssistant;
  private _fp = '';
  private _overrides = new Map<string, Override>();
  protected _intent = new Map<string, Omit<Override, 'until'>>();
  private _seek: SeekOverride | null = null;
  private _broken = new Set<string>();
  private _throttled = new Map<string, (v: number) => void>();
  private _lastSent = new Map<string, number>();
  private _masterThrottle?: (v: number) => void;
  private _masterBase: Speaker[] = [];
  private _tick?: number;
  private _toastTimer?: number;

  // ---- hooks for subclasses ---------------------------------------------

  /** Speaker section options (undefined until setConfig ran). */
  protected abstract get section(): SpeakerSectionConfig | undefined;
  /** Entity whose "playing" state means the group is active. */
  protected abstract get groupEntity(): string | undefined;
  protected abstract get accent(): string;
  /** Extra entity ids whose changes should trigger a re-render. */
  protected extraEntities(): string[] {
    return [];
  }
  /** Called after a hass object with visible changes arrived. */
  protected hassChanged(_hass: HomeAssistant, _first: boolean): void {}
  /** Whether the 1 s ticker should re-render (position moving). */
  protected ticking(hass: HomeAssistant): boolean {
    const g = this.groupEntity;
    return !!g && hass.states[g]?.state === 'playing';
  }

  // ---- hass --------------------------------------------------------------

  set hass(hass: HomeAssistant) {
    const first = !this._hass;
    this._hass = hass;
    const section = this.section;
    if (!section) return;
    const ids = [this.groupEntity ?? '', ...section.speakers.map((s) => s.entity), ...this.extraEntities()].filter(Boolean);
    const fp = fingerprint(hass, ids);
    if (fp !== this._fp || first) {
      this._fp = fp;
      this.hassChanged(hass, first);
      this.requestUpdate();
    }
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  getCardSize(): number {
    return 12;
  }

  getGridOptions(): Record<string, unknown> {
    return { columns: 12, min_columns: 6, rows: 'auto' };
  }

  // ---- lifecycle ---------------------------------------------------------

  override connectedCallback(): void {
    super.connectedCallback();
    this._tick = window.setInterval(() => {
      if (!this._hass) return;
      if (this.ticking(this._hass) || this._overrides.size || this._seek) this.requestUpdate();
    }, 1000);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) window.clearInterval(this._tick);
    if (this._toastTimer) window.clearTimeout(this._toastTimer);
  }

  protected override updated(_changed: PropertyValues): void {
    const dark = this._hass?.themes?.darkMode ?? true;
    this.setAttribute('theme', dark ? 'dark' : 'light');
    this.style.setProperty('--accent', this.accent);
  }

  // ---- speakers ----------------------------------------------------------

  /**
   * Live speaker state with two local layers on top:
   * - short-lived optimistic overrides right after a service call, and
   * - "intent" values remembered for speakers that are idle (Cast reports no
   *   volume while off), so a preset or slider set before playback starts stays visible.
   */
  protected speakers(hass: HomeAssistant, now: number): Speaker[] {
    const section = this.section;
    if (!section) return [];
    return deriveSpeakers(hass, section.speakers, this.groupEntity ?? '').map((base) => {
      let sp = base;
      if (sp.notInGroup) {
        // keep the warning visible; local intent would only hide the problem
      } else if (sp.standby) {
        const intent = this._intent.get(sp.entity);
        if (intent) sp = { ...sp, standby: false, vol: intent.vol ?? 0, on: intent.on ?? true };
      } else {
        this._intent.delete(sp.entity);
      }
      const o = this._overrides.get(sp.entity);
      if (!o || sp.notInGroup) return sp;
      if (now >= o.until) {
        this._overrides.delete(sp.entity);
        return sp;
      }
      return { ...sp, standby: false, vol: o.vol ?? sp.vol, on: o.on ?? sp.on };
    });
  }

  private _remember(entity: string, patch: Omit<Override, 'until'>): void {
    const prev = this._intent.get(entity) ?? {};
    this._intent.set(entity, { ...prev, ...patch });
  }

  private _bump(entity: string, patch: Omit<Override, 'until'>, ms = OVERRIDE_MS): void {
    this._remember(entity, patch);
    this._overrides.set(entity, { ...patch, until: Date.now() + ms });
    this.requestUpdate();
    window.setTimeout(() => this.requestUpdate(), ms + 50);
  }

  private _toggle(sp: Speaker): void {
    if (!this._hass || !sp.available) return;
    this._bump(sp.entity, { on: !sp.on });
    this.run(media.setMute(this._hass, sp.entity, sp.on));
  }

  private _muteAll(speakers: Speaker[], anyOn: boolean): void {
    if (!this._hass) return;
    const targets = speakers.filter((s) => s.available).map((s) => s.entity);
    if (!targets.length) return;
    for (const e of targets) this._bump(e, { on: !anyOn });
    this.run(media.setMute(this._hass, targets, anyOn));
  }

  protected applyPreset(speakers: Speaker[], preset: PresetConfig): void {
    if (!this._hass) return;
    for (const sp of speakers) {
      if (!sp.available) continue;
      const level = preset.levels[sp.entity];
      this._bump(sp.entity, level === undefined ? { on: false } : { on: true, vol: level }, OVERRIDE_MS + 1000);
    }
    this.run(media.applyPreset(this._hass, speakers, preset));
  }

  /** Apply the configured default preset if the group is cold and nothing was touched. */
  protected applyDefaultPresetIfCold(hass: HomeAssistant, cold: boolean): void {
    const section = this.section;
    if (!section?.default_preset) return;
    const preset = section.presets.find((p) => p.name === section.default_preset);
    if (preset && cold && this._intent.size === 0) this.applyPreset(this.speakers(hass, Date.now()), preset);
  }

  private _sendVolume(entity: string, v: number): void {
    if (!this._hass || this._lastSent.get(entity) === v) return;
    this._lastSent.set(entity, v);
    this.run(media.setVolume(this._hass, entity, v));
  }

  private _throttleFor(entity: string): (v: number) => void {
    let t = this._throttled.get(entity);
    if (!t) {
      t = throttle<number>((v) => this._sendVolume(entity, v), VOLUME_THROTTLE_MS);
      this._throttled.set(entity, t);
    }
    return t;
  }

  private _capture(e: PointerEvent): HTMLElement {
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* not supported */
    }
    return el;
  }

  private _track(el: HTMLElement, move: (ev: PointerEvent) => void, up: (ev: PointerEvent) => void): void {
    const done = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', done);
      el.removeEventListener('pointercancel', done);
      up(ev);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', done);
    el.addEventListener('pointercancel', done);
  }

  private _pct(el: HTMLElement, ev: PointerEvent): number {
    const r = el.getBoundingClientRect();
    return Math.round(clamp01((ev.clientX - r.left) / r.width) * 100);
  }

  private _dragStart(e: PointerEvent, sp: Speaker): void {
    const hass = this._hass;
    if (!hass || !sp.available) return;
    const el = this._capture(e);
    if (!sp.on) this.run(media.setMute(hass, sp.entity, false));
    this._lastSent.delete(sp.entity);
    const send = this._throttleFor(sp.entity);
    const move = (ev: PointerEvent) => {
      const v = this._pct(el, ev);
      this._remember(sp.entity, { vol: v, on: true });
      this._overrides.set(sp.entity, { vol: v, on: true, until: Infinity });
      this.requestUpdate();
      send(v);
    };
    this._track(el, move, (ev) => {
      const v = this._pct(el, ev);
      this._bump(sp.entity, { vol: v, on: true });
      this._sendVolume(sp.entity, v);
    });
    move(e);
  }

  private _sendMaster(speakers: Speaker[], target: number): void {
    for (const [entity, vol] of scaleVolumes(speakers, target)) this._sendVolume(entity, vol);
  }

  private _masterDragStart(e: PointerEvent, speakers: Speaker[]): void {
    const hass = this._hass;
    if (!hass) return;
    // Nothing is on: treat the drag as "play on all" at the chosen level.
    let base = speakers.filter((s) => s.on && s.available);
    if (!base.length) {
      base = speakers.filter((s) => s.available && !s.notInGroup).map((s) => ({ ...s, on: true, vol: 0 }));
      if (!base.length) return;
      this.run(media.setMute(hass, base.map((s) => s.entity), false));
    }
    const el = this._capture(e);
    for (const s of base) this._lastSent.delete(s.entity);
    if (!this._masterThrottle) {
      this._masterThrottle = throttle<number>((t) => this._sendMaster(this._masterBase, t), VOLUME_THROTTLE_MS);
    }
    this._masterBase = base;
    const show = (t: number, until: number) => {
      for (const [entity, vol] of scaleVolumes(base, t)) {
        this._remember(entity, { vol, on: true });
        this._overrides.set(entity, { vol, on: true, until });
      }
      this.requestUpdate();
    };
    const move = (ev: PointerEvent) => {
      const t = this._pct(el, ev);
      show(t, Infinity);
      this._masterThrottle!(t);
    };
    this._track(el, move, (ev) => {
      const t = this._pct(el, ev);
      show(t, Date.now() + OVERRIDE_MS);
      this._sendMaster(base, t);
      window.setTimeout(() => this.requestUpdate(), OVERRIDE_MS + 50);
    });
    move(e);
  }

  // ---- seek --------------------------------------------------------------

  private _seekStart(e: PointerEvent, np: NowPlaying, send: (seconds: number) => Promise<unknown> | void): void {
    if (!np.duration) return;
    const el = this._capture(e);
    const duration = np.duration;
    const pos = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return clamp01((ev.clientX - r.left) / r.width) * duration;
    };
    const move = (ev: PointerEvent) => {
      this._seek = { pos: pos(ev), until: Infinity, stamp: np.positionUpdatedAt };
      this.requestUpdate();
    };
    this._track(el, move, (ev) => {
      const p = pos(ev);
      this._seek = { pos: p, until: Date.now() + 2500, stamp: np.positionUpdatedAt };
      this.requestUpdate();
      this.run(send(p));
    });
    move(e);
  }

  protected position(np: NowPlaying, now: number): number {
    const s = this._seek;
    if (s) {
      if (now < s.until && s.stamp === np.positionUpdatedAt) return s.pos;
      this._seek = null;
    }
    return livePosition(np, now);
  }

  // ---- misc --------------------------------------------------------------

  protected run(p: Promise<unknown> | void): void {
    if (!p) return;
    p.catch((e: unknown) => this.showToast(errorText(e)));
  }

  protected showToast(msg: string, ms = 4000): void {
    this._toast = msg;
    if (this._toastTimer) window.clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => {
      this._toast = '';
    }, ms);
  }

  private _imgBroken(key: string): void {
    this._broken.add(key);
    this.requestUpdate();
  }

  // ---- render helpers ----------------------------------------------------

  protected renderHeader(title: string, speakers: Speaker[]): TemplateResult {
    const onCount = speakers.filter((s) => s.on).length;
    return html`<div class="header">
      <div class="header-text">
        <span class="title">${title}</span>
        <span class="summary ellipsis">${groupSummary(speakers)}</span>
      </div>
      <button class="pill" title="Choose speakers" @click=${() => (this._pickerOpen = !this._pickerOpen)}>
        ${icons.airplay}<span>${onCount}</span>
      </button>
    </div>`;
  }

  protected renderSpeakerSection(speakers: Speaker[]): TemplateResult {
    const section = this.section!;
    const onCount = speakers.filter((s) => s.on).length;
    const preset = activePreset(speakers, section.presets, section.preset_tolerance);
    const shown = speakers.slice(0, section.speaker_count);
    return html`
      <div class="section-head">
        <span class="label">Speakers</span>
        <button class="text-btn" @click=${() => this._muteAll(speakers, onCount > 0)}>
          ${onCount > 0 ? 'Mute all' : 'Play on all'}
        </button>
      </div>
      ${section.presets.length
        ? html`<div class="presets">
            ${section.presets.map(
              (p) => html`<button class=${classMap({ preset: true, active: preset === p.name })} @click=${() => this.applyPreset(speakers, p)}>
                ${p.name}
              </button>`,
            )}
          </div>`
        : nothing}
      <div class="speakers">
        ${section.master_volume ? this.renderMaster(speakers) : nothing}
        ${shown.map((sp) => this.renderSpeaker(sp))}
      </div>
    `;
  }

  protected renderMaster(speakers: Speaker[]): TemplateResult {
    const level = masterVolume(speakers);
    const on = level !== null;
    return html`<div class=${classMap({ 'speaker-row': true, master: true, on })} title="Master volume: scales every speaker that is on">
      <span class="dot" role="img" aria-label="Master volume">${icons.volume}</span>
      <span class="sp-name ellipsis">All</span>
      <div class="track-hit" @pointerdown=${(e: PointerEvent) => this._masterDragStart(e, speakers)}>
        <div class="track"><div class="fill" style=${styleMap({ width: `${level ?? 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${level ?? '–'}</span>
    </div>`;
  }

  protected renderSpeaker(sp: Speaker): TemplateResult {
    const hint = !sp.available
      ? 'Unavailable'
      : sp.notInGroup
        ? 'Not in the Cast group: add it in the Google Home app'
        : sp.standby
          ? 'Idle'
          : 'Toggle speaker';
    return html`<div
      class=${classMap({ 'speaker-row': true, on: sp.on, unavailable: !sp.available, standby: sp.standby, orphan: sp.notInGroup })}
      title=${hint}
    >
      <button class="dot" title=${hint} ?disabled=${!sp.available} @click=${() => this._toggle(sp)}>${icons.speaker}</button>
      <span class="sp-name ellipsis">${sp.name}</span>
      <div class="track-hit" @pointerdown=${(e: PointerEvent) => this._dragStart(e, sp)}>
        <div class="track"><div class="fill" style=${styleMap({ width: `${sp.on ? sp.vol : 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${sp.notInGroup ? 'n/a' : sp.standby ? '–' : sp.vol}</span>
    </div>`;
  }

  protected renderPicker(speakers: Speaker[]): TemplateResult | typeof nothing {
    if (!this._pickerOpen) return nothing;
    const close = () => (this._pickerOpen = false);
    return html`<div class="scrim" @click=${close}>
      <div class="sheet" @click=${(e: Event) => e.stopPropagation()}>
        <div class="sheet-head">
          <span class="sheet-title">Play on</span>
          <button class="sheet-done" @click=${close}>Done</button>
        </div>
        <div class="sheet-list">
          ${speakers.map(
            (sp) => html`<button class=${classMap({ 'sheet-row': true, on: sp.on })} ?disabled=${!sp.available} @click=${() => this._toggle(sp)}>
              <span class="check">${icons.check}</span>
              <span class="sheet-name ellipsis">${sp.name}</span>
              <span class="sheet-kind">${!sp.available ? 'offline' : sp.notInGroup ? 'not in group' : sp.standby ? 'idle' : sp.on ? `${sp.vol}` : 'muted'}</span>
            </button>`,
          )}
        </div>
      </div>
    </div>`;
  }

  protected renderToast(): TemplateResult | typeof nothing {
    return this._toast ? html`<div class="toast">${this._toast}</div>` : nothing;
  }

  protected renderArt(cls: string, image: string | null, key: string, index: number, pulse = false): TemplateResult {
    const showImg = !!image && !this._broken.has(key);
    return html`<div class=${classMap({ art: true, [cls]: true, pulse })}>
      <div class="stripes"></div>
      ${showImg
        ? html`<img
            src=${image}
            alt=""
            loading="lazy"
            @load=${(e: Event) => (e.target as HTMLElement).classList.add('loaded')}
            @error=${() => this._imgBroken(key)}
          />`
        : html`<div class="art-label">ART ${String(index + 1).padStart(2, '0')}</div>`}
    </div>`;
  }

  protected renderPlaylists(v: PlaylistsView): TemplateResult {
    if (v.status === 'error' && !v.playlists.length) {
      return html`<div class="pl-msg">
        <span>${v.error || 'Could not load playlists'}</span>
        <button class="text-btn" @click=${v.onRetry}>Retry</button>
      </div>`;
    }
    if (v.status === 'ready' && !v.playlists.length) return html`<div class="pl-msg">No playlists yet</div>`;
    if (v.status !== 'ready' && !v.playlists.length) {
      const n = v.layout === 'list' ? Math.min(v.count, 10) : v.count;
      const items = Array.from({ length: n }, (_, i) => i);
      return v.layout === 'list'
        ? html`<div class="list">
            ${items.map(
              (i) => html`<div class=${classMap({ 'list-row': true, first: i === 0 })}>
                ${this.renderArt('list-art', null, `ph${i}`, i, true)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`,
            )}
          </div>`
        : html`<div class="tiles" style=${styleMap({ '--cols': String(v.columns) })}>
            ${items.map(
              (i) => html`<div class="tile">${this.renderArt('tile-art', null, `ph${i}`, i, true)}<span class="tile-name">&nbsp;</span></div>`,
            )}
          </div>`;
    }
    const list = v.playlists.slice(0, v.count);
    if (v.layout === 'list') {
      return html`<div class="list">
        ${list.map(
          (pl, i) => html`<button class=${classMap({ 'list-row': true, first: i === 0, active: pl.uri === v.activeUri })} @click=${() => v.onPlay(pl)}>
            ${this.renderArt('list-art', pl.image, pl.uri, i)}
            <span class="list-name ellipsis">${pl.name}</span>
            <span class="list-play">${icons.playSmall}</span>
          </button>`,
        )}
      </div>`;
    }
    return html`<div class="tiles" style=${styleMap({ '--cols': String(v.columns) })}>
      ${list.map(
        (pl, i) => html`<button class=${classMap({ tile: true, active: pl.uri === v.activeUri })} title=${pl.name} @click=${() => v.onPlay(pl)}>
          <div class="tile-art-wrap" style="position:relative;width:100%">
            ${this.renderArt('tile-art', pl.image, pl.uri, i)}
            <div class="ring"></div>
          </div>
          <span class="tile-name ellipsis">${pl.name}</span>
        </button>`,
      )}
    </div>`;
  }

  protected renderNowBar(np: NowPlaying, now: number, o: NowBarOptions): TemplateResult {
    const pos = this.position(np, now);
    const dur = np.duration ?? 0;
    const pct = dur > 0 ? (pos / dur) * 100 : 0;
    const unavailable = np.found && (np.state === 'unavailable' || np.state === 'unknown');
    let title = o.title ?? np.title;
    if (!o.title) {
      if (!np.found) title = 'Player not found';
      else if (unavailable) title = 'Player unavailable';
      else if (!title) title = np.state === 'playing' ? 'Playing' : np.state === 'paused' ? 'Paused' : 'Nothing playing';
    }
    const subtitle = o.subtitle ?? np.artist;
    const disabled = o.disabled || !np.found || unavailable;
    const canSeek = !disabled && dur > 0;
    return html`<div class=${classMap({ now: true, paused: !np.playing && !o.busy, busy: !!o.busy })}>
      <div class="now-row">
        ${this.renderArt('now-art', np.art, `now:${np.art ?? ''}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            ${o.busy ? html`<span class="spinner" aria-label="Starting"></span>` : html`<div class="eq"><div></div><div></div><div></div></div>`}
            <span class="now-title ellipsis">${title}</span>
          </div>
          <span class="now-artist ellipsis">${subtitle}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${disabled} @click=${() => this.run(o.onPrev())}>${icons.prev}</button>
          <button class="play" title=${np.playing ? 'Pause' : 'Play'} ?disabled=${disabled} @click=${() => this.run(o.onPlayPause())}>
            ${np.playing ? icons.pause : icons.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${disabled} @click=${() => this.run(o.onNext())}>${icons.next}</button>
        </div>
      </div>
      <div class=${classMap({ 'progress-hit': true, disabled: !canSeek })} @pointerdown=${(e: PointerEvent) => canSeek && this._seekStart(e, np, o.onSeek)}>
        <div class="progress"><div class="progress-fill" style=${styleMap({ width: `${pct.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${fmtTime(pos)}</span><span>${dur > 0 ? `-${fmtTime(dur - pos)}` : '–:––'}</span></div>
      </div>
    </div>`;
  }
}
