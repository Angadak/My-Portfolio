'use client';

import { useRef } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(pointer: fine)');

  function onMouseMove(event: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || reduced || !finePointer) return;
    const r = el.getBoundingClientRect();
    const dx = (event.clientX - (r.left + r.width / 2)) * strength;
    const dy = (event.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]"
    >
      {children}
    </span>
  );
}
