export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
}

export interface ServiceResponse<T = unknown> {
  context?: unknown;
  response?: T;
}

/** Minimal subset of the HA frontend `hass` object this card relies on. */
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  themes?: { darkMode?: boolean };
  language?: string;
  callService(
    domain: string,
    service: string,
    serviceData?: Record<string, unknown>,
    target?: { entity_id?: string | string[] },
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ): Promise<ServiceResponse | void>;
  callWS<T = unknown>(msg: Record<string, unknown>): Promise<T>;
}

export type PlaylistLayout = 'tiles' | 'list';
export type PlaylistSort = 'last_played' | 'play_count';

export interface SpeakerConfig {
  entity: string;
  name?: string;
}

export interface PresetConfig {
  name: string;
  /** entity_id -> volume 0..100; entities not listed are muted by the preset */
  levels: Record<string, number>;
}

/** Raw card configuration as written in YAML / by the editor. */
export interface CardConfig {
  type: string;
  group_entity: string;
  speakers: Array<string | SpeakerConfig>;
  presets?: PresetConfig[];
  playlist_layout?: PlaylistLayout;
  playlist_sort?: PlaylistSort;
  playlist_count?: number;
  tile_columns?: number;
  speaker_count?: number;
  title?: string;
  accent?: string;
  preset_tolerance?: number;
  ma_config_entry_id?: string;
  /** preset applied when a playlist is started while the group is cold and no speaker was touched */
  default_preset?: string;
  /** show the master volume row above the speakers (default true) */
  master_volume?: boolean;
}

export interface NormalizedConfig {
  type: string;
  group_entity: string;
  speakers: SpeakerConfig[];
  presets: PresetConfig[];
  playlist_layout: PlaylistLayout;
  playlist_sort: PlaylistSort;
  playlist_count: number;
  tile_columns: number;
  speaker_count: number;
  title: string;
  accent: string;
  preset_tolerance: number;
  ma_config_entry_id: string;
  default_preset: string;
  master_volume: boolean;
}

export interface Playlist {
  uri: string;
  name: string;
  image: string | null;
}

export interface Speaker {
  entity: string;
  name: string;
  /** 0..100 */
  vol: number;
  /** unmuted and available */
  on: boolean;
  available: boolean;
  /** entity is off/idle and reports no volume (Cast strips attributes while off) */
  standby: boolean;
  /** the group is playing but this speaker stays off: it is not a member of the Cast group */
  notInGroup: boolean;
}

export interface NowPlaying {
  found: boolean;
  state: string;
  playing: boolean;
  title: string;
  artist: string;
  art: string | null;
  duration: number | null;
  position: number | null;
  positionUpdatedAt: string | null;
}
