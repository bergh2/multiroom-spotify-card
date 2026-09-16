import { describe, expect, it } from 'vitest';
import { oembedMeta, toPlaybackContext } from '../src/spotcast/services';
import { EMPTY_HISTORY, markOwned, noteObserved, ownedButGone } from '../src/spotifyplus/history';
import { normalizeSpConfig } from '../src/spotifyplus/config';

const A = 'spotify:playlist:AAAAAAAAAAAAAAAAAAAAAA';
const B = 'spotify:playlist:BBBBBBBBBBBBBBBBBBBBBB';

describe('toPlaybackContext', () => {
  it('reads the context uri, device and track from spotcast/player', () => {
    const ctx = toPlaybackContext({
      account: 'a',
      state: { is_playing: true, context: { uri: A, type: 'playlist' }, device: { name: 'All' }, item: { name: 'Song' } },
    });
    expect(ctx).toEqual({ contextUri: A, isPlaying: true, deviceName: 'All', trackName: 'Song' });
  });

  it('tolerates an empty or malformed state', () => {
    expect(toPlaybackContext({ state: {} })).toEqual({ contextUri: null, isPlaying: false, deviceName: '', trackName: '' });
    expect(toPlaybackContext(null).isPlaying).toBe(false);
  });
});

describe('oembedMeta', () => {
  it('maps title and thumbnail, and fails soft', async () => {
    const ok = (async () => ({ ok: true, json: async () => ({ title: 'Chill', thumbnail_url: 'https://i/x.jpg' }) })) as unknown as typeof fetch;
    expect(await oembedMeta(A, ok)).toEqual({ uri: A, name: 'Chill', image: 'https://i/x.jpg' });
    const notFound = (async () => ({ ok: false })) as unknown as typeof fetch;
    expect(await oembedMeta(A, notFound)).toBeNull();
    const boom = (async () => { throw new Error('offline'); }) as unknown as typeof fetch;
    expect(await oembedMeta(A, boom)).toBeNull();
  });
});

describe('noteObserved', () => {
  const GAP = 20 * 60_000;

  it('counts a new play and extends a running session without counting again', () => {
    let s = noteObserved(EMPTY_HISTORY, A, 1_000_000, GAP);
    expect(s.entries[A]).toMatchObject({ plays: 1, lastPlayed: 1_000_000, name: '' });
    s = noteObserved(s, A, 1_000_000 + 5 * 60_000, GAP); // 5 min later: same session
    expect(s.entries[A]).toMatchObject({ plays: 1, lastPlayed: 1_000_000 + 5 * 60_000 });
    s = noteObserved(s, A, 1_000_000 + 60 * 60_000, GAP); // an hour later: a new play
    expect(s.entries[A].plays).toBe(2);
  });

  it('ignores non-playlist contexts and stale observations', () => {
    const s = noteObserved(EMPTY_HISTORY, 'spotify:album:x', 10, GAP);
    expect(s).toBe(EMPTY_HISTORY);
    const s1 = noteObserved(EMPTY_HISTORY, A, 1000, GAP);
    expect(noteObserved(s1, A, 900, GAP)).toBe(s1);
  });
});

describe('ownership and deletion (Spotcast backend)', () => {
  it('marks entries owned by the account and reports the ones that left the library', () => {
    let s = noteObserved(noteObserved(EMPTY_HISTORY, A, 1, 0), B, 2, 0);
    s = markOwned(s, [{ uri: A, name: 'Mine', image: null, ownerId: 'me' }, { uri: B, name: 'Theirs', image: null, ownerId: 'someone' }], 'me');
    expect(s.entries[A].owned).toBe(true);
    expect(s.entries[B].owned).toBeUndefined();
    expect(ownedButGone(s, new Set([A, B]))).toEqual([]);
    expect(ownedButGone(s, new Set([B]))).toEqual([A]); // A deleted in Spotify
    expect(ownedButGone(s, new Set([A]))).toEqual([]); // B merely unfollowed: keep
  });
});

describe('config: backend', () => {
  const base = { type: 'custom:multiroom-spotify-card', cast_group_entity: 'media_player.all', speakers: ['media_player.a'] };

  it('defaults to SpotifyPlus and then requires device_name', () => {
    expect(() => normalizeSpConfig({ ...base } as never)).toThrow(/device_name/);
    const c = normalizeSpConfig({ ...base, device_name: 'All' } as never);
    expect(c.backend).toBe('spotifyplus');
    expect(c.spotifyplus_entity).toBe('media_player.spotifyplus');
  });

  it('accepts Spotcast without device_name or SpotifyPlus entity', () => {
    const c = normalizeSpConfig({ ...base, backend: 'spotcast' } as never);
    expect(c.backend).toBe('spotcast');
    expect(c.device_name).toBe('');
    expect(c.control_via).toBe('cast');
  });

  it('rejects unknown backends and SpotifyPlus transport with Spotcast', () => {
    expect(() => normalizeSpConfig({ ...base, backend: 'nope' } as never)).toThrow(/backend/);
    expect(() => normalizeSpConfig({ ...base, backend: 'spotcast', control_via: 'spotifyplus' } as never)).toThrow(/control_via/);
  });
});

describe('quotaRetryAt', () => {
  it('parses the retry window from Spotcast and Home Assistant error texts', async () => {
    const { quotaRetryAt } = await import('../src/multiroom-spotify-card');
    expect(quotaRetryAt('Validation error: Too many requests (retry-after: 59088 seconds)', 1000)).toBe(1000 + 59088 * 1000);
    expect(quotaRetryAt('Spotify is rate limiting this client id. Try again in 59323 s (after 12:00:51)', 0)).toBe(59323 * 1000);
    expect(quotaRetryAt('Could not activate Spotify Cast application', 0)).toBeNull();
  });
});
