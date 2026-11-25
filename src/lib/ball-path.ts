/** Pure maths for the scroll-driven football. All coordinates are page pixels unless named "view". */

export type Point = { x: number; y: number };
export type HeadingRect = { top: number; height: number };
export type BallPosition = { x: number; y: number; rotation: number; segment: number; arrived: boolean };

/** Tailwind max-w-6xl in px. Sections use it with px-8 (32px) padding on sm+. */
export const CONTENT_MAX = 1152;
const CONTENT_PADDING = 32;
/**
 * Minimum gutter for the 36px ball plus breathing room. BallJourney also needs room for the rail
 * lane plus the ball, so pitch mode actually starts at a 96px gutter (about a 1280px-wide viewport).
 */
export const MIN_GUTTER = 56;
/** A stop is reached when it sits at 40% of the viewport height. */
const TRIGGER = 0.4;
const ARC_MAX = 120;
const ARC_RATIO = 0.3;

export function gutterWidth(viewportWidth: number): number {
  return Math.max(0, (viewportWidth - CONTENT_MAX) / 2) + CONTENT_PADDING;
}

/** Rest point, one stop per heading (alternating left/right gutter), then the goal. */
export function buildStops(rest: Point, headings: HeadingRect[], goal: Point, layout: { viewportWidth: number }): Point[] {
  const gutter = gutterWidth(layout.viewportWidth);
  const leftX = gutter / 2;
  const rightX = layout.viewportWidth - gutter / 2;
  const mids = headings.map((h, i) => ({ x: i % 2 === 0 ? leftX : rightX, y: h.top + h.height / 2 }));
  return [rest, ...mids, goal];
}

/** Scroll position at which each stop is reached: strictly rising, first is 0, last clamped to maxScroll. */
export function scrollKeys(stops: Point[], viewportHeight: number, maxScroll: number): number[] {
  const keys: number[] = [0];
  for (let i = 1; i < stops.length; i++) {
    const wanted = stops[i].y - viewportHeight * TRIGGER;
    keys.push(Math.max(keys[i - 1] + 1, wanted));
  }
  const last = keys.length - 1;
  if (last > 0 && keys[last] > maxScroll) {
    // spread the keys that do not fit evenly up to the bottom, so no segment collapses to a pixel
    const top = Math.max(maxScroll, last);
    const minSpan = viewportHeight * 0.2;
    let first = last;
    while (first > 1 && keys[first - 1] > top - minSpan * (last - first + 1)) first -= 1;
    const base = keys[first - 1];
    const step = (top - base) / (last - first + 1);
    for (let i = first; i <= last; i++) keys[i] = base + step * (i - first + 1);
  }
  return keys;
}

function smoothstep(t: number): number {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function distance(a: Point, b: Point): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function positionAt(scrollY: number, stops: Point[], viewportHeight: number, maxScroll: number, radius: number): BallPosition {
  if (stops.length === 0) return { x: 0, y: 0, rotation: 0, segment: 0, arrived: false };
  if (stops.length === 1) return { ...stops[0], rotation: 0, segment: 0, arrived: true };
  const keys = scrollKeys(stops, viewportHeight, maxScroll);
  const lastKey = keys[keys.length - 1];
  const y = Math.min(Math.max(scrollY, 0), lastKey);
  let segment = 0;
  while (segment < keys.length - 2 && y >= keys[segment + 1]) segment += 1;
  const a = stops[segment];
  const b = stops[segment + 1];
  const t = smoothstep((y - keys[segment]) / (keys[segment + 1] - keys[segment]));
  const chord = distance(a, b);
  const lift = Math.sin(Math.PI * t) * Math.min(ARC_MAX, chord * ARC_RATIO);
  let travelled = t * chord;
  for (let i = 0; i < segment; i++) travelled += distance(stops[i], stops[i + 1]);
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t - lift,
    rotation: ((travelled / radius) * 180) / Math.PI,
    segment,
    arrived: scrollY >= lastKey - 1,
  };
}

export function railPositionAt(progress: number, railTop: number, railBottom: number): number {
  const p = Math.min(1, Math.max(0, progress));
  return railTop + p * (railBottom - railTop);
}

/** The rail (and rail-mode ball) appear once half of the first screen has scrolled away. */
export function railVisible(scrollY: number, viewportHeight: number): boolean {
  return scrollY > viewportHeight * 0.5;
}
