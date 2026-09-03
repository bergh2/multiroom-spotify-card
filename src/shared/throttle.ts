/**
 * Trailing-edge throttle: the first call runs immediately, later calls inside
 * the window are collapsed into one call at the end of the window.
 */
export function throttle<T>(fn: (value: T) => void, waitMs: number): (value: T) => void {
  let last = 0;
  let pending: T | undefined;
  let hasPending = false;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const flush = () => {
    timer = undefined;
    if (hasPending) {
      hasPending = false;
      last = Date.now();
      fn(pending as T);
    }
  };
  return (value: T) => {
    const now = Date.now();
    const elapsed = now - last;
    if (elapsed >= waitMs && !timer) {
      last = now;
      fn(value);
      return;
    }
    pending = value;
    hasPending = true;
    if (!timer) timer = setTimeout(flush, Math.max(0, waitMs - elapsed));
  };
}
