import type { NowPlaying } from '../types';

/** Current playback position in seconds, extrapolated from the last reported position. */
export function livePosition(np: NowPlaying, nowMs: number): number {
  if (np.position === null) return 0;
  let pos = np.position;
  if (np.playing && np.positionUpdatedAt) {
    const at = Date.parse(np.positionUpdatedAt);
    if (Number.isFinite(at)) pos += Math.max(0, (nowMs - at) / 1000);
  }
  if (np.duration !== null) pos = Math.min(pos, np.duration);
  return Math.max(0, pos);
}
