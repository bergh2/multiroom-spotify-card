/**
 * Touch gestures on the sliders (speaker volume, master, seek).
 *
 * A finger that lands on a slider is usually the start of a page scroll: the card is
 * tall on a phone and the last speaker row sits where the thumb rests. So on touch a
 * slider only takes over once the finger has moved sideways more than it moved up or
 * down, and it then moves the value relative to where it was (like iOS Control
 * Center) instead of jumping to the finger. A plain tap changes nothing. Mouse and pen
 * keep the desktop behaviour: click or drag sets the value at the pointer.
 */

/** Pixels a finger may travel before the gesture is classified. */
export const TOUCH_SLOP_PX = 10;

export type GestureKind = 'pending' | 'drag' | 'scroll';

export function classifyGesture(dx: number, dy: number, slop = TOUCH_SLOP_PX): GestureKind {
  const ax = Math.abs(dx);
  const ay = Math.abs(dy);
  if (ax < slop && ay < slop) return 'pending';
  return ax > ay ? 'drag' : 'scroll';
}

/** New value (0..1) after moving a finger `dx` pixels across a track `width` pixels wide. */
export function relativeValue(start: number, dx: number, width: number): number {
  const v = start + dx / Math.max(1, width);
  return Math.min(1, Math.max(0, v));
}
