'use client';

import { useEffect, useRef } from 'react';

const MAX_SPEED = 70; // px per frame that counts as a full sprint
const DECAY = 0.9;

/**
 * Manga speed lines behind the page. They light up while you scroll fast and fade when you stop.
 * Only opacity and transform change, and the loop sleeps when the page is still.
 */
export function SpeedField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let last = window.scrollY;
    let level = 0;
    let shift = 0;
    let frame = 0;

    function tick() {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;
      last = y;
      const target = Math.min(1, Math.abs(delta) / MAX_SPEED);
      level = Math.max(target, level * DECAY);
      shift = (shift - delta * 0.6) % 240;
      el!.style.opacity = (level * 0.4).toFixed(3);
      el!.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
      if (level > 0.01) frame = window.requestAnimationFrame(tick);
      else el!.style.opacity = '0';
    }
    function onScroll() {
      if (reduced.matches) return;
      if (!frame) frame = window.requestAnimationFrame(tick);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden">
      <div ref={ref} data-speed-field className="scroll-lines absolute -inset-y-[240px] inset-x-0 opacity-0 will-change-[opacity,transform]" />
    </div>
  );
}
