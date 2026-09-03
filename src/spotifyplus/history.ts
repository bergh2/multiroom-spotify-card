import type { Playlist, PlaylistSort } from '../shared/types';
import type { PlaylistMeta, RecentTrack } from './services';

export interface HistoryEntry {
  uri: string;
  name: string;
  image: string | null;
  /** epoch ms of the newest track played from this playlist */
  lastPlayed: number;
  /** number of tracks played from this playlist since the history started */
  plays: number;
}

export interface HistoryStore {
  version: 1;
  /** newest `playedAt` already counted, so refreshes never double count */
  lastSeen: number;
  entries: Record<string, HistoryEntry>;
}

export const EMPTY_HISTORY: HistoryStore = { version: 1, lastSeen: 0, entries: {} };

export function isPlaylistUri(uri: string | null): uri is string {
  return typeof uri === 'string' && /^spotify:playlist:[A-Za-z0-9]+$/.test(uri);
}

/** Fold newly played tracks into the store (immutable). Tracks at or before `lastSeen` are ignored. */
export function mergeRecent(store: HistoryStore, tracks: RecentTrack[]): HistoryStore {
  const entries: Record<string, HistoryEntry> = { ...store.entries };
  let lastSeen = store.lastSeen;
  for (const t of tracks) {
    if (t.playedAt <= store.lastSeen) continue;
    lastSeen = Math.max(lastSeen, t.playedAt);
    if (!isPlaylistUri(t.contextUri)) continue;
    const prev = entries[t.contextUri];
    entries[t.contextUri] = prev
      ? { ...prev, plays: prev.plays + 1, lastPlayed: Math.max(prev.lastPlayed, t.playedAt) }
      : { uri: t.contextUri, name: '', image: null, lastPlayed: t.playedAt, plays: 1 };
  }
  return { version: 1, lastSeen, entries };
}

/** Remember a playlist the card just started, so it shows up before Spotify reports it. */
export function noteStarted(store: HistoryStore, meta: PlaylistMeta, at: number): HistoryStore {
  const prev = store.entries[meta.uri];
  return {
    ...store,
    entries: {
      ...store.entries,
      [meta.uri]: prev
        ? { ...prev, name: meta.name || prev.name, image: meta.image ?? prev.image, lastPlayed: Math.max(prev.lastPlayed, at) }
        : { uri: meta.uri, name: meta.name, image: meta.image, lastPlayed: at, plays: 0 },
    },
  };
}

/** Fill in names/artwork from playlist metadata (immutable; unchanged store returned when nothing new). */
export function applyMeta(store: HistoryStore, metas: Iterable<PlaylistMeta>): HistoryStore {
  let changed = false;
  const entries = { ...store.entries };
  for (const m of metas) {
    const e = entries[m.uri];
    if (!e) continue;
    if (e.name !== m.name || (m.image && e.image !== m.image)) {
      entries[m.uri] = { ...e, name: m.name, image: m.image ?? e.image };
      changed = true;
    }
  }
  return changed ? { ...store, entries } : store;
}

/** Playlists in the store that still lack a name (need metadata). */
export function missingMeta(store: HistoryStore): string[] {
  return Object.values(store.entries)
    .filter((e) => !e.name)
    .map((e) => e.uri);
}

export function sortedPlaylists(store: HistoryStore, sort: PlaylistSort, limit: number): Playlist[] {
  const list = Object.values(store.entries).filter((e) => e.name);
  list.sort((a, b) => (sort === 'play_count' ? b.plays - a.plays || b.lastPlayed - a.lastPlayed : b.lastPlayed - a.lastPlayed));
  return list.slice(0, limit).map((e) => ({ uri: e.uri, name: e.name, image: e.image }));
}

/** Keep the store bounded: drop the least recently played beyond `max` entries. */
export function prune(store: HistoryStore, max = 200): HistoryStore {
  const all = Object.values(store.entries);
  if (all.length <= max) return store;
  all.sort((a, b) => b.lastPlayed - a.lastPlayed);
  const entries: Record<string, HistoryEntry> = {};
  for (const e of all.slice(0, max)) entries[e.uri] = e;
  return { ...store, entries };
}

export function isHistoryStore(v: unknown): v is HistoryStore {
  return !!v && typeof v === 'object' && (v as HistoryStore).version === 1 && typeof (v as HistoryStore).entries === 'object';
}
