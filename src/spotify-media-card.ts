import { LitElement, html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { styles } from './styles';
import { icons } from './icons';
import { normalizeConfig } from './config';
import type { CardConfig, HomeAssistant, NormalizedConfig, NowPlaying, Playlist, PresetConfig, Speaker } from './types';
import { activePreset, deriveNowPlaying, deriveSpeakers, fingerprint, groupSummary } from './state/derive';
import { livePosition } from './state/position';
import { discoverEntryId, getPlaylists } from './ha/library';
import * as svc from './ha/services';
import { clamp01, fmtTime } from './util/format';
import { throttle } from './util/throttle';
import './editor';

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
  interface HTMLElementTagNameMap {
    'spotify-media-card': SpotifyMediaCard;
  }
}

type PlStatus = 'idle' | 'loading' | 'ready' | 'error';
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

const OVERRIDE_MS = 1500;
const REFETCH_AFTER_PLAY_MS = 3000;
const VOLUME_THROTTLE_MS = 150;

@customElement('spotify-media-card')
export class SpotifyMediaCard extends LitElement {
  static override styles = styles;

  @state() private _config?: NormalizedConfig;
  @state() private _pickerOpen = false;
  @state() private _playlists: Playlist[] = [];
  @state() private _plStatus: PlStatus = 'idle';
  @state() private _plError = '';
  @state() private _activeUri: string | null = null;
  @state() private _toast = '';

  private _hass?: HomeAssistant;
  private _fp = '';
  private _entryId = '';
  private _overrides = new Map<string, Override>();
  private _intent = new Map<string, Omit<Override, 'until'>>();
  private _seek: SeekOverride | null = null;
  private _broken = new Set<string>();
  private _throttled = new Map<string, (v: number) => void>();
  private _tick?: number;
  private _toastTimer?: number;
  private _refetchTimer?: number;
  private _fetchSeq = 0;

  // ---- HA card API -------------------------------------------------------

  static getConfigElement(): HTMLElement {
    return document.createElement('spotify-media-card-editor');
  }

  static getStubConfig(hass?: HomeAssistant): Partial<CardConfig> {
    const players = Object.values(hass?.states ?? {}).filter((s) => s.entity_id.startsWith('media_player.'));
    const ma = players.filter((s) => s.attributes.mass_player_id !== undefined);
    const group = ma.find((s) => s.attributes.mass_player_type === 'group') ?? ma[0];
    const cast = players
      .filter((s) => s.attributes.mass_player_id === undefined && typeof s.attributes.volume_level === 'number')
      .slice(0, 4);
    return {
      group_entity: group?.entity_id ?? 'media_player.your_cast_group',
      speakers: cast.length ? cast.map((s) => s.entity_id) : ['media_player.living_room'],
      presets: [],
      playlist_layout: 'tiles',
      playlist_sort: 'last_played',
      playlist_count: 6,
    };
  }

  getCardSize(): number {
    return 12;
  }

  getGridOptions(): Record<string, unknown> {
    return { columns: 12, min_columns: 6, rows: 'auto' };
  }

  setConfig(config: CardConfig): void {
    const prev = this._config;
    const next = normalizeConfig(config);
    this._config = next;
    this._activeUri = this._loadActive(next.group_entity);
    const refetch =
      !prev ||
      prev.playlist_sort !== next.playlist_sort ||
      prev.playlist_count !== next.playlist_count ||
      prev.ma_config_entry_id !== next.ma_config_entry_id;
    if (refetch) {
      this._entryId = next.ma_config_entry_id;
      this._plStatus = 'idle';
      if (this._hass) void this._ensurePlaylists();
    }
  }

  set hass(hass: HomeAssistant) {
    const first = !this._hass;
    this._hass = hass;
    if (!this._config) return;
    const fp = fingerprint(hass, this._config);
    if (fp !== this._fp) {
      this._fp = fp;
      this._syncActiveWithPlayer(hass);
      this.requestUpdate();
    }
    if (first && this._plStatus === 'idle') void this._ensurePlaylists();
  }

  get hass(): HomeAssistant | undefined {
    return this._hass;
  }

  // ---- lifecycle ---------------------------------------------------------

  override connectedCallback(): void {
    super.connectedCallback();
    this._tick = window.setInterval(() => {
      if (!this._hass || !this._config) return;
      const st = this._hass.states[this._config.group_entity];
      if (st?.state === 'playing' || this._overrides.size || this._seek) this.requestUpdate();
    }, 1000);
    if (this._hass && this._config && this._plStatus !== 'loading') void this._ensurePlaylists();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._tick) window.clearInterval(this._tick);
    if (this._toastTimer) window.clearTimeout(this._toastTimer);
    if (this._refetchTimer) window.clearTimeout(this._refetchTimer);
  }

  protected override updated(_changed: PropertyValues): void {
    const dark = this._hass?.themes?.darkMode ?? true;
    this.setAttribute('theme', dark ? 'dark' : 'light');
    if (this._config) this.style.setProperty('--accent', this._config.accent);
  }

  // ---- playlists ---------------------------------------------------------

  private async _ensurePlaylists(force = false): Promise<void> {
    const hass = this._hass;
    const cfg = this._config;
    if (!hass || !cfg) return;
    const seq = ++this._fetchSeq;
    if (!this._playlists.length) this._plStatus = 'loading';
    try {
      if (!this._entryId) this._entryId = await discoverEntryId(hass);
      const items = await getPlaylists(hass, {
        entryId: this._entryId,
        sort: cfg.playlist_sort,
        limit: cfg.playlist_count,
        force,
      });
      if (seq !== this._fetchSeq) return;
      this._playlists = items;
      this._plStatus = 'ready';
      this._plError = '';
    } catch (e) {
      if (seq !== this._fetchSeq) return;
      this._plStatus = 'error';
      this._plError = errorText(e);
    }
  }

  private _play(pl: Playlist): void {
    const hass = this._hass;
    const cfg = this._config;
    if (!hass || !cfg) return;
    this._activeUri = pl.uri;
    this._saveActive(cfg.group_entity, pl.uri);
    this._run(
      svc.playPlaylist(hass, cfg.group_entity, pl.uri).then(() => {
        if (this._refetchTimer) window.clearTimeout(this._refetchTimer);
        this._refetchTimer = window.setTimeout(() => void this._ensurePlaylists(true), REFETCH_AFTER_PLAY_MS);
      }),
    );
  }

  private _storageKey(group: string): string {
    return `spotify-media-card:${group}`;
  }

  private _loadActive(group: string): string | null {
    try {
      return window.localStorage.getItem(this._storageKey(group));
    } catch {
      return null;
    }
  }

  private _saveActive(group: string, uri: string | null): void {
    try {
      if (uri) window.localStorage.setItem(this._storageKey(group), uri);
      else window.localStorage.removeItem(this._storageKey(group));
    } catch {
      /* storage unavailable */
    }
  }

  /** Forget the highlighted playlist once the player has clearly stopped. */
  private _syncActiveWithPlayer(hass: HomeAssistant): void {
    if (!this._config || !this._activeUri) return;
    const st = hass.states[this._config.group_entity];
    if (!st || ['off', 'idle', 'unavailable', 'unknown', 'standby'].includes(st.state)) {
      this._activeUri = null;
      this._saveActive(this._config.group_entity, null);
    }
  }

  // ---- speakers ----------------------------------------------------------

  /**
   * Live speaker state with two local layers on top:
   * - short-lived optimistic overrides right after a service call, and
   * - "intent" values remembered for speakers that are idle (Cast reports no
   *   volume while off), so a preset or slider set before playback starts stays visible.
   */
  private _speakers(hass: HomeAssistant, cfg: NormalizedConfig, now: number): Speaker[] {
    return deriveSpeakers(hass, cfg).map((base) => {
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
    this._run(svc.setMute(this._hass, sp.entity, sp.on));
  }

  private _muteAll(speakers: Speaker[], anyOn: boolean): void {
    if (!this._hass) return;
    const targets = speakers.filter((s) => s.available).map((s) => s.entity);
    if (!targets.length) return;
    for (const e of targets) this._bump(e, { on: !anyOn });
    this._run(svc.setMute(this._hass, targets, anyOn));
  }

  private _applyPreset(speakers: Speaker[], preset: PresetConfig): void {
    if (!this._hass) return;
    for (const sp of speakers) {
      if (!sp.available) continue;
      const level = preset.levels[sp.entity];
      this._bump(sp.entity, level === undefined ? { on: false } : { on: true, vol: level }, OVERRIDE_MS + 1000);
    }
    this._run(svc.applyPreset(this._hass, speakers, preset));
  }

  private _lastSent = new Map<string, number>();

  private _sendVolume(entity: string, v: number): void {
    if (!this._hass || this._lastSent.get(entity) === v) return;
    this._lastSent.set(entity, v);
    this._run(svc.setVolume(this._hass, entity, v));
  }

  private _throttleFor(entity: string): (v: number) => void {
    let t = this._throttled.get(entity);
    if (!t) {
      t = throttle<number>((v) => this._sendVolume(entity, v), VOLUME_THROTTLE_MS);
      this._throttled.set(entity, t);
    }
    return t;
  }

  private _dragStart(e: PointerEvent, sp: Speaker): void {
    const hass = this._hass;
    if (!hass || !sp.available) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* not supported */
    }
    if (!sp.on) this._run(svc.setMute(hass, sp.entity, false));
    this._lastSent.delete(sp.entity);
    const send = this._throttleFor(sp.entity);
    const pct = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return Math.round(clamp01((ev.clientX - r.left) / r.width) * 100);
    };
    const move = (ev: PointerEvent) => {
      const v = pct(ev);
      this._remember(sp.entity, { vol: v, on: true });
      this._overrides.set(sp.entity, { vol: v, on: true, until: Infinity });
      this.requestUpdate();
      send(v);
    };
    const up = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      const v = pct(ev);
      this._bump(sp.entity, { vol: v, on: true });
      this._sendVolume(sp.entity, v);
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    move(e);
  }

  // ---- transport ---------------------------------------------------------

  private _seekStart(e: PointerEvent, np: NowPlaying): void {
    const hass = this._hass;
    const cfg = this._config;
    if (!hass || !cfg || !np.duration) return;
    e.preventDefault();
    const el = e.currentTarget as HTMLElement;
    const duration = np.duration;
    try {
      el.setPointerCapture(e.pointerId);
    } catch {
      /* not supported */
    }
    const pos = (ev: PointerEvent) => {
      const r = el.getBoundingClientRect();
      return clamp01((ev.clientX - r.left) / r.width) * duration;
    };
    const move = (ev: PointerEvent) => {
      this._seek = { pos: pos(ev), until: Infinity, stamp: np.positionUpdatedAt };
      this.requestUpdate();
    };
    const up = (ev: PointerEvent) => {
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      const p = pos(ev);
      this._seek = { pos: p, until: Date.now() + 2500, stamp: np.positionUpdatedAt };
      this.requestUpdate();
      this._run(svc.seek(hass, cfg.group_entity, p));
    };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    move(e);
  }

  private _position(np: NowPlaying, now: number): number {
    const s = this._seek;
    if (s) {
      if (now < s.until && s.stamp === np.positionUpdatedAt) return s.pos;
      this._seek = null;
    }
    return livePosition(np, now);
  }

  // ---- misc --------------------------------------------------------------

  private _run(p: Promise<unknown> | void): void {
    if (!p) return;
    p.catch((e: unknown) => this._showToast(errorText(e)));
  }

  private _showToast(msg: string): void {
    this._toast = msg;
    if (this._toastTimer) window.clearTimeout(this._toastTimer);
    this._toastTimer = window.setTimeout(() => {
      this._toast = '';
    }, 4000);
  }

  private _imgBroken(uri: string): void {
    this._broken.add(uri);
    this.requestUpdate();
  }

  // ---- render ------------------------------------------------------------

  protected override render(): TemplateResult | typeof nothing {
    const cfg = this._config;
    const hass = this._hass;
    if (!cfg) return nothing;
    if (!hass) return html`<ha-card><div class="card"></div></ha-card>`;

    const now = Date.now();
    const speakers = this._speakers(hass, cfg, now);
    const shown = speakers.slice(0, cfg.speaker_count);
    const np = deriveNowPlaying(hass, cfg.group_entity);
    const onCount = speakers.filter((s) => s.on).length;
    const preset = activePreset(speakers, cfg.presets, cfg.preset_tolerance);
    const active = this._playlists.find((p) => p.uri === this._activeUri) ?? null;

    return html`
      <ha-card>
        <div class="card">
          <div class="header">
            <div class="header-text">
              <span class="title">${cfg.title}</span>
              <span class="summary ellipsis">${groupSummary(speakers)}</span>
            </div>
            <button class="pill" title="Choose speakers" @click=${() => (this._pickerOpen = !this._pickerOpen)}>
              ${icons.airplay}<span>${onCount}</span>
            </button>
          </div>

          ${cfg.playlist_layout === 'list' ? this._renderList(cfg) : this._renderTiles(cfg)}

          <div class="section-head">
            <span class="label">Speakers</span>
            <button class="text-btn" @click=${() => this._muteAll(speakers, onCount > 0)}>
              ${onCount > 0 ? 'Mute all' : 'Play on all'}
            </button>
          </div>

          ${cfg.presets.length
            ? html`<div class="presets">
                ${cfg.presets.map(
                  (p) => html`<button
                    class=${classMap({ preset: true, active: preset === p.name })}
                    @click=${() => this._applyPreset(speakers, p)}
                  >
                    ${p.name}
                  </button>`,
                )}
              </div>`
            : nothing}

          <div class="speakers">${shown.map((sp) => this._renderSpeaker(sp))}</div>

          ${this._renderNow(np, active, now)}
          ${this._pickerOpen ? this._renderPicker(speakers) : nothing}
          ${this._toast ? html`<div class="toast">${this._toast}</div>` : nothing}
        </div>
      </ha-card>
    `;
  }

  private _renderArt(cls: string, image: string | null, key: string, index: number, pulse = false): TemplateResult {
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

  private _renderPlaylistState(cfg: NormalizedConfig): TemplateResult | null {
    if (this._plStatus === 'error') {
      return html`<div class="pl-msg">
        <span>${this._plError || 'Could not load playlists'}</span>
        <button class="text-btn" @click=${() => void this._ensurePlaylists(true)}>Retry</button>
      </div>`;
    }
    if (this._plStatus === 'ready' && !this._playlists.length) {
      return html`<div class="pl-msg">No playlists yet</div>`;
    }
    if (this._plStatus !== 'ready' && !this._playlists.length) {
      const n = cfg.playlist_layout === 'list' ? Math.min(cfg.playlist_count, 10) : cfg.playlist_count;
      const items = Array.from({ length: n }, (_, i) => i);
      return cfg.playlist_layout === 'list'
        ? html`<div class="list">
            ${items.map(
              (i) => html`<div class=${classMap({ 'list-row': true, first: i === 0 })}>
                ${this._renderArt('list-art', null, `ph${i}`, i, true)}<span class="list-name ellipsis">&nbsp;</span>
              </div>`,
            )}
          </div>`
        : html`<div class="tiles" style=${styleMap({ '--cols': String(cfg.tile_columns) })}>
            ${items.map(
              (i) => html`<div class="tile">
                ${this._renderArt('tile-art', null, `ph${i}`, i, true)}<span class="tile-name">&nbsp;</span>
              </div>`,
            )}
          </div>`;
    }
    return null;
  }

  private _renderTiles(cfg: NormalizedConfig): TemplateResult {
    const placeholder = this._renderPlaylistState(cfg);
    if (placeholder) return placeholder;
    return html`<div class="tiles" style=${styleMap({ '--cols': String(cfg.tile_columns) })}>
      ${this._playlists.slice(0, cfg.playlist_count).map(
        (pl, i) => html`<button
          class=${classMap({ tile: true, active: pl.uri === this._activeUri })}
          title=${pl.name}
          @click=${() => this._play(pl)}
        >
          <div class="tile-art-wrap" style="position:relative;width:100%">
            ${this._renderArt('tile-art', pl.image, pl.uri, i)}
            <div class="ring"></div>
          </div>
          <span class="tile-name ellipsis">${pl.name}</span>
        </button>`,
      )}
    </div>`;
  }

  private _renderList(cfg: NormalizedConfig): TemplateResult {
    const placeholder = this._renderPlaylistState(cfg);
    if (placeholder) return placeholder;
    return html`<div class="list">
      ${this._playlists.slice(0, cfg.playlist_count).map(
        (pl, i) => html`<button
          class=${classMap({ 'list-row': true, first: i === 0, active: pl.uri === this._activeUri })}
          @click=${() => this._play(pl)}
        >
          ${this._renderArt('list-art', pl.image, pl.uri, i)}
          <span class="list-name ellipsis">${pl.name}</span>
          <span class="list-play">${icons.playSmall}</span>
        </button>`,
      )}
    </div>`;
  }

  private _renderSpeaker(sp: Speaker): TemplateResult {
    const hint = !sp.available ? 'Unavailable' : sp.notInGroup ? 'Not in the Cast group: add it in the Google Home app' : sp.standby ? 'Idle' : 'Toggle speaker';
    return html`<div
      class=${classMap({ 'speaker-row': true, on: sp.on, unavailable: !sp.available, standby: sp.standby, orphan: sp.notInGroup })}
      title=${hint}
    >
      <button class="dot" title=${hint} ?disabled=${!sp.available} @click=${() => this._toggle(sp)}>
        ${icons.speaker}
      </button>
      <span class="sp-name ellipsis">${sp.name}</span>
      <div class="track-hit" @pointerdown=${(e: PointerEvent) => this._dragStart(e, sp)}>
        <div class="track"><div class="fill" style=${styleMap({ width: `${sp.on ? sp.vol : 0}%` })}></div></div>
      </div>
      <span class="sp-vol">${sp.notInGroup ? 'n/a' : sp.standby ? '–' : sp.vol}</span>
    </div>`;
  }

  private _renderNow(np: NowPlaying, active: Playlist | null, now: number): TemplateResult {
    const cfg = this._config!;
    const pos = this._position(np, now);
    const dur = np.duration ?? 0;
    const pct = dur > 0 ? (pos / dur) * 100 : 0;
    let title = np.title;
    if (!np.found) title = 'Player not found';
    else if (!title) title = np.state === 'playing' ? 'Playing' : np.state === 'paused' ? 'Paused' : 'Nothing playing';
    const artist = !np.found ? cfg.group_entity : [np.artist, active?.name].filter(Boolean).join(' · ');
    const canSeek = np.found && dur > 0;
    const disabled = !np.found;
    return html`<div class=${classMap({ now: true, paused: !np.playing })}>
      <div class="now-row">
        ${this._renderArt('now-art', np.art, `now:${np.art ?? ''}`, 0)}
        <div class="now-meta">
          <div class="now-title-row">
            <div class="eq"><div></div><div></div><div></div></div>
            <span class="now-title ellipsis">${title}</span>
          </div>
          <span class="now-artist ellipsis">${artist}</span>
        </div>
        <div class="transport">
          <button class="tbtn" title="Previous" ?disabled=${disabled} @click=${() => this._run(svc.prevTrack(this._hass!, cfg.group_entity))}>${icons.prev}</button>
          <button class="play" title=${np.playing ? 'Pause' : 'Play'} ?disabled=${disabled} @click=${() => this._run(svc.playPause(this._hass!, cfg.group_entity))}>
            ${np.playing ? icons.pause : icons.play}
          </button>
          <button class="tbtn" title="Next" ?disabled=${disabled} @click=${() => this._run(svc.nextTrack(this._hass!, cfg.group_entity))}>${icons.next}</button>
        </div>
      </div>
      <div class=${classMap({ 'progress-hit': true, disabled: !canSeek })} @pointerdown=${(e: PointerEvent) => this._seekStart(e, np)}>
        <div class="progress"><div class="progress-fill" style=${styleMap({ width: `${pct.toFixed(1)}%` })}></div></div>
        <div class="times"><span>${fmtTime(pos)}</span><span>${dur > 0 ? `-${fmtTime(dur - pos)}` : '–:––'}</span></div>
      </div>
    </div>`;
  }

  private _renderPicker(speakers: Speaker[]): TemplateResult {
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
}

function errorText(e: unknown): string {
  if (e && typeof e === 'object') {
    const o = e as { message?: unknown; error?: { message?: unknown } };
    if (typeof o.message === 'string') return o.message;
    if (o.error && typeof o.error.message === 'string') return o.error.message;
  }
  return String(e);
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'spotify-media-card',
  name: 'Spotify Media Card',
  description: 'Start Spotify playlists on multi-room Chromecast speakers through Music Assistant.',
  preview: false,
});
