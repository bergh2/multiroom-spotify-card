import { html, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { normalizeSpConfig, type SpCardConfig, type SpNormalizedConfig } from './spotifyplus/config';
import type { HomeAssistant, Playlist } from './shared/types';
import { deriveNowPlaying, errorText, isGroupCold } from './shared/derive';
import { SpeakerCardBase, type PlaylistStatus } from './shared/speaker-card-base';
import * as media from './shared/media-services';
import * as sp from './spotifyplus/services';
import {
  EMPTY_HISTORY,
  applyMeta,
  fillWithFavorites,
  isHistoryStore,
  mergeRecent,
  missingMeta,
  noteStarted,
  prune,
  sortedPlaylists,
  type HistoryStore,
} from './spotifyplus/history';
import './spotifyplus/editor';

declare global {
  interface HTMLElementTagNameMap {
    'spotifyplus-media-card': SpotifyPlusMediaCard;
  }
}

const START_TIMEOUT_MS = 60_000;
const REFRESH_AFTER_START_MS = 60_000;
const REFRESH_INTERVAL_MS = 10 * 60_000;
const FAVORITES_TTL_MS = 60 * 60_000;
const MAX_META_LOOKUPS_PER_REFRESH = 5;

interface Starting {
  uri: string;
  since: number;
}

/**
 * SpotifyPlus flavour: starts playlists as a real Spotify Connect session on the
 * Cast group (so the Spotify app can take over), reads now-playing from the Cast
 * group entity, and builds "recently / most played" from Spotify's play history.
 */
@customElement('spotifyplus-media-card')
export class SpotifyPlusMediaCard extends SpeakerCardBase {
  @state() private _config?: SpNormalizedConfig;
  @state() private _history: HistoryStore = EMPTY_HISTORY;
  @state() private _plStatus: PlaylistStatus = 'idle';
  @state() private _plError = '';
  @state() private _activeUri: string | null = null;
  @state() private _starting: Starting | null = null;

  @state() private _favorites: sp.PlaylistMeta[] = [];
  private _favoritesAt = 0;
  private _refreshing = false;
  private _refreshTimer?: number;
  private _intervalTimer?: number;
  private _startTimer?: number;
  private _historyLoaded = false;

  protected get section(): SpNormalizedConfig | undefined {
    return this._config;
  }
  protected get groupEntity(): string | undefined {
    return this._config?.cast_group_entity;
  }
  protected get accent(): string {
    return this._config?.accent ?? '';
  }
  protected override extraEntities(): string[] {
    return this._config ? [this._config.spotifyplus_entity] : [];
  }
  protected override ticking(hass: HomeAssistant): boolean {
    return !!this._starting || super.ticking(hass) || hass.states[this._config?.spotifyplus_entity ?? '']?.state === 'playing';
  }

  private get _playerEntity(): string {
    const cfg = this._config!;
    return cfg.control_via === 'spotifyplus' ? cfg.spotifyplus_entity : cfg.cast_group_entity;
  }

  // ---- HA card API -------------------------------------------------------

  static getConfigElement(): HTMLElement {
    return document.createElement('spotifyplus-media-card-editor');
  }

  static getStubConfig(hass?: HomeAssistant): Partial<SpCardConfig> {
    const players = Object.values(hass?.states ?? {}).filter((s) => s.entity_id.startsWith('media_player.'));
    const spEntity = players.find((s) => s.entity_id.includes('spotifyplus'))?.entity_id ?? 'media_player.spotifyplus';
    const cast = players.filter((s) => typeof s.attributes.app_id === 'string' || typeof s.attributes.app_name === 'string');
    return {
      spotifyplus_entity: spEntity,
      cast_group_entity: cast[0]?.entity_id ?? 'media_player.your_cast_group',
      device_name: (cast[0]?.attributes.friendly_name as string) ?? 'Speaker group',
      speakers: cast.slice(1, 5).map((s) => s.entity_id),
      presets: [],
      playlist_layout: 'tiles',
      playlist_sort: 'last_played',
      playlist_count: 6,
    };
  }

  setConfig(config: SpCardConfig): void {
    const prev = this._config;
    const next = normalizeSpConfig(config);
    this._config = next;
    if (!prev || prev.history_key !== next.history_key || prev.spotifyplus_entity !== next.spotifyplus_entity) {
      this._historyLoaded = false;
      this._history = EMPTY_HISTORY;
      this._plStatus = 'idle';
      if (this._hass) void this._refresh();
    }
  }

  protected override hassChanged(hass: HomeAssistant, first: boolean): void {
    this._checkStarted(hass);
    if (first && this._plStatus === 'idle') void this._refresh();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._intervalTimer = window.setInterval(() => {
      if (document.visibilityState === 'visible') void this._refresh();
    }, REFRESH_INTERVAL_MS);
    if (this._hass && this._config && this._plStatus !== 'loading') void this._refresh();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    for (const t of [this._refreshTimer, this._intervalTimer, this._startTimer]) if (t) window.clearTimeout(t);
    if (this._intervalTimer) window.clearInterval(this._intervalTimer);
  }

  // ---- history / playlists ----------------------------------------------

  private get _playlists(): Playlist[] {
    const cfg = this._config;
    if (!cfg) return [];
    const played = sortedPlaylists(this._history, cfg.playlist_sort, cfg.playlist_count);
    return cfg.fill_with_favorites ? fillWithFavorites(played, this._favorites, cfg.playlist_count) : played;
  }

  private async _ensureFavorites(hass: HomeAssistant, cfg: SpNormalizedConfig): Promise<void> {
    if (Date.now() - this._favoritesAt < FAVORITES_TTL_MS) return;
    this._favorites = await sp.getPlaylistFavorites(hass, cfg.spotifyplus_entity, 50);
    this._favoritesAt = Date.now();
  }

  private async _refresh(): Promise<void> {
    const hass = this._hass;
    const cfg = this._config;
    if (!hass || !cfg || this._refreshing) return;
    this._refreshing = true;
    if (!Object.keys(this._history.entries).length) this._plStatus = 'loading';
    try {
      if (!this._historyLoaded) {
        const stored = await sp.loadUserData<unknown>(hass, cfg.history_key);
        if (isHistoryStore(stored)) this._history = stored;
        this._historyLoaded = true;
      }
      const before = this._history;
      const recent = await sp.getRecentTracks(hass, cfg.spotifyplus_entity, before.lastSeen);
      let store = mergeRecent(before, recent);
      if (cfg.fill_with_favorites) await this._ensureFavorites(hass, cfg);
      store = await this._fillMeta(hass, cfg, store);
      store = prune(store);
      this._history = store;
      this._plStatus = 'ready';
      this._plError = '';
      if (store !== before) await sp.saveUserData(hass, cfg.history_key, store);
    } catch (e) {
      this._plStatus = 'error';
      this._plError = errorText(e);
    } finally {
      this._refreshing = false;
    }
  }

  /** Names and artwork for playlists we only know by uri: favourites first, then single lookups. */
  private async _fillMeta(hass: HomeAssistant, cfg: SpNormalizedConfig, store: HistoryStore): Promise<HistoryStore> {
    let missing = missingMeta(store);
    if (!missing.length) return store;
    await this._ensureFavorites(hass, cfg);
    store = applyMeta(store, this._favorites);
    missing = missingMeta(store);
    const found: sp.PlaylistMeta[] = [];
    for (const uri of missing.slice(0, MAX_META_LOOKUPS_PER_REFRESH)) {
      try {
        const meta = await sp.getPlaylistMeta(hass, cfg.spotifyplus_entity, uri);
        if (meta) found.push(meta);
        else found.push({ uri, name: 'Playlist', image: null });
      } catch {
        /* keep for the next refresh */
      }
    }
    return applyMeta(store, found);
  }

  private _scheduleRefresh(ms: number): void {
    if (this._refreshTimer) window.clearTimeout(this._refreshTimer);
    this._refreshTimer = window.setTimeout(() => void this._refresh(), ms);
  }

  // ---- start playback ----------------------------------------------------

  private _play(pl: Playlist): void {
    const hass = this._hass;
    const cfg = this._config;
    if (!hass || !cfg) return;
    const spState = hass.states[cfg.spotifyplus_entity]?.state;
    if (!spState || spState === 'unavailable' || spState === 'unknown') {
      this.showToast(`${cfg.spotifyplus_entity} is unavailable. Check the SpotifyPlus integration.`);
      return;
    }
    if (this._starting) {
      this.showToast(`Still starting on ${cfg.device_name}…`);
      return;
    }
    this.applyDefaultPresetIfCold(hass, isGroupCold(hass, cfg.cast_group_entity));
    this._starting = { uri: pl.uri, since: Date.now() };
    this._activeUri = pl.uri;
    this._history = noteStarted(this._history, pl, Date.now());
    if (this._startTimer) window.clearTimeout(this._startTimer);
    this._startTimer = window.setTimeout(() => {
      if (this._starting?.uri === pl.uri) {
        this._starting = null;
        this.showToast(`${cfg.device_name} did not start within 60 s. Check the speakers and try again.`, 6000);
      }
    }, START_TIMEOUT_MS);
    const start = () => sp.playContext(hass, cfg.spotifyplus_entity, pl.uri, cfg.device_name, cfg.shuffle);
    start()
      .catch(async (e: unknown) => {
        // A stale Cast address inside SpotifyPlus shows up as "could not activate … timed out".
        // Refresh its device list once and try again before giving up.
        this.showToast(`${errorText(e)} Retrying with a refreshed device list…`, 6000);
        await sp.refreshDevices(hass, cfg.spotifyplus_entity);
        if (this._starting?.uri !== pl.uri) return;
        await start();
      })
      .then(() => this._scheduleRefresh(REFRESH_AFTER_START_MS))
      .catch((e: unknown) => {
        this._starting = null;
        this.showToast(errorText(e), 8000);
      });
  }

  /** Playback landed on the Cast group: clear the busy state. */
  private _checkStarted(hass: HomeAssistant): void {
    const cfg = this._config;
    if (!cfg || !this._starting) return;
    const g = hass.states[cfg.cast_group_entity];
    const app = typeof g?.attributes.app_name === 'string' ? g.attributes.app_name : '';
    if (g?.state === 'playing' && /spotify/i.test(app) && hass.states[cfg.cast_group_entity].last_updated > new Date(this._starting.since).toISOString()) {
      this._starting = null;
      if (this._startTimer) window.clearTimeout(this._startTimer);
    }
  }

  // ---- render ------------------------------------------------------------

  protected override render(): TemplateResult | typeof nothing {
    const cfg = this._config;
    const hass = this._hass;
    if (!cfg) return nothing;
    if (!hass) return html`<ha-card><div class="card"></div></ha-card>`;

    const now = Date.now();
    const speakers = this.speakers(hass, now);
    const np = deriveNowPlaying(hass, this._playerEntity);
    const spAttrs = hass.states[cfg.spotifyplus_entity]?.attributes ?? {};
    const playlistName =
      (typeof spAttrs.media_playlist === 'string' && spAttrs.media_playlist) ||
      this._history.entries[this._activeUri ?? '']?.name ||
      '';
    const starting = this._starting;
    const startingName = starting ? this._history.entries[starting.uri]?.name || 'playlist' : '';
    const unavailable = np.found && (np.state === 'unavailable' || np.state === 'unknown');
    const player = this._playerEntity;

    const left = html`
      ${this.renderHeader(cfg.title, speakers)}
      ${this.renderPlaylists({
        layout: cfg.playlist_layout,
        count: cfg.playlist_count,
        columns: cfg.tile_columns,
        playlists: this._playlists,
        status: this._plStatus,
        error: this._plError,
        activeUri: this._activeUri,
        onPlay: (pl) => this._play(pl),
        onRetry: () => void this._refresh(),
      })}
      ${this.renderNowBar(np, now, {
        title: starting ? `Starting on ${cfg.device_name}…` : undefined,
        subtitle: starting
          ? `${startingName} · ${Math.round((now - starting.since) / 1000)} s`
          : !np.found || unavailable
            ? player
            : [np.artist, playlistName].filter(Boolean).join(' · '),
        busy: !!starting,
        disabled: !!starting,
        onPrev: () => media.prevTrack(hass, player),
        onPlayPause: () => media.playPause(hass, player),
        onNext: () => media.nextTrack(hass, player),
        onSeek: (s) => media.seek(hass, player, s),
      })}
    `;
    return this.renderShell(left, this.renderSpeakerSection(speakers), [this.renderPicker(speakers), this.renderToast()]);
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'spotifyplus-media-card',
  name: 'Spotify Media Card (SpotifyPlus)',
  description: 'Start Spotify playlists on a Chromecast speaker group as a Spotify Connect session, via SpotifyPlus.',
  preview: false,
});
