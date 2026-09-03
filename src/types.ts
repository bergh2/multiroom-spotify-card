import type { CardLayout, PlaylistLayout, PlaylistSort, PresetConfig, SpeakerConfig, SpeakerSectionConfig } from './shared/types';

export * from './shared/types';

/** Raw configuration of the Music Assistant card as written in YAML / by the editor. */
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
  /** vertical (default) | horizontal | auto */
  layout?: CardLayout;
}

export interface NormalizedConfig extends SpeakerSectionConfig {
  type: string;
  group_entity: string;
  playlist_layout: PlaylistLayout;
  playlist_sort: PlaylistSort;
  playlist_count: number;
  tile_columns: number;
  title: string;
  accent: string;
  ma_config_entry_id: string;
}
