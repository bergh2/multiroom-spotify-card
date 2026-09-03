import type { CardLayout, PlaylistLayout, PlaylistSort, PresetConfig, SpeakerConfig, SpeakerSectionConfig } from '../shared/types';
import { DEFAULT_ACCENT, fail, isMediaPlayer, normalizePlaylistView, normalizeSpeakerSection, normalizeText } from '../shared/config-utils';

export type ControlVia = 'cast' | 'spotifyplus';

/** Raw configuration of the SpotifyPlus card as written in YAML / by the editor. */
export interface SpCardConfig {
  type: string;
  /** SpotifyPlus media_player entity (default media_player.spotifyplus) */
  spotifyplus_entity?: string;
  /** Google Cast entity of the speaker group; now-playing and transport read from it */
  cast_group_entity: string;
  /** Spotify Connect device name the playlist is started on (the Cast group name) */
  device_name: string;
  control_via?: ControlVia;
  shuffle?: boolean;
  speakers: Array<string | SpeakerConfig>;
  presets?: PresetConfig[];
  default_preset?: string;
  master_volume?: boolean;
  playlist_layout?: PlaylistLayout;
  playlist_sort?: PlaylistSort;
  playlist_count?: number;
  tile_columns?: number;
  speaker_count?: number;
  preset_tolerance?: number;
  /** key of the shared play history in HA user data */
  history_key?: string;
  /** top up the grid with the user's own playlists until playlist_count is reached (default true) */
  fill_with_favorites?: boolean;
  /** vertical (default) | horizontal | auto */
  layout?: CardLayout;
  title?: string;
  accent?: string;
}

export interface SpNormalizedConfig extends SpeakerSectionConfig {
  type: string;
  spotifyplus_entity: string;
  cast_group_entity: string;
  device_name: string;
  control_via: ControlVia;
  shuffle: boolean;
  playlist_layout: PlaylistLayout;
  playlist_sort: PlaylistSort;
  playlist_count: number;
  tile_columns: number;
  history_key: string;
  fill_with_favorites: boolean;
  title: string;
  accent: string;
}

const CARD = 'spotifyplus-media-card';

export function normalizeSpConfig(raw: SpCardConfig): SpNormalizedConfig {
  if (!raw || typeof raw !== 'object') fail(CARD, 'invalid configuration');
  const spEntity = raw.spotifyplus_entity ?? 'media_player.spotifyplus';
  if (!isMediaPlayer(spEntity)) fail(CARD, 'spotifyplus_entity must be the SpotifyPlus media_player entity');
  if (!isMediaPlayer(raw.cast_group_entity)) {
    fail(CARD, 'cast_group_entity must be the Google Cast media_player entity of your speaker group');
  }
  const device = normalizeText(raw.device_name, '');
  if (!device) fail(CARD, 'device_name is required (the Spotify Connect name of your speaker group, e.g. "Alla")');
  const via = raw.control_via ?? 'cast';
  if (via !== 'cast' && via !== 'spotifyplus') fail(CARD, 'control_via must be "cast" or "spotifyplus"');
  return {
    type: raw.type,
    spotifyplus_entity: spEntity,
    cast_group_entity: raw.cast_group_entity,
    device_name: device,
    control_via: via,
    shuffle: raw.shuffle === true,
    ...normalizeSpeakerSection(CARD, raw),
    ...normalizePlaylistView(CARD, raw),
    history_key: normalizeText(raw.history_key, 'spotifyplus-media-card'),
    fill_with_favorites: raw.fill_with_favorites !== false,
    title: typeof raw.title === 'string' ? raw.title : 'Listening',
    accent: normalizeText(raw.accent, DEFAULT_ACCENT),
  };
}
