import { describe, expect, it } from 'vitest';
import { EMPTY_HISTORY, applyMeta, mergeRecent, missingMeta, noteStarted, prune, sortedPlaylists } from '../src/spotifyplus/history';
import { toPlaylistMeta, toRecentTracks } from '../src/spotifyplus/services';

const t = (uri: string | null, playedAt: number, name = 'x') => ({ contextUri: uri, playedAt, trackName: name });
const A = 'spotify:playlist:AAAAAAAAAAAAAAAAAAAAAA';
const B = 'spotify:playlist:BBBBBBBBBBBBBBBBBBBBBB';

describe('mergeRecent', () => {
  it('counts tracks per playlist, tracks lastPlayed and ignores non-playlist contexts', () => {
    const s = mergeRecent(EMPTY_HISTORY, [t(A, 300), t(A, 200), t(B, 250), t('spotify:album:zzz', 400), t(null, 500)]);
    expect(s.entries[A]).toMatchObject({ plays: 2, lastPlayed: 300, name: '' });
    expect(s.entries[B]).toMatchObject({ plays: 1, lastPlayed: 250 });
    expect(Object.keys(s.entries)).toHaveLength(2);
    expect(s.lastSeen).toBe(500);
  });

  it('never double counts tracks already seen', () => {
    const s1 = mergeRecent(EMPTY_HISTORY, [t(A, 300), t(A, 200)]);
    const s2 = mergeRecent(s1, [t(A, 300), t(A, 200), t(A, 350)]);
    expect(s2.entries[A].plays).toBe(3);
    expect(s2.lastSeen).toBe(350);
  });
});

describe('meta and sorting', () => {
  it('fills names from metadata and sorts by recency or plays', () => {
    let s = mergeRecent(EMPTY_HISTORY, [t(A, 300), t(B, 900), t(A, 100), t(A, 50)]);
    expect(missingMeta(s).sort()).toEqual([A, B].sort());
    s = applyMeta(s, [
      { uri: A, name: 'Alpha', image: 'a.jpg' },
      { uri: B, name: 'Beta', image: null },
    ]);
    expect(missingMeta(s)).toEqual([]);
    expect(sortedPlaylists(s, 'last_played', 10).map((p) => p.name)).toEqual(['Beta', 'Alpha']);
    expect(sortedPlaylists(s, 'play_count', 10).map((p) => p.name)).toEqual(['Alpha', 'Beta']);
    expect(sortedPlaylists(s, 'play_count', 1)).toHaveLength(1);
  });

  it('hides playlists without a name and returns the same store when nothing changes', () => {
    const s = mergeRecent(EMPTY_HISTORY, [t(A, 1)]);
    expect(sortedPlaylists(s, 'last_played', 5)).toEqual([]);
    expect(applyMeta(s, [])).toBe(s);
  });

  it('noteStarted makes a just-started playlist visible immediately', () => {
    const s = noteStarted(EMPTY_HISTORY, { uri: A, name: 'Alpha', image: null }, 123);
    expect(sortedPlaylists(s, 'last_played', 5)[0]).toMatchObject({ uri: A, name: 'Alpha' });
    expect(s.entries[A].plays).toBe(0);
  });

  it('prunes the least recently played entries', () => {
    let s = EMPTY_HISTORY;
    for (let i = 0; i < 10; i++) s = noteStarted(s, { uri: `spotify:playlist:${'P'.repeat(21)}${i}`, name: `p${i}`, image: null }, i);
    expect(Object.keys(prune(s, 3).entries)).toHaveLength(3);
    expect(prune(s, 3).entries[`spotify:playlist:${'P'.repeat(21)}9`]).toBeDefined();
  });
});

describe('SpotifyPlus response parsing', () => {
  it('parses recent tracks in the lower-case shape and sorts newest first', () => {
    const res = {
      response: {
        result: {
          items: [
            { context: { uri: A }, played_at: '2026-09-02T10:00:00.000Z', played_at_ms: 1000, track: { name: 'One' } },
            { context: null, played_at: '2026-09-02T11:00:00.000Z', played_at_ms: 2000, track: { name: 'Two' } },
          ],
        },
      },
    };
    const tracks = toRecentTracks(res);
    expect(tracks).toHaveLength(2);
    expect(tracks[0]).toMatchObject({ contextUri: A, playedAt: 1000, trackName: 'One' });
    expect(tracks[1].contextUri).toBeNull();
  });

  it('parses playlist metadata in either casing', () => {
    expect(toPlaylistMeta({ uri: A, name: 'Alpha', image_url: 'a.jpg' })).toEqual({ uri: A, name: 'Alpha', image: 'a.jpg' });
    expect(toPlaylistMeta({ Uri: A, Name: 'Alpha', Images: [{ Url: 'b.jpg' }] })).toEqual({ uri: A, name: 'Alpha', image: 'b.jpg' });
    expect(toPlaylistMeta({ name: 'no uri' })).toBeNull();
  });
});
