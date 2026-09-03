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

/** Minimal subset of the HA frontend `hass` object the cards rely on. */
export interface HomeAssistant {
  states: Record<string, HassEntity>;
  themes?: { darkMode?: boolean };
  language?: string;
  user?: { id?: string; name?: string };
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

/** Options shared by both cards' speaker sections. */
export interface SpeakerSectionConfig {
  speakers: SpeakerConfig[];
  presets: PresetConfig[];
  speaker_count: number;
  preset_tolerance: number;
  master_volume: boolean;
  default_preset: string;
}
