'use client';

import { useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';
import {
  MIN_GUTTER,
  buildStops,
  gutterWidth,
  positionAt,
  railPositionAt,
  railVisible,
  type Point,
} from '@/lib/ball-path';
import { FootballIcon } from './football-icon';

export const PITCH_QUERY = '(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
const PITCH_SIZE = 60;
/** Resting in the hero the ball is drawn this much bigger, then shrinks to normal as it is kicked off. */
const REST_SCALE = 1.5;
const RAIL_SIZE = 22;
/** Trail fades by this factor each frame once the ball stops. */
const TRAIL_DECAY = 0.86;
/** px per frame that shows the full speed trail. */
const TRAIL_FULL = 22;
/** Lane the rail occupies on lg (right-7 + w-6 = 52px) plus 4px clearance. */
const RAIL_LANE = 56;

type Mode = 'pitch' | 'rail';

function modeFor(pitchQuery: boolean): Mode {
  return pitchQuery && gutterWidth(document.documentElement.clientWidth) >= Math.max(MIN_GUTTER, RAIL_LANE + PITCH_SIZE + 4) ? 'pitch' : 'rail';
}

/** One fixed ball moved with transform only. Positions are measured on resize/font load, never inside the frame. */
export function BallJourney() {
  const pitchQuery = useMediaQuery(PITCH_QUERY);
  const reduced = useMediaQuery(REDUCED_QUERY);
  const ballRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ball = ballRef.current;
    if (!ball) return;
    const spin = ball.querySelector<SVGGElement>('[data-ball-spin]');
    const trail = trailRef.current;
    let last: { x: number; y: number } | null = null;
    let trailLevel = 0;
    let mode: Mode = modeFor(pitchQuery);
    let stops: Point[] = [];
    let maxScroll = 0;
    let viewportHeight = window.innerHeight;
    let rail = { x: 0, top: 0, bottom: 0 };
    let frame = 0;
    let hasRail = false;
    let scored = false;
    let alive = true;
    const goalEl = document.querySelector<HTMLElement>('[data-ball-goal]');

    function setGoal(scored: boolean) {
      if (!goalEl) return;
      if (scored) goalEl.dataset.goal = 'scored';
      else delete goalEl.dataset.goal;
    }

    function measure() {
      const sy = window.scrollY;
      const width = document.documentElement.clientWidth;
      viewportHeight = window.innerHeight;
      maxScroll = Math.max(0, document.documentElement.scrollHeight - viewportHeight);
      mode = modeFor(pitchQuery);
      ball!.dataset.mode = mode;
      const start = document.querySelector<HTMLElement>('[data-ball-start]');
      const startRect = start?.getBoundingClientRect();
      const rest: Point = { x: width / 2, y: startRect ? startRect.bottom + sy - 64 : viewportHeight - 64 };
      const headings = Array.from(document.querySelectorAll<HTMLElement>('main [data-ball-stop]')).map((h) => {
        const r = h.getBoundingClientRect();
        return { top: r.top + sy, height: r.height };
      });
      const g = goalEl?.getBoundingClientRect();
      const goal: Point = g ? { x: g.left + g.width / 2, y: g.top + sy + g.height * 0.6 } : { x: width / 2, y: maxScroll + viewportHeight - 80 };
      const maxX = width - RAIL_LANE - PITCH_SIZE / 2;
      stops = buildStops(rest, headings, goal, { viewportWidth: width }).map((s) => (s.x > maxX ? { ...s, x: maxX } : s));
      const railEl = document.querySelector<HTMLElement>('[data-ball-rail]');
      const rr = railEl?.getBoundingClientRect();
      hasRail = !!rr && rr.height > 0;
      rail = rr && hasRail ? { x: rr.left + rr.width / 2, top: rr.top + 4, bottom: rr.bottom - 14 } : { x: width - 24, top: viewportHeight * 0.15, bottom: viewportHeight * 0.85 };
    }

    function paint() {
      frame = 0;
      const sy = window.scrollY;
      if (mode === 'pitch') {
        const p = positionAt(sy, stops, viewportHeight, maxScroll, PITCH_SIZE / 2);
        ball!.style.opacity = '1';
        const kickoff = Math.min(1, sy / (viewportHeight * 0.35));
        const scale = 1 + (REST_SCALE - 1) * (1 - kickoff);
        ball!.style.transform = `translate3d(${p.x - PITCH_SIZE / 2}px, ${p.y - sy - PITCH_SIZE / 2}px, 0) scale(${scale.toFixed(3)})`;
        if (spin) spin.style.transform = `rotate(${p.rotation}deg)`;
        // anime speed lines behind the ball, pointing away from where it is heading (page coordinates)
        const dx = last ? p.x - last.x : 0;
        const dy = last ? p.y - last.y : 0;
        last = { x: p.x, y: p.y };
        const speed = Math.hypot(dx, dy);
        trailLevel = Math.max(Math.min(1, speed / TRAIL_FULL), trailLevel * TRAIL_DECAY);
        if (trail) {
          if (speed > 0.5) trail.style.transform = `rotate(${(Math.atan2(dy, dx) * 180) / Math.PI}deg)`;
          trail.style.opacity = trailLevel > 0.03 ? trailLevel.toFixed(3) : '0';
        }
        if (trailLevel > 0.03) schedule();
        if (p.arrived) scored = true;
        else if (p.segment < stops.length - 2) scored = false;
        setGoal(scored);
      } else {
        const progress = maxScroll > 0 ? sy / maxScroll : 0;
        const y = railPositionAt(progress, rail.top, rail.bottom);
        const rotation = reduced ? 0 : progress * 720;
        ball!.style.opacity = hasRail && railVisible(sy, viewportHeight) ? '1' : '0';
        ball!.style.transform = `translate3d(${rail.x - RAIL_SIZE / 2}px, ${y - RAIL_SIZE / 2}px, 0)`;
        if (spin) spin.style.transform = `rotate(${rotation}deg)`;
        if (trail) trail.style.opacity = '0';
        last = null;
        trailLevel = 0;
        if (!reduced && progress >= 0.99) scored = true;
        else if (reduced || progress < 0.95) scored = false;
        setGoal(scored);
      }
    }

    function schedule() {
      if (!frame) frame = window.requestAnimationFrame(paint);
    }
    function remeasure() {
      measure();
      last = null; // layout moved: do not draw a trail for the jump
      schedule();
    }

    remeasure();
    const resize = new ResizeObserver(remeasure);
    resize.observe(document.body);
    document.fonts?.ready
      .then(() => {
        if (alive) remeasure();
      })
      .catch(() => {});
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    return () => {
      alive = false;
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', remeasure);
      if (frame) window.cancelAnimationFrame(frame);
      setGoal(false);
    };
  }, [pitchQuery, reduced]);

  return (
    <div ref={ballRef} data-ball aria-hidden="true" data-mode="rail" className="ball">
      <div ref={trailRef} data-ball-trail className="ball-trail">
        <span />
      </div>
      <FootballIcon className="relative size-full" />
    </div>
  );
}
