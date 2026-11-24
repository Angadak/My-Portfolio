'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AUTO_ADVANCE_MS, cycle, type HeroWord } from '@/lib/hero';
import { useMediaQuery } from '@/hooks/use-media-query';
import { openTerminal } from '@/lib/events';
import { PropIcon } from '@/components/props/props';
import { ButtonLink } from '@/components/ui/button';
import { Socials } from '@/components/ui/socials';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Magnetic } from '@/components/motion/magnetic';

export type HeroStageProps = {
  words: HeroWord[];
  name: string;
  headline: string;
  availability: string;
  location: string;
  github: string;
  linkedin: string;
  email: string;
};

export function HeroStage({ words, name, headline, availability, location, github, linkedin, email }: HeroStageProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(pointer: fine)');
  const showCursor = finePointer && !reduced;
  const current = words[index];
  const number = String(index + 1).padStart(2, '0');

  const step = useCallback((direction: 1 | -1) => setIndex((i) => cycle(i, words.length, direction)), [words.length]);

  useEffect(() => {
    if (reduced || paused) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'hidden') step(1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, step, index]);

  function onMouseMove(event: React.MouseEvent<HTMLElement>) {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (!reduced) {
      el.style.setProperty('--px', ((event.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty('--py', ((event.clientY - r.top) / r.height - 0.5).toFixed(3));
    }
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${event.clientX - r.left}px, ${event.clientY - r.top}px)`;
    }
  }

  function onClick(event: React.MouseEvent<HTMLElement>) {
    if ((event.target as HTMLElement).closest('a, button')) return;
    step(1);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      step(1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      step(-1);
    }
  }

  function setCursorBig(big: boolean) {
    if (!cursorRef.current) return;
    if (big) cursorRef.current.dataset.big = '';
    else delete cursorRef.current.dataset.big;
  }

  return (
    <section
      ref={stageRef}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Skills showcase. Use the left and right arrow keys to change the word."
      onMouseMove={onMouseMove}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={{ '--px': '0', '--py': '0' } as React.CSSProperties}
      className={`relative isolate h-[calc(100dvh-4rem)] min-h-[600px] select-none overflow-hidden focus-visible:outline-offset-[-4px] ${showCursor ? 'cursor-none' : ''}`}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
        <span
          data-decorative
          className="word-emboss text-[clamp(3.5rem,15vw,12rem)] font-black leading-none tracking-[-0.03em]"
          style={{ transform: 'translate(calc(var(--px) * 12px), calc(var(--py) * 10px))' }}
        >
          {current.word}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div
          className="pointer-events-auto w-[clamp(120px,18vw,210px)]"
          style={{ transform: 'translate(calc(var(--px) * -24px), calc(var(--py) * -18px))' }}
          onMouseEnter={() => setCursorBig(true)}
          onMouseLeave={() => setCursorBig(false)}
        >
          <div key={index} className="hero-pop">
            {current.prop === 'api' ? (
              <button type="button" onClick={openTerminal} aria-label="Open terminal" className={`block w-full ${showCursor ? 'cursor-none' : ''}`}>
                <PropIcon name="api" />
              </button>
            ) : (
              <PropIcon name={current.prop} />
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-4 right-4 z-10 max-w-xl sm:left-8">
        <p className="label text-accent">
          {number} / {current.caption}
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
          {name} <span className="text-muted">— {headline}</span>
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <span aria-hidden className="inline-block size-2 rounded-full bg-success" />
          {availability} · {location}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Magnetic>
            <ButtonLink href="/work">View case studies</ButtonLink>
          </Magnetic>
          <ButtonLink href="/cv.pdf" variant="secondary" download>
            Download CV
          </ButtonLink>
        </div>
      </div>

      <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
        <Socials vertical github={github} linkedin={linkedin} email={email} />
      </div>

      <div className="absolute bottom-8 right-4 z-10 flex items-center gap-4 sm:right-8">
        <p aria-hidden className="label hidden text-muted md:block">
          Click or ← → to change
        </p>
        <ThemeToggle />
      </div>

      <p className="sr-only" aria-live="polite">
        {`${current.word}: ${current.caption}`}
      </p>

      {showCursor && (
        <div
          ref={cursorRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 z-20 -ml-3 -mt-3 size-6 rounded-full border-[1.5px] border-fg transition-[width,height,margin] duration-150 data-[big]:-ml-7 data-[big]:-mt-7 data-[big]:size-14"
          style={{ transform: 'translate(-100px, -100px)' }}
        />
      )}
    </section>
  );
}
