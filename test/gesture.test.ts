import { describe, expect, it } from 'vitest';
import { TOUCH_SLOP_PX, classifyGesture, relativeValue } from '../src/shared/gesture';

describe('classifyGesture', () => {
  it('waits while the finger stays inside the slop', () => {
    expect(classifyGesture(0, 0)).toBe('pending');
    expect(classifyGesture(TOUCH_SLOP_PX - 1, -(TOUCH_SLOP_PX - 1))).toBe('pending');
  });

  it('treats a mostly vertical move as a page scroll', () => {
    expect(classifyGesture(4, 30)).toBe('scroll');
    expect(classifyGesture(-12, -14)).toBe('scroll');
  });

  it('treats a mostly sideways move as a slider drag', () => {
    expect(classifyGesture(14, 3)).toBe('drag');
    expect(classifyGesture(-20, 12)).toBe('drag');
  });
});

describe('relativeValue', () => {
  it('moves from the current value instead of jumping to the finger', () => {
    expect(relativeValue(0.3, 0, 200)).toBeCloseTo(0.3);
    expect(relativeValue(0.3, 20, 200)).toBeCloseTo(0.4);
    expect(relativeValue(0.3, -40, 200)).toBeCloseTo(0.1);
  });

  it('clamps to 0..1 and survives a zero-width track', () => {
    expect(relativeValue(0.9, 100, 200)).toBe(1);
    expect(relativeValue(0.1, -100, 200)).toBe(0);
    expect(relativeValue(0.5, 0, 0)).toBe(0.5);
  });
});
