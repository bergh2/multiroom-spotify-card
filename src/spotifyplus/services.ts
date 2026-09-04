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
  /** Spotify user id of the playlist owner, when known */
  ownerId?: string;
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
  const owner = pick<Dict>(p, 'owner', 'Owner');
  const ownerId = owner ? pick<string>(owner, 'id', 'Id') : undefined;
  const meta: PlaylistMeta = { uri, name, image: typeof image === 'string' && image ? image : null };
  if (typeof ownerId === 'string' && ownerId) meta.ownerId = ownerId;
  return meta;
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

/** All of the user's followed/owned playlists with artwork (paged by SpotifyPlus up to `limitTotal`). */
export async function getPlaylistFavorites(hass: HomeAssistant, entity: string, limitTotal = 500): Promise<PlaylistMeta[]> {
  const res = await call(hass, 'get_playlist_favorites', { entity_id: entity, limit: 50, limit_total: limitTotal });
  return items(unwrap(res)).map(toPlaylistMeta).filter((p): p is PlaylistMeta => !!p);
}

/** Metadata for one playlist the user does not follow. */
export async function getPlaylistMeta(hass: HomeAssistant, entity: string, uri: string): Promise<PlaylistMeta | null> {
  const id = uri.split(':').pop() ?? uri;
  const res = await call(hass, 'get_playlist', { entity_id: entity, playlist_id: id });
  const meta = toPlaylistMeta(unwrap(res));
  return meta ? { ...meta, uri } : null;
}

/** Start a context (playlist) on a Spotify Connect device by name; wakes idle Chromecasts. The card shows its own errors, so HA's toast is suppressed. */
export const playContext = (hass: HomeAssistant, entity: string, contextUri: string, deviceName: string, shuffle: boolean) =>
  hass.callService(
    'spotifyplus',
    'player_media_play_context',
    { entity_id: entity, context_uri: contextUri, device_id: deviceName, shuffle },
    undefined,
    false,
  );

/** Names in SpotifyPlus' device directory (empty right after a reload while discovery runs). */
export async function listDeviceNames(hass: HomeAssistant, entity: string, refresh = false): Promise<string[]> {
  const res = await call(hass, 'get_spotify_connect_devices', { entity_id: entity, refresh });
  return items(unwrap(res))
    .map((d) => pick<string>(d, 'name', 'Name'))
    .filter((n): n is string => typeof n === 'string');
}

/**
 * After a reload SpotifyPlus rebuilds its device directory in the background; a
 * play command sent before the group is back in it fails again. Poll until the
 * device shows up, then give discovery a few more seconds to settle.
 */
export async function waitForDevice(hass: HomeAssistant, entity: string, deviceName: string, timeoutMs = 45_000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const names = await listDeviceNames(hass, entity, false);
      if (names.some((n) => n.toLowerCase() === deviceName.toLowerCase())) {
        await new Promise((r) => setTimeout(r, 5000));
        return true;
      }
    } catch {
      /* directory not ready */
    }
    await new Promise((r) => setTimeout(r, 3000));
  }
  return false;
}

/** Force SpotifyPlus to rediscover Spotify Connect / Cast devices. Not enough for a stale Cast group host; see reloadIntegration. */
export const refreshDevices = (hass: HomeAssistant, entity: string) =>
  hass.callService('spotifyplus', 'get_spotify_connect_devices', { entity_id: entity, refresh: true }, undefined, false, true);

/**
 * Reload the SpotifyPlus config entry (admin only). This is the one thing that clears a
 * stale Cast group address after the group re-forms. Resolves once the player entity is
 * back, or throws if the user cannot administer config entries.
 */
export async function reloadIntegration(hass: HomeAssistant, entity: string, timeoutMs = 30_000): Promise<void> {
  if (!hass.callApi) throw new Error('config entry reload not available');
  const entries = await hass.callWS<Array<{ entry_id: string; domain: string }>>({ type: 'config_entries/get', domain: 'spotifyplus' });
  const entry = entries?.[0];
  if (!entry) throw new Error('SpotifyPlus config entry not found');
  await hass.callApi('POST', `config/config_entries/entry/${entry.entry_id}/reload`);
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 1000));
    const st = hass.states[entity]?.state;
    if (st && st !== 'unavailable' && st !== 'unknown') return;
  }
  throw new Error('SpotifyPlus did not come back after reload');
}

// ---- shared play history in HA user data ---------------------------------

export async function loadUserData<T>(hass: HomeAssistant, key: string): Promise<T | null> {
  const res = await hass.callWS<{ value?: T | null }>({ type: 'frontend/get_user_data', key });
  return res?.value ?? null;
}

export async function saveUserData<T>(hass: HomeAssistant, key: string, value: T): Promise<void> {
  await hass.callWS({ type: 'frontend/set_user_data', key, value });
}
