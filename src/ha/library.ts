import type { HomeAssistant, Playlist, PlaylistSort } from '../types';

const TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { at: number; items: Playlist[] }>();

export const ORDER_BY: Record<PlaylistSort, string> = {
  last_played: 'last_played_desc',
  play_count: 'play_count_desc',
};

interface ConfigEntry {
  entry_id: string;
  domain: string;
  state: string;
  title?: string;
}

export async function discoverEntryId(hass: HomeAssistant): Promise<string> {
  const entries = await hass.callWS<ConfigEntry[]>({ type: 'config_entries/get', domain: 'music_assistant' });
  const list = Array.isArray(entries) ? entries : [];
  const entry = list.find((e) => e.state === 'loaded') ?? list[0];
  if (!entry) throw new Error('Music Assistant integration not found');
  return entry.entry_id;
}

/** MA returns `image` as an absolute proxy URL string (or null); handle a few shapes defensively. */
export function resolveImage(image: unknown): string | null {
  if (!image) return null;
  if (typeof image === 'string') {
    const s = image.trim();
    return s ? s : null;
  }
  if (typeof image === 'object') {
    const o = image as Record<string, unknown>;
    for (const key of ['url', 'path']) {
      const v = o[key];
      if (typeof v === 'string' && /^(https?:)?\/\//.test(v)) return v;
    }
  }
  return null;
}

export function normalizeItems(items: unknown): Playlist[] {
  if (!Array.isArray(items)) return [];
  const out: Playlist[] = [];
  for (const it of items) {
    if (!it || typeof it !== 'object') continue;
    const o = it as Record<string, unknown>;
    if (typeof o.uri !== 'string' || typeof o.name !== 'string' || !o.uri) continue;
    out.push({ uri: o.uri, name: o.name, image: resolveImage(o.image) });
  }
  return out;
}

export function cacheKey(entryId: string, sort: PlaylistSort, limit: number): string {
  return `${entryId}|${sort}|${limit}`;
}

export function isCached(entryId: string, sort: PlaylistSort, limit: number): boolean {
  const hit = cache.get(cacheKey(entryId, sort, limit));
  return !!hit && Date.now() - hit.at < TTL_MS;
}

export async function getPlaylists(
  hass: HomeAssistant,
  opts: { entryId: string; sort: PlaylistSort; limit: number; force?: boolean },
): Promise<Playlist[]> {
  const key = cacheKey(opts.entryId, opts.sort, opts.limit);
  const hit = cache.get(key);
  if (!opts.force && hit && Date.now() - hit.at < TTL_MS) return hit.items;
  const res = await hass.callService(
    'music_assistant',
    'get_library',
    { config_entry_id: opts.entryId, media_type: 'playlist', order_by: ORDER_BY[opts.sort], limit: opts.limit },
    undefined,
    false,
    true,
  );
  const response =
    (res && typeof res === 'object' ? (res as { response?: { items?: unknown } }).response : undefined) ?? {};
  const items = normalizeItems(response.items);
  cache.set(key, { at: Date.now(), items });
  return items;
}

export function clearCache(): void {
  cache.clear();
}
