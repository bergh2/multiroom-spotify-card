import type { HomeAssistant } from '../shared/types';

export interface RecentTrack {
  /** context uri (spotify:playlist:… etc.) or null */
  contextUri: string | null;
  /** epoch ms */
  playedAt: number;
  trackName: string;
}

export interface PlaylistMeta {
  uri: string;
  name: string;
  image: string | null;
}

type Dict = Record<string, unknown>;

/** SpotifyPlus responses wrap the payload in `result`; property names vary in case between versions. */
function unwrap(res: unknown): Dict {
  const r = res && typeof res === 'object' ? (res as { response?: unknown }).response : undefined;
  const inner = r && typeof r === 'object' ? ((r as Dict).result ?? r) : {};
  return (inner && typeof inner === 'object' ? inner : {}) as Dict;
}

function pick<T = unknown>(o: Dict | undefined, ...keys: string[]): T | undefined {
  if (!o) return undefined;
  for (const k of keys) if (o[k] !== undefined && o[k] !== null) return o[k] as T;
  return undefined;
}

function items(o: Dict): Dict[] {
  const arr = pick<unknown>(o, 'items', 'Items');
  return Array.isArray(arr) ? (arr.filter((x) => x && typeof x === 'object') as Dict[]) : [];
}

export function toPlaylistMeta(p: Dict): PlaylistMeta | null {
  const uri = pick<string>(p, 'uri', 'Uri');
  const name = pick<string>(p, 'name', 'Name');
  if (typeof uri !== 'string' || typeof name !== 'string') return null;
  let image = pick<string>(p, 'image_url', 'ImageUrl');
  if (!image) {
    const imgs = pick<Dict[]>(p, 'images', 'Images');
    if (Array.isArray(imgs) && imgs[0]) image = pick<string>(imgs[0], 'url', 'Url');
  }
  return { uri, name, image: typeof image === 'string' && image ? image : null };
}

export function toRecentTracks(res: unknown): RecentTrack[] {
  const out: RecentTrack[] = [];
  for (const it of items(unwrap(res))) {
    const ctx = pick<Dict>(it, 'context', 'Context');
    const contextUri = ctx ? (pick<string>(ctx, 'uri', 'Uri') ?? null) : null;
    const ms = pick<number>(it, 'played_at_ms', 'PlayedAtMS');
    const iso = pick<string>(it, 'played_at', 'PlayedAt');
    const playedAt = typeof ms === 'number' ? ms : typeof iso === 'string' ? Date.parse(iso) : NaN;
    if (!Number.isFinite(playedAt)) continue;
    const track = pick<Dict>(it, 'track', 'Track');
    out.push({ contextUri, playedAt, trackName: (track && pick<string>(track, 'name', 'Name')) ?? '' });
  }
  return out;
}

const call = (hass: HomeAssistant, service: string, data: Record<string, unknown>) =>
  hass.callService('spotifyplus', service, data, undefined, false, true);

/** Last played tracks (max 50), newest first, with the playlist they came from. */
export async function getRecentTracks(hass: HomeAssistant, entity: string, afterMs?: number): Promise<RecentTrack[]> {
  const data: Record<string, unknown> = { entity_id: entity, limit: 50 };
  if (afterMs && afterMs > 0) data.after = afterMs;
  const res = await call(hass, 'get_player_recent_tracks', data);
  return toRecentTracks(res).sort((a, b) => b.playedAt - a.playedAt);
}

/** The user's followed/owned playlists with artwork. */
export async function getPlaylistFavorites(hass: HomeAssistant, entity: string, limit = 50): Promise<PlaylistMeta[]> {
  const res = await call(hass, 'get_playlist_favorites', { entity_id: entity, limit });
  return items(unwrap(res)).map(toPlaylistMeta).filter((p): p is PlaylistMeta => !!p);
}

/** Metadata for one playlist the user does not follow. */
export async function getPlaylistMeta(hass: HomeAssistant, entity: string, uri: string): Promise<PlaylistMeta | null> {
  const id = uri.split(':').pop() ?? uri;
  const res = await call(hass, 'get_playlist', { entity_id: entity, playlist_id: id });
  const meta = toPlaylistMeta(unwrap(res));
  return meta ? { ...meta, uri } : null;
}

/** Start a context (playlist) on a Spotify Connect device by name; wakes idle Chromecasts. */
export const playContext = (hass: HomeAssistant, entity: string, contextUri: string, deviceName: string, shuffle: boolean) =>
  hass.callService('spotifyplus', 'player_media_play_context', {
    entity_id: entity,
    context_uri: contextUri,
    device_id: deviceName,
    shuffle,
  });

/** Force SpotifyPlus to rediscover Spotify Connect / Cast devices (fixes stale host addresses). */
export const refreshDevices = (hass: HomeAssistant, entity: string) =>
  hass.callService('spotifyplus', 'get_spotify_connect_devices', { entity_id: entity, refresh: true }, undefined, false, true);

// ---- shared play history in HA user data ---------------------------------

export async function loadUserData<T>(hass: HomeAssistant, key: string): Promise<T | null> {
  const res = await hass.callWS<{ value?: T | null }>({ type: 'frontend/get_user_data', key });
  return res?.value ?? null;
}

export async function saveUserData<T>(hass: HomeAssistant, key: string, value: T): Promise<void> {
  await hass.callWS({ type: 'frontend/set_user_data', key, value });
}
