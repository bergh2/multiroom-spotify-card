import { beforeEach, describe, expect, it, vi } from 'vitest';
import { clearCache, discoverEntryId, getPlaylists, normalizeItems, resolveImage } from '../src/ma/library';
import type { HomeAssistant } from '../src/types';

describe('resolveImage', () => {
  it('handles string, null and object shapes', () => {
    expect(resolveImage('http://ma:8095/imageproxy?x=1')).toBe('http://ma:8095/imageproxy?x=1');
    expect(resolveImage('  ')).toBeNull();
    expect(resolveImage(null)).toBeNull();
    expect(resolveImage({ path: 'https://i.scdn.co/a.jpg' })).toBe('https://i.scdn.co/a.jpg');
    expect(resolveImage({ path: 'local/file.jpg' })).toBeNull();
  });
});

describe('normalizeItems', () => {
  it('keeps only items with uri and name', () => {
    expect(normalizeItems([{ uri: 'spotify://playlist/1', name: 'A', image: null }, { name: 'no uri' }, 'junk'])).toEqual([
      { uri: 'spotify://playlist/1', name: 'A', image: null },
    ]);
    expect(normalizeItems(undefined)).toEqual([]);
  });
});

describe('getPlaylists / discoverEntryId', () => {
  beforeEach(() => clearCache());

  const mk = (items: unknown[]) => {
    const callService = vi.fn(async () => ({ context: {}, response: { items } }));
    const callWS = vi.fn(async () => [
      { entry_id: 'e1', domain: 'music_assistant', state: 'not_loaded' },
      { entry_id: 'e2', domain: 'music_assistant', state: 'loaded' },
    ]);
    return { hass: { states: {}, callService, callWS } as unknown as HomeAssistant, callService, callWS };
  };

  it('calls get_library with the right order_by and caches', async () => {
    const { hass, callService } = mk([{ uri: 'u', name: 'n', image: 'i' }]);
    const a = await getPlaylists(hass, { entryId: 'e2', sort: 'play_count', limit: 6 });
    expect(a).toEqual([{ uri: 'u', name: 'n', image: 'i' }]);
    expect(callService).toHaveBeenCalledWith(
      'music_assistant',
      'get_library',
      { config_entry_id: 'e2', media_type: 'playlist', order_by: 'play_count_desc', limit: 6 },
      undefined,
      false,
      true,
    );
    await getPlaylists(hass, { entryId: 'e2', sort: 'play_count', limit: 6 });
    expect(callService).toHaveBeenCalledTimes(1);
    await getPlaylists(hass, { entryId: 'e2', sort: 'play_count', limit: 6, force: true });
    expect(callService).toHaveBeenCalledTimes(2);
  });

  it('prefers the loaded config entry', async () => {
    const { hass } = mk([]);
    expect(await discoverEntryId(hass)).toBe('e2');
  });
});
