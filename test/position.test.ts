import { describe, expect, it } from 'vitest';
import { livePosition } from '../src/state/position';
import { fmtTime } from '../src/util/format';
import type { NowPlaying } from '../src/types';

const np = (over: Partial<NowPlaying>): NowPlaying => ({
  found: true,
  state: 'playing',
  playing: true,
  title: '',
  artist: '',
  art: null,
  duration: 200,
  position: 50,
  positionUpdatedAt: '2026-09-02T10:00:00.000Z',
  ...over,
});

describe('livePosition', () => {
  const t0 = Date.parse('2026-09-02T10:00:00.000Z');
  it('extrapolates while playing', () => {
    expect(livePosition(np({}), t0 + 12_000)).toBe(62);
  });
  it('freezes while paused', () => {
    expect(livePosition(np({ playing: false }), t0 + 12_000)).toBe(50);
  });
  it('clamps to duration and handles missing values', () => {
    expect(livePosition(np({}), t0 + 500_000)).toBe(200);
    expect(livePosition(np({ position: null }), t0)).toBe(0);
    expect(livePosition(np({ positionUpdatedAt: null }), t0 + 5000)).toBe(50);
  });
});

describe('fmtTime', () => {
  it('formats m:ss', () => {
    expect(fmtTime(0)).toBe('0:00');
    expect(fmtTime(74.9)).toBe('1:14');
    expect(fmtTime(3605)).toBe('60:05');
  });
});
