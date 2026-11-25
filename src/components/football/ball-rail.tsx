'use client';

import { useEffect, useRef, useState } from 'react';
import type { RailSection } from '@/lib/sections';
import { railVisible } from '@/lib/ball-path';
import { useMediaQuery } from '@/hooks/use-media-query';

function sectionOf(id: string): HTMLElement | null {
  const heading = document.getElementById(id);
  return (heading?.closest('section') as HTMLElement | null) ?? heading;
}

/** Section nav down the right edge. Anchors work without JS; with JS they scroll smoothly and move focus. */
export function BallRail({ sections }: { sections: RailSection[] }) {
  const [current, setCurrent] = useState<string | null>(null);
  // null = not decided yet (server HTML and first client render): leave the rail usable without JS.
  const [visible, setVisible] = useState<boolean | null>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const frame = useRef(0);

  useEffect(() => {
    const targets = sections.map((s) => sectionOf(s.id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.getAttribute('aria-labelledby') ?? entry.target.id;
          if (!id) continue;
          if (entry.isIntersecting) setCurrent(id);
          else setCurrent((c) => (c === id ? null : c));
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    function update() {
      frame.current = 0;
      setVisible(railVisible(window.scrollY, window.innerHeight));
    }
    function onScroll() {
      if (!frame.current) frame.current = window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame.current) window.cancelAnimationFrame(frame.current);
    };
  }, []);

  function go(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const section = sectionOf(id);
    if (!section) return;
    event.preventDefault();
    section.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
    document.getElementById(id)?.focus({ preventScroll: true });
  }

  const dots = sections.filter((s) => s.key !== 'contact');
  const goal = sections.find((s) => s.key === 'contact');

  return (
    <nav
      aria-label="Sections"
      data-ball-rail
      data-visible={visible ? '' : undefined}
      inert={visible === false}
      className="ball-rail fixed right-1 top-[max(15vh,5.5rem)] bottom-[15vh] z-40 hidden w-6 min-[360px]:block sm:right-3 lg:right-7"
    >
      <span aria-hidden className="absolute bottom-6 left-1/2 top-0 -translate-x-1/2 border-l-2 border-dashed border-ink/40" />
      <ol className="relative flex h-full flex-col justify-between">
        {dots.map((s) => {
          const active = current === s.id;
          return (
            <li key={s.id}>
              <a
                href={'#' + s.id}
                aria-label={'Go to ' + s.label}
                aria-current={active ? 'true' : undefined}
                onClick={(event) => go(event, s.id)}
                className="group relative grid size-6 place-items-center"
              >
                <span aria-hidden className={'size-2.5 rotate-45 border-2 border-ink transition ' + (active ? 'scale-150 bg-accent' : 'bg-surface')} />
                <span
                  aria-hidden
                  className="label pointer-events-none absolute right-8 hidden -skew-x-6 whitespace-nowrap bg-ink px-2 py-0.5 font-bold text-bg lg:group-hover:block lg:group-focus-visible:block"
                >
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
        {goal && (
          <li>
            <a
              href={'#' + goal.id}
              aria-label={'Go to ' + goal.label}
              aria-current={current === goal.id ? 'true' : undefined}
              onClick={(event) => go(event, goal.id)}
              className="group relative grid size-6 place-items-center text-muted hover:text-accent aria-[current=true]:text-accent"
            >
              <svg aria-hidden viewBox="0 0 24 16" className="w-6" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 15V2h20v13" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        )}
      </ol>
    </nav>
  );
}
