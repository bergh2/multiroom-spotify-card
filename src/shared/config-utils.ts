import type { CardLayout, MasterStyle, PlaylistLayout, PlaylistSort, PresetConfig, SpeakerConfig, SpeakerSectionConfig } from './types';

export const DEFAULT_ACCENT = 'oklch(0.62 0.16 285)';

export function fail(card: string, msg: string): never {
  throw new Error(`${card}: ${msg}`);
}

export function isMediaPlayer(id: unknown): id is string {
  return typeof id === 'string' && /^media_player\.[a-z0-9_]+$/.test(id);
}

export function intInRange(card: string, value: unknown, name: string, min: number, max: number, fallback: number): number {
  if (value === undefined || value === null || value === '') return fallback;
  const n = typeof value === 'string' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
    fail(card, `${name} must be an integer between ${min} and ${max}`);
  }
  return n;
}

export function normalizeSpeakers(card: string, raw: unknown): SpeakerConfig[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    fail(card, 'speakers must be a non-empty list of Google Cast media_player entities');
  }
  const out: SpeakerConfig[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const entity = typeof item === 'string' ? item : (item as SpeakerConfig)?.entity;
    if (!isMediaPlayer(entity)) fail(card, `speaker "${String(entity)}" is not a media_player entity`);
    if (seen.has(entity)) fail(card, `speaker ${entity} is listed twice`);
    seen.add(entity);
    const name =
      typeof item === 'object' && item && typeof item.name === 'string' && item.name.trim() ? item.name.trim() : undefined;
    out.push(name ? { entity, name } : { entity });
  }
  return out;
}

export function normalizePresets(card: string, raw: unknown, speakers: SpeakerConfig[]): PresetConfig[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) fail(card, 'presets must be a list');
  const known = new Set(speakers.map((s) => s.entity));
  const names = new Set<string>();
  return raw.map((p, i) => {
    const name = typeof p?.name === 'string' ? p.name.trim() : '';
    if (!name) fail(card, `preset #${i + 1} needs a name`);
    if (names.has(name)) fail(card, `preset "${name}" is defined twice`);
    names.add(name);
    const levelsRaw = p.levels ?? {};
    if (typeof levelsRaw !== 'object' || Array.isArray(levelsRaw)) {
      fail(card, `preset "${name}": levels must be a map of entity -> volume`);
    }
    const levels: Record<string, number> = {};
    for (const [entity, level] of Object.entries(levelsRaw as Record<string, unknown>)) {
      if (!known.has(entity)) fail(card, `preset "${name}": ${entity} is not in speakers`);
      const n = typeof level === 'string' ? Number(level) : level;
      if (typeof n !== 'number' || !Number.isInteger(n) || n < 0 || n > 100) {
        fail(card, `preset "${name}": volume for ${entity} must be an integer 0-100`);
      }
      levels[entity] = n;
    }
    return { name, levels };
  });
}

export interface RawSpeakerSection {
  speakers?: unknown;
  presets?: unknown;
  speaker_count?: unknown;
  preset_tolerance?: unknown;
  master_volume?: unknown;
  master_label?: unknown;
  master_style?: unknown;
  default_preset?: unknown;
  layout?: unknown;
}

/** Validates the speaker/preset part shared by both cards. */
export function normalizeSpeakerSection(card: string, raw: RawSpeakerSection): SpeakerSectionConfig {
  const speakers = normalizeSpeakers(card, raw.speakers);
  const presets = normalizePresets(card, raw.presets, speakers);
  const defaultPreset = typeof raw.default_preset === 'string' ? raw.default_preset.trim() : '';
  if (defaultPreset && !presets.some((p) => p.name === defaultPreset)) {
    fail(card, `default_preset "${defaultPreset}" is not one of the presets`);
  }
  const layout = (raw.layout ?? 'vertical') as CardLayout;
  if (!['vertical', 'horizontal', 'auto'].includes(layout)) fail(card, 'layout must be "vertical", "horizontal" or "auto"');
  const masterStyle = (raw.master_style ?? 'plain') as MasterStyle;
  if (!['plain', 'panel', 'tree'].includes(masterStyle)) fail(card, 'master_style must be "plain", "panel" or "tree"');
  return {
    layout,
    master_label: normalizeText(raw.master_label, 'All'),
    master_style: masterStyle,
    speakers,
    presets,
    speaker_count: intInRange(card, raw.speaker_count, 'speaker_count', 1, 50, speakers.length),
    preset_tolerance: intInRange(card, raw.preset_tolerance, 'preset_tolerance', 0, 50, 3),
    master_volume: raw.master_volume !== false,
    default_preset: defaultPreset,
  };
}

export interface RawPlaylistView {
  playlist_layout?: unknown;
  playlist_sort?: unknown;
  playlist_count?: unknown;
  tile_columns?: unknown;
  tile_columns_wide?: unknown;
}

export function normalizePlaylistView(card: string, raw: RawPlaylistView) {
  const layout = (raw.playlist_layout ?? 'tiles') as PlaylistLayout;
  if (layout !== 'tiles' && layout !== 'list') fail(card, 'playlist_layout must be "tiles" or "list"');
  const sort = (raw.playlist_sort ?? 'last_played') as PlaylistSort;
  if (sort !== 'last_played' && sort !== 'play_count') fail(card, 'playlist_sort must be "last_played" or "play_count"');
  const tileColumns = intInRange(card, raw.tile_columns, 'tile_columns', 2, 8, 3);
  return {
    playlist_layout: layout,
    playlist_sort: sort,
    playlist_count: intInRange(card, raw.playlist_count, 'playlist_count', 1, 50, layout === 'list' ? 10 : 6),
    tile_columns: tileColumns,
    /** playlists per row when the card renders two columns (horizontal / auto when wide) */
    tile_columns_wide: intInRange(card, raw.tile_columns_wide, 'tile_columns_wide', 2, 8, tileColumns),
  };
}

export function normalizeText(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}
