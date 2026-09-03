import { describe, expect, it } from 'vitest';
import { normalizeConfig } from '../src/ma/config';
import type { CardConfig } from '../src/types';

const base: CardConfig = {
  type: 'custom:spotify-media-card',
  group_entity: 'media_player.alla_2',
  speakers: ['media_player.a', { entity: 'media_player.b', name: 'Kök' }],
};

describe('normalizeConfig', () => {
  it('fills defaults', () => {
    const c = normalizeConfig(base);
    expect(c.playlist_layout).toBe('tiles');
    expect(c.playlist_sort).toBe('last_played');
    expect(c.playlist_count).toBe(6);
    expect(c.tile_columns).toBe(3);
    expect(c.speaker_count).toBe(2);
    expect(c.title).toBe('Listening');
    expect(c.presets).toEqual([]);
    expect(c.speakers).toEqual([{ entity: 'media_player.a' }, { entity: 'media_player.b', name: 'Kök' }]);
  });

  it('defaults playlist_count to 10 for list layout', () => {
    expect(normalizeConfig({ ...base, playlist_layout: 'list' }).playlist_count).toBe(10);
  });

  it('accepts presets referencing configured speakers', () => {
    const c = normalizeConfig({ ...base, presets: [{ name: 'Chill', levels: { 'media_player.a': 30 } }] });
    expect(c.presets[0].levels['media_player.a']).toBe(30);
  });

  it('rejects a missing group entity', () => {
    expect(() => normalizeConfig({ ...base, group_entity: 'light.x' })).toThrow(/group_entity/);
  });

  it('rejects empty or duplicate speakers', () => {
    expect(() => normalizeConfig({ ...base, speakers: [] })).toThrow(/speakers/);
    expect(() => normalizeConfig({ ...base, speakers: ['media_player.a', 'media_player.a'] })).toThrow(/twice/);
  });

  it('rejects preset levels for unknown speakers or out of range', () => {
    expect(() => normalizeConfig({ ...base, presets: [{ name: 'X', levels: { 'media_player.zzz': 10 } }] })).toThrow(/not in speakers/);
    expect(() => normalizeConfig({ ...base, presets: [{ name: 'X', levels: { 'media_player.a': 101 } }] })).toThrow(/0-100/);
    expect(() => normalizeConfig({ ...base, presets: [{ name: 'X', levels: {} }, { name: 'X', levels: {} }] })).toThrow(/twice/);
  });

  it('validates default_preset and master_volume', () => {
    const presets = [{ name: 'Standard', levels: { 'media_player.a': 30 } }];
    expect(normalizeConfig({ ...base, presets, default_preset: 'Standard' }).default_preset).toBe('Standard');
    expect(normalizeConfig(base).default_preset).toBe('');
    expect(() => normalizeConfig({ ...base, presets, default_preset: 'Nope' })).toThrow(/default_preset/);
    expect(normalizeConfig(base).master_volume).toBe(true);
    expect(normalizeConfig({ ...base, master_volume: false }).master_volume).toBe(false);
  });

  it('validates the card layout', () => {
    expect(normalizeConfig(base).layout).toBe('vertical');
    expect(normalizeConfig({ ...base, layout: 'auto' }).layout).toBe('auto');
    expect(() => normalizeConfig({ ...base, layout: 'sideways' as never })).toThrow(/layout/);
  });

  it('rejects bad enums and ranges', () => {
    expect(() => normalizeConfig({ ...base, playlist_layout: 'grid' as never })).toThrow(/playlist_layout/);
    expect(() => normalizeConfig({ ...base, playlist_sort: 'name' as never })).toThrow(/playlist_sort/);
    expect(() => normalizeConfig({ ...base, playlist_count: 0 })).toThrow(/playlist_count/);
    expect(() => normalizeConfig({ ...base, tile_columns: 9 })).toThrow(/tile_columns/);
    expect(normalizeConfig({ ...base, tile_columns: 3 }).tile_columns_wide).toBe(3);
    expect(normalizeConfig({ ...base, tile_columns: 3, tile_columns_wide: 5 }).tile_columns_wide).toBe(5);
  });
});
