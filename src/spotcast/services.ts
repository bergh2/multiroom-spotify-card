import type { HomeAssistant } from '../shared/types';
import { toPlaylistMeta, type PlaylistMeta } from '../spotifyplus/services';

/**
 * Spotcast backend (https://github.com/Mincka/spotcast, v6+).
 *
 * Spotcast starts playback through the Google Cast connection Home Assistant already
 * holds for the group, so it always reaches the group's current leader. It has no
 * "recently played" endpoint; the card builds its history from its own starts plus the
 * playback context Spotcast reports while music plays (see the card).
 */

type Dict = Record<string, unknown>;

export interface PlaybackContext {
  /** spotify:playlist:… (or album/artist) currently playing, if any */
  contextUri: string | null;
  isPlaying: boolean;
  /** Spotify Connect device the playback runs on */
  deviceName: string;
  trackName: string;
}

const ws = <T>(hass: HomeAssistant, msg: Dict) => hass.callWS<T>(msg);
const withAccount = (msg: Dict, account?: string): Dict => (account ? { ...msg, account } : msg);

/**
 * The user's playlists (followed and owned), in Spotify's order, with artwork and owner.
 * Spotify pages 50 at a time and every page is one call against the smallest quota
 * bucket, so the default fetches a single page; names of older playlists come from oEmbed.
 */
export async function getPlaylists(hass: HomeAssistant, account?: string, limit = 50): Promise<PlaylistMeta[]> {
  const res = await ws<{ playlists?: Dict[] }>(hass, withAccount({ type: 'spotcast/playlists', limit }, account));
  return (res?.playlists ?? []).map(toPlaylistMeta).filter((p): p is PlaylistMeta => !!p);
}

export function toPlaybackContext(res: unknown): PlaybackContext {
  const state = (res && typeof res === 'object' ? (res as { state?: Dict }).state : undefined) ?? {};
  const ctx = state.context as Dict | undefined;
  const dev = state.device as Dict | undefined;
  const item = state.item as Dict | undefined;
  return {
    contextUri: ctx && typeof ctx.uri === 'string' ? ctx.uri : null,
    isPlaying: state.is_playing === true,
    deviceName: dev && typeof dev.name === 'string' ? dev.name : '',
    trackName: item && typeof item.name === 'string' ? item.name : '',
  };
}

/** What the account is playing right now (one Spotify API call). */
export async function getPlaybackContext(hass: HomeAssistant, account?: string): Promise<PlaybackContext> {
  return toPlaybackContext(await ws(hass, withAccount({ type: 'spotcast/player' }, account)));
}

/** Spotify user id of the Spotcast account (the default one unless `account` is given). */
export async function getAccountId(hass: HomeAssistant, account?: string): Promise<string | null> {
  const res = await ws<{ accounts?: Array<{ entry_id?: string; spotify_id?: string; is_default?: boolean }> }>(hass, { type: 'spotcast/accounts' });
  const list = res?.accounts ?? [];
  const acc = account ? list.find((a) => a.entry_id === account) : (list.find((a) => a.is_default) ?? list[0]);
  return acc?.spotify_id ?? null;
}

/**
 * Start a context on a Cast entity. Spotcast launches the Spotify app on the group,
 * logs the group in and transfers playback; the call resolves when the transfer is
 * accepted and rejects with the reason otherwise (the card shows it).
 */
export const playMedia = (hass: HomeAssistant, castEntity: string, contextUri: string, shuffle: boolean, account?: string) =>
  hass.callService(
    'spotcast',
    'play_media',
    withAccount({ media_player: { entity_id: castEntity }, spotify_uri: contextUri, data: { shuffle } }, account),
    undefined,
    false,
  );

/**
 * Name and artwork of any public playlist through Spotify's oEmbed endpoint: no token,
 * no API quota, CORS-enabled. Used for playlists the user plays without following.
 */
export async function oembedMeta(uri: string, fetchFn: typeof fetch = fetch): Promise<PlaylistMeta | null> {
  try {
    const r = await fetchFn(`https://open.spotify.com/oembed?url=${encodeURIComponent(uri)}`);
    if (!r.ok) return null;
    const d = (await r.json()) as { title?: unknown; thumbnail_url?: unknown };
    if (typeof d.title !== 'string' || !d.title) return null;
    return { uri, name: d.title, image: typeof d.thumbnail_url === 'string' ? d.thumbnail_url : null };
  } catch {
    return null;
  }
}
