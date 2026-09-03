import { html, nothing, type TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { normalizeConfig } from './ma/config';
import type { CardConfig, HomeAssistant, NormalizedConfig, Playlist } from './types';
import { deriveNowPlaying, errorText, isGroupCold } from './shared/derive';
import { SpeakerCardBase, type PlaylistStatus } from './shared/speaker-card-base';
import { discoverEntryId, getPlaylists } from './ma/library';
import * as media from './shared/media-services';
import { playPlaylist } from './ma/services';
import './ma/editor';

declare global {
  interface HTMLElementTagNameMap {
    'spotify-media-card': SpotifyMediaCard;
  }
}

const REFETCH_AFTER_PLAY_MS = 3000;

/** Music Assistant flavour: MA plays to its group entity, playlists come from MA's library. */
@customElement('spotify-media-card')
export class SpotifyMediaCard extends SpeakerCardBase {
  @state() private _config?: NormalizedConfig;
  @state() private _playlists: Playlist[] = [];
  @state() private _plStatus: PlaylistStatus = 'idle';
  @state() private _plError = '';
  @state() private _activeUri: string | null = null;

  private _entryId = '';
  private _refetchTimer?: number;
  private _fetchSeq = 0;

  protected get section(): NormalizedConfig | undefined {
    return this._config;
  }
  protected get groupEntity(): string | undefined {
    return this._config?.group_entity;
  }
  protected get accent(): string {
    return this._config?.accent ?? '';
  }

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

  protected override hassChanged(hass: HomeAssistant, first: boolean): void {
    this._syncActiveWithPlayer(hass);
    if (first && this._plStatus === 'idle') void this._ensurePlaylists();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this._hass && this._config && this._plStatus !== 'loading') void this._ensurePlaylists();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._refetchTimer) window.clearTimeout(this._refetchTimer);
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
      const items = await getPlaylists(hass, { entryId: this._entryId, sort: cfg.playlist_sort, limit: cfg.playlist_count, force });
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
    const groupState = hass.states[cfg.group_entity]?.state;
    if (!groupState || groupState === 'unavailable' || groupState === 'unknown') {
      this.showToast(`${cfg.group_entity} is unavailable. Check the Music Assistant integration.`);
      return;
    }
    this._activeUri = pl.uri;
    this._saveActive(cfg.group_entity, pl.uri);
    this.applyDefaultPresetIfCold(hass, isGroupCold(hass, cfg.group_entity));
    this.run(
      playPlaylist(hass, cfg.group_entity, pl.uri).then(() => {
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

  // ---- render ------------------------------------------------------------

  protected override render(): TemplateResult | typeof nothing {
    const cfg = this._config;
    const hass = this._hass;
    if (!cfg) return nothing;
    if (!hass) return html`<ha-card><div class="card"></div></ha-card>`;

    const now = Date.now();
    const speakers = this.speakers(hass, now);
    const np = deriveNowPlaying(hass, cfg.group_entity);
    const active = this._playlists.find((p) => p.uri === this._activeUri) ?? null;
    const unavailable = np.found && (np.state === 'unavailable' || np.state === 'unknown');
    const subtitle = !np.found || unavailable ? cfg.group_entity : [np.artist, active?.name].filter(Boolean).join(' · ');

    return html`
      <ha-card>
        <div class="card">
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
            onRetry: () => void this._ensurePlaylists(true),
          })}
          ${this.renderSpeakerSection(speakers)}
          ${this.renderNowBar(np, now, {
            subtitle,
            onPrev: () => media.prevTrack(hass, cfg.group_entity),
            onPlayPause: () => media.playPause(hass, cfg.group_entity),
            onNext: () => media.nextTrack(hass, cfg.group_entity),
            onSeek: (s) => media.seek(hass, cfg.group_entity, s),
          })}
          ${this.renderPicker(speakers)} ${this.renderToast()}
        </div>
      </ha-card>
    `;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: 'spotify-media-card',
  name: 'Spotify Media Card (Music Assistant)',
  description: 'Start Spotify playlists on multi-room Chromecast speakers through Music Assistant.',
  preview: false,
});
