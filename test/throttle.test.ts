import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { throttle } from '../src/util/throttle';

describe('throttle', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('fires immediately, then at most once per window with the latest value', () => {
    const fn = vi.fn();
    const t = throttle<number>(fn, 150);
    t(1);
    t(2);
    t(3);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenLastCalledWith(1);
    vi.advanceTimersByTime(150);
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith(3);
    vi.advanceTimersByTime(500);
    t(4);
    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn).toHaveBeenLastCalledWith(4);
  });
});
