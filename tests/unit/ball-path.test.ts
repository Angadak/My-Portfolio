import { describe, expect, it } from 'vitest';
import {
  CONTENT_MAX,
  MIN_GUTTER,
  buildStops,
  gutterWidth,
  positionAt,
  railPositionAt,
  railVisible,
  scrollKeys,
} from '@/lib/ball-path';

const layout = { viewportWidth: 1440 };
const rest = { x: 720, y: 760 };
const headings = [
  { top: 1000, height: 40 },
  { top: 1800, height: 40 },
  { top: 2600, height: 40 },
];
const goal = { x: 720, y: 3300 };

describe('gutterWidth', () => {
  it('is the space beside the max-w-6xl content plus its padding', () => {
    expect(gutterWidth(1440)).toBe((1440 - CONTENT_MAX) / 2 + 32);
    expect(gutterWidth(1000)).toBe(32);
  });
  it('is below the minimum on narrow desktops', () => {
    expect(gutterWidth(1100)).toBeLessThan(MIN_GUTTER);
  });
});

describe('buildStops', () => {
  const stops = buildStops(rest, headings, goal, layout);
  it('starts at rest and ends at the goal', () => {
    expect(stops[0]).toEqual(rest);
    expect(stops[stops.length - 1]).toEqual(goal);
    expect(stops).toHaveLength(headings.length + 2);
  });
  it('alternates gutters and keeps stops outside the text column', () => {
    const contentLeft = (1440 - CONTENT_MAX) / 2 + 32;
    const contentRight = 1440 - contentLeft;
    expect(stops[1].x).toBeLessThan(contentLeft);
    expect(stops[1].x).toBeGreaterThan(0);
    expect(stops[2].x).toBeGreaterThan(contentRight);
    expect(stops[2].x).toBeLessThan(1440);
    expect(stops[3].x).toBe(stops[1].x);
  });
  it('centres each stop on its heading', () => {
    expect(stops[1].y).toBe(1020);
  });
});

describe('scrollKeys', () => {
  it('starts at 0, rises strictly and never passes the max scroll', () => {
    const stops = buildStops(rest, headings, goal, layout);
    const keys = scrollKeys(stops, 900, 2800);
    expect(keys[0]).toBe(0);
    for (let i = 1; i < keys.length; i++) expect(keys[i]).toBeGreaterThan(keys[i - 1]);
    expect(keys[keys.length - 1]).toBeLessThanOrEqual(2800);
  });
  it('never collapses the last segments on a tall viewport', () => {
    const s = [700, 1500, 2500, 3500, 4344, 4714].map((y) => ({ x: 0, y }));
    const keys = scrollKeys(s, 1300, 3700);
    expect(keys[keys.length - 1]).toBe(3700);
    expect(keys[keys.length - 1] - keys[keys.length - 2]).toBeGreaterThanOrEqual(260);
  });
});

describe('positionAt', () => {
  const stops = buildStops(rest, headings, goal, layout);
  const vh = 900;
  const max = 2800;
  it('rests at the first stop at scroll 0', () => {
    const p = positionAt(0, stops, vh, max, 18);
    expect(p.x).toBe(rest.x);
    expect(p.y).toBe(rest.y);
    expect(p.rotation).toBe(0);
    expect(p.arrived).toBe(false);
  });
  it('reaches the goal at the max scroll', () => {
    const p = positionAt(max, stops, vh, max, 18);
    expect(p.x).toBeCloseTo(goal.x);
    expect(p.y).toBeCloseTo(goal.y);
    expect(p.arrived).toBe(true);
  });
  it('arcs above the straight line between stops', () => {
    const keys = scrollKeys(stops, vh, max);
    const mid = (keys[0] + keys[1]) / 2;
    const p = positionAt(mid, stops, vh, max, 18);
    const chordY = (stops[0].y + stops[1].y) / 2;
    expect(p.y).toBeLessThan(chordY);
    expect(p.y).toBeCloseTo(chordY - 120);
    expect(p.segment).toBe(0);
  });
  it('rotation only grows as you scroll down', () => {
    let last = -1;
    for (let s = 0; s <= max; s += 100) {
      const r = positionAt(s, stops, vh, max, 18).rotation;
      expect(r).toBeGreaterThanOrEqual(last);
      last = r;
    }
    let total = 0;
    for (let i = 0; i < stops.length - 1; i++) total += Math.hypot(stops[i + 1].x - stops[i].x, stops[i + 1].y - stops[i].y);
    expect(positionAt(max, stops, vh, max, 18).rotation).toBeCloseTo(((total / 18) * 180) / Math.PI);
  });
});

describe('rail helpers', () => {
  it('maps progress inside the rail and clamps', () => {
    expect(railPositionAt(0, 100, 500)).toBe(100);
    expect(railPositionAt(0.5, 100, 500)).toBe(300);
    expect(railPositionAt(2, 100, 500)).toBe(500);
    expect(railPositionAt(-1, 100, 500)).toBe(100);
  });
  it('shows the rail once half the first screen has scrolled', () => {
    expect(railVisible(100, 900)).toBe(false);
    expect(railVisible(500, 900)).toBe(true);
  });
});
