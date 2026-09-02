import { describe, expect, it } from 'vitest';
import { activePreset, deriveNowPlaying, deriveSpeakers, groupSummary } from '../src/state/derive';
import { normalizeConfig } from '../src/config';
import type { HomeAssistant, Speaker } from '../src/types';

function hassWith(states: Record<string, { state: string; attributes: Record<string, unknown> }>): HomeAssistant {
  const out: HomeAssistant['states'] = {};
  for (const [id, s] of Object.entries(states)) {
    out[id] = { entity_id: id, state: s.state, attributes: s.attributes, last_changed: 't', last_updated: 't' };
  }
  return { states: out, callService: async () => undefined, callWS: async () => undefined as never };
}

const cfg = normalizeConfig({
  type: 'x',
  group_entity: 'media_player.g',
  speakers: [{ entity: 'media_player.a', name: 'Living' }, 'media_player.b', 'media_player.c'],
  presets: [
    { name: 'Focus', levels: { 'media_player.c': 46 } },
    { name: 'Chill', levels: { 'media_player.a': 30, 'media_player.b': 22 } },
  ],
});

describe('deriveSpeakers', () => {
  it('maps volume, mute and availability', () => {
    const hass = hassWith({
      'media_player.a': { state: 'playing', attributes: { volume_level: 0.42, is_volume_muted: false, friendly_name: 'A' } },
      'media_player.b': { state: 'idle', attributes: { volume_level: 0.284, is_volume_muted: true, friendly_name: 'Kök' } },
      'media_player.c': { state: 'unavailable', attributes: {} },
    });
    const sp = deriveSpeakers(hass, cfg);
    expect(sp[0]).toMatchObject({ name: 'Living', vol: 42, on: true, available: true });
    expect(sp[1]).toMatchObject({ name: 'Kök', vol: 28, on: false, available: true });
    expect(sp[2]).toMatchObject({ name: 'c', vol: 0, on: false, available: false, standby: false });
  });

  it('flags Cast entities that are off without volume attributes as standby', () => {
    const hass = hassWith({
      'media_player.a': { state: 'off', attributes: { friendly_name: 'A' } },
      'media_player.b': { state: 'off', attributes: {} },
      'media_player.c': { state: 'off', attributes: {} },
    });
    const sp = deriveSpeakers(hass, cfg);
    expect(sp[0]).toMatchObject({ standby: true, on: false, available: true });
    expect(groupSummary(sp)).toBe('Speakers idle');
    expect(activePreset(sp, cfg.presets, 3)).toBeNull();
  });
});

describe('activePreset', () => {
  const mk = (a: [number, boolean], b: [number, boolean], c: [number, boolean], cAvail = true): Speaker[] => [
    { entity: 'media_player.a', name: 'a', vol: a[0], on: a[1], available: true, standby: false },
    { entity: 'media_player.b', name: 'b', vol: b[0], on: b[1], available: true, standby: false },
    { entity: 'media_player.c', name: 'c', vol: c[0], on: c[1] && cAvail, available: cAvail, standby: false },
  ];
  it('matches within tolerance and requires others muted', () => {
    expect(activePreset(mk([31, true], [20, true], [50, false]), cfg.presets, 3)).toBe('Chill');
    expect(activePreset(mk([31, true], [20, true], [50, true]), cfg.presets, 3)).toBeNull();
    expect(activePreset(mk([35, true], [22, true], [0, false]), cfg.presets, 3)).toBeNull();
    expect(activePreset(mk([0, false], [0, false], [46, true]), cfg.presets, 3)).toBe('Focus');
  });
  it('ignores unavailable speakers', () => {
    expect(activePreset(mk([0, false], [0, false], [0, false], false), cfg.presets, 3)).toBe('Focus');
  });
  it('returns null when nothing matches', () => {
    expect(activePreset(mk([80, true], [80, true], [80, true]), cfg.presets, 3)).toBeNull();
  });
});

describe('groupSummary', () => {
  const sp = (on: boolean[], names = ['Living Room', 'Kitchen', 'Bedroom']): Speaker[] =>
    on.map((o, i) => ({ entity: `e${i}`, name: names[i], vol: 10, on: o, available: true, standby: false }));
  it('formats the three cases', () => {
    expect(groupSummary(sp([false, false, false]))).toBe('No speakers selected');
    expect(groupSummary(sp([false, true, false]))).toBe('Kitchen');
    expect(groupSummary(sp([true, true, true]))).toBe('Living Room + 2 more');
  });
});

describe('deriveNowPlaying', () => {
  it('reads media attributes and flags missing entity', () => {
    const hass = hassWith({
      'media_player.g': {
        state: 'playing',
        attributes: { media_title: 'T', media_artist: 'A', media_duration: 214, media_position: 74, media_position_updated_at: '2026-09-02T10:00:00+00:00', entity_picture: '/api/x.jpg' },
      },
    });
    expect(deriveNowPlaying(hass, 'media_player.g')).toMatchObject({ found: true, playing: true, title: 'T', artist: 'A', duration: 214, position: 74, art: '/api/x.jpg' });
    expect(deriveNowPlaying(hass, 'media_player.nope').found).toBe(false);
  });
});
