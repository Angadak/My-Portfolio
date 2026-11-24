'use client';

import { useRef } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export function TiltCard({ children, max = 4, className = '' }: { children: React.ReactNode; max?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(pointer: fine)');

  function onMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || reduced || !finePointer) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const x = (event.clientX - r.left) / r.width - 0.5;
    const y = (event.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(800px) rotateX(${(-y * max * 2).toFixed(2)}deg) rotateY(${(x * max * 2).toFixed(2)}deg) translateY(-3px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} className={`transition-transform duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
}
