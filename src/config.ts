import type { CardConfig, NormalizedConfig, PresetConfig, SpeakerConfig } from './types';

export const DEFAULT_ACCENT = 'oklch(0.62 0.16 285)';

function fail(msg: string): never {
  throw new Error(`spotify-media-card: ${msg}`);
}

function isMediaPlayer(id: unknown): id is string {
  return typeof id === 'string' && /^media_player\.[a-z0-9_]+$/.test(id);
}

function intInRange(value: unknown, name: string, min: number, max: number, fallback: number): number {
  if (value === undefined || value === null || value === '') return fallback;
  const n = typeof value === 'string' ? Number(value) : value;
  if (typeof n !== 'number' || !Number.isInteger(n) || n < min || n > max) {
    fail(`${name} must be an integer between ${min} and ${max}`);
  }
  return n;
}

function normalizeSpeakers(raw: unknown): SpeakerConfig[] {
  if (!Array.isArray(raw) || raw.length === 0) {
    fail('speakers must be a non-empty list of Google Cast media_player entities');
  }
  const out: SpeakerConfig[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const entity = typeof item === 'string' ? item : (item as SpeakerConfig)?.entity;
    if (!isMediaPlayer(entity)) fail(`speaker "${String(entity)}" is not a media_player entity`);
    if (seen.has(entity)) fail(`speaker ${entity} is listed twice`);
    seen.add(entity);
    const name =
      typeof item === 'object' && item && typeof item.name === 'string' && item.name.trim()
        ? item.name.trim()
        : undefined;
    out.push(name ? { entity, name } : { entity });
  }
  return out;
}

function normalizePresets(raw: unknown, speakers: SpeakerConfig[]): PresetConfig[] {
  if (raw === undefined || raw === null) return [];
  if (!Array.isArray(raw)) fail('presets must be a list');
  const known = new Set(speakers.map((s) => s.entity));
  const names = new Set<string>();
  return raw.map((p, i) => {
    const name = typeof p?.name === 'string' ? p.name.trim() : '';
    if (!name) fail(`preset #${i + 1} needs a name`);
    if (names.has(name)) fail(`preset "${name}" is defined twice`);
    names.add(name);
    const levelsRaw = p.levels ?? {};
    if (typeof levelsRaw !== 'object' || Array.isArray(levelsRaw)) {
      fail(`preset "${name}": levels must be a map of entity -> volume`);
    }
    const levels: Record<string, number> = {};
    for (const [entity, level] of Object.entries(levelsRaw as Record<string, unknown>)) {
      if (!known.has(entity)) fail(`preset "${name}": ${entity} is not in speakers`);
      const n = typeof level === 'string' ? Number(level) : level;
      if (typeof n !== 'number' || !Number.isInteger(n) || n < 0 || n > 100) {
        fail(`preset "${name}": volume for ${entity} must be an integer 0-100`);
      }
      levels[entity] = n;
    }
    return { name, levels };
  });
}

export function normalizeConfig(raw: CardConfig): NormalizedConfig {
  if (!raw || typeof raw !== 'object') fail('invalid configuration');
  if (!isMediaPlayer(raw.group_entity)) {
    fail('group_entity must be the Music Assistant media_player entity of your Cast group');
  }
  const speakers = normalizeSpeakers(raw.speakers);
  const presets = normalizePresets(raw.presets, speakers);

  const layout = raw.playlist_layout ?? 'tiles';
  if (layout !== 'tiles' && layout !== 'list') fail('playlist_layout must be "tiles" or "list"');
  const sort = raw.playlist_sort ?? 'last_played';
  if (sort !== 'last_played' && sort !== 'play_count') {
    fail('playlist_sort must be "last_played" or "play_count"');
  }

  const defaultPreset = typeof raw.default_preset === 'string' ? raw.default_preset.trim() : '';
  if (defaultPreset && !presets.some((p) => p.name === defaultPreset)) {
    fail(`default_preset "${defaultPreset}" is not one of the presets`);
  }

  return {
    type: raw.type,
    group_entity: raw.group_entity,
    speakers,
    presets,
    default_preset: defaultPreset,
    master_volume: raw.master_volume !== false,
    playlist_layout: layout,
    playlist_sort: sort,
    playlist_count: intInRange(raw.playlist_count, 'playlist_count', 1, 50, layout === 'list' ? 10 : 6),
    tile_columns: intInRange(raw.tile_columns, 'tile_columns', 2, 6, 3),
    speaker_count: intInRange(raw.speaker_count, 'speaker_count', 1, 50, speakers.length),
    title: typeof raw.title === 'string' ? raw.title : 'Listening',
    accent: typeof raw.accent === 'string' && raw.accent.trim() ? raw.accent.trim() : DEFAULT_ACCENT,
    preset_tolerance: intInRange(raw.preset_tolerance, 'preset_tolerance', 0, 50, 3),
    ma_config_entry_id: typeof raw.ma_config_entry_id === 'string' ? raw.ma_config_entry_id.trim() : '',
  };
}
