'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AUTO_ADVANCE_MS, cycle, type HeroWord } from '@/lib/hero';
import { useMediaQuery } from '@/hooks/use-media-query';
import { openTerminal } from '@/lib/events';
import { PropIcon, type PropName } from '@/components/props/props';
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
  /** Where the Download CV button points (uploaded in the admin panel). */
  cvHref?: string;
};

/** Manga sound effect stamped next to each prop. Decorative only. */
const SFX: Record<PropName, string> = {
  database: 'THUD!',
  browser: 'SWISH!',
  api: 'PING!',
  cloud: 'WHOOSH!',
  mug: 'SHIP IT!',
};

function isKeyboardFocus(el: EventTarget): boolean {
  try {
    return (el as Element).matches(':focus-visible');
  } catch {
    return true;
  }
}

export function HeroStage({ words, name, headline, availability, location, github, linkedin, email, cvHref = '/cv.pdf' }: HeroStageProps) {
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const hintId = useId();
  const stageRef = useRef<HTMLElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(pointer: fine)');
  const showCursor = finePointer && !reduced;
  const paused = hovered || focused || userPaused;
  const current = words[Math.min(index, words.length - 1)];
  const number = String(Math.min(index, words.length - 1) + 1).padStart(2, '0');
  const total = String(words.length).padStart(2, '0');

  const step = useCallback((direction: 1 | -1) => setIndex((i) => cycle(i, words.length, direction)), [words.length]);

  useEffect(() => {
    if (reduced || paused || words.length === 0) return;
    const id = window.setInterval(() => {
      if (document.visibilityState !== 'hidden') step(1);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [reduced, paused, step, index, words.length]);

  if (!current) return null;

  function onMouseMove(event: React.MouseEvent<HTMLElement>) {
    const el = stageRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (!reduced && finePointer) {
      el.style.setProperty('--px', ((event.clientX - r.left) / r.width - 0.5).toFixed(3));
      el.style.setProperty('--py', ((event.clientY - r.top) / r.height - 0.5).toFixed(3));
    }
    if (cursorRef.current) {
      delete cursorRef.current.dataset.hidden;
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
      data-ball-start
      aria-label="Skills showcase"
      aria-describedby={hintId}
      onMouseMove={onMouseMove}
      onMouseEnter={() => {
        if (finePointer) setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (cursorRef.current) cursorRef.current.dataset.hidden = '';
      }}
      onFocus={(event) => setFocused(isKeyboardFocus(event.target))}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
      style={{ '--px': '0', '--py': '0' } as React.CSSProperties}
      className={`relative isolate h-[calc(100dvh-5rem)] min-h-[600px] select-none overflow-hidden focus-visible:outline-offset-[-4px] ${showCursor ? 'cursor-none' : ''}`}
    >
      {/* ---- Manga splash-page backdrop (decorative) ---- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* focus lines locked on the subject; drift opposite the cursor */}
        <div
          className="absolute -inset-[30%]"
          style={{ transform: 'translate(calc(var(--px) * -40px), calc(var(--py) * -30px))' }}
        >
          <div className="speed-lines size-full opacity-35" />
        </div>
        {/* halftone shading in two corners */}
        <div className="tone-fade absolute left-0 top-0 h-1/2 w-1/2 [mask-image:radial-gradient(circle_at_0_0,black,transparent_70%)]" />
        <div className="tone-accent absolute bottom-0 right-0 h-1/2 w-1/2 [mask-image:radial-gradient(circle_at_100%_100%,black,transparent_70%)]" />
        {/* blue slash across the page, re-cut on every word */}
        <div className="absolute -left-[10%] top-[calc(18dvh+1.5rem)] w-[120%] -rotate-[5deg] sm:top-[56%]">
          <div key={`slash-${index}`} className="slash h-[clamp(1.75rem,5vh,3rem)] w-full bg-accent opacity-60" />
        </div>
        {/* page frame */}
        <div className="absolute inset-3 border-2 border-ink/60 sm:inset-5" />
        {/* edge text, read top to bottom like a manga margin note */}
        <p className="absolute left-8 top-1/2 hidden -translate-y-1/2 font-display text-xs tracking-[0.4em] text-muted [writing-mode:vertical-rl] 2xl:block">
          PLAYER 01 · FULL-STACK · REMOTE
        </p>
      </div>

      {/* episode tag */}
      <div aria-hidden className="absolute left-6 top-6 z-10 flex items-center gap-2 sm:left-9 sm:top-9">
        <span className="bg-ink px-2.5 py-1 font-display text-sm tracking-[0.14em] text-bg">EP.{number}</span>
        <span className="font-mono text-xs font-bold text-muted">/ {total}</span>
      </div>

      {/* giant word: filled blue copy behind an outlined ink word */}
      <div aria-hidden className="pointer-events-none absolute inset-0 grid items-start justify-items-center pt-[18dvh] sm:items-center sm:pt-0">
        <span
          data-decorative
          className="block"
          style={{ transform: 'translate(calc(var(--px) * 24px), calc(var(--py) * 20px))' }}
        >
          <span key={index} className="slam relative block font-display text-[clamp(3.25rem,11.5vw,10.5rem)] leading-none tracking-[-0.02em]">
            <span className="ego-glow absolute left-[0.05em] top-[0.05em] text-accent">{current.word}</span>
            <span className="text-outline relative [-webkit-text-stroke-width:2.5px]">{current.word}</span>
          </span>
        </span>
      </div>

      {/* the prop, with an impact burst and a sound effect */}
      <div className="pointer-events-none absolute inset-0 grid items-start justify-items-center pt-[18dvh] sm:items-center sm:pt-0">
        <div
          className="pointer-events-auto relative w-[clamp(120px,18vw,210px)]"
          style={{ transform: 'translate(calc(var(--px) * -44px), calc(var(--py) * -36px))' }}
          onMouseEnter={() => setCursorBig(true)}
          onMouseLeave={() => setCursorBig(false)}
        >
          <svg aria-hidden viewBox="0 0 200 200" className="pointer-events-none absolute -inset-[28%] -z-10 size-[156%] text-surface">
            <polygon
              key={`burst-${index}`}
              className="hero-pop origin-center stroke-ink [transform-box:fill-box]"
              fill="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
              points="100,8 116,62 168,34 140,84 194,100 140,116 168,166 116,138 100,192 84,138 32,166 60,116 6,100 60,84 32,34 84,62"
            />
          </svg>
          <div key={index} className="hero-pop">
            {current.prop === 'api' ? (
              <button type="button" onClick={openTerminal} aria-label="Open terminal" className={`block w-full ${showCursor ? 'cursor-none' : ''}`}>
                <PropIcon name="api" />
              </button>
            ) : (
              <PropIcon name={current.prop} />
            )}
          </div>
          <span
            key={`sfx-${index}`}
            aria-hidden
            className="impact sfx pointer-events-none absolute -right-[30%] -top-[16%] whitespace-nowrap text-[clamp(1.2rem,2.4vw,2rem)] [-webkit-text-stroke-width:4px]"
          >
            {SFX[current.prop]}
          </span>
        </div>
      </div>

      <div className="absolute bottom-10 left-6 right-4 z-10 max-w-xl pr-28 sm:left-10 sm:pr-0">
        <p className="label inline-block bg-accent px-2 py-1 font-bold text-on-accent">
          {number} / {current.caption}
        </p>
        <h1 className="mt-3 tracking-tight">
          <span className="block font-display text-[clamp(2rem,4.5vw,3.25rem)] leading-none">{name}</span>{' '}
          <span className="mt-2 block text-base font-semibold text-muted sm:text-lg">— {headline}</span>
        </h1>
        <p className="mt-2 flex items-center gap-2 text-sm font-medium text-muted">
          <span aria-hidden className="inline-block size-2.5 rotate-45 bg-success" />
          {availability} · {location}
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Magnetic>
            <ButtonLink href="/work">View case studies</ButtonLink>
          </Magnetic>
          <ButtonLink href={cvHref} variant="secondary" download>
            Download CV
          </ButtonLink>
        </div>
      </div>

      <div className="absolute right-8 top-1/2 z-10 hidden -translate-y-1/2 sm:block">
        <Socials vertical github={github} linkedin={linkedin} email={email} />
      </div>

      <div className="absolute bottom-10 right-6 z-10 flex items-center gap-4 sm:right-10">
        <p aria-hidden className="label hidden font-bold text-muted md:block">
          Click or ← → to change
        </p>
        {!reduced && (
          <button
            type="button"
            aria-label={userPaused ? 'Play word animation' : 'Pause word animation'}
            onClick={() => setUserPaused((p) => !p)}
            className="grid size-10 place-items-center border-2 border-ink bg-surface text-fg shadow-[2px_2px_0_0_var(--shadow)] transition hover:bg-accent hover:text-on-accent active:scale-90"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-4" fill="currentColor">
              {userPaused ? <path d="M8 5v14l11-7z" /> : <path d="M6 5h4v14H6zM14 5h4v14h-4z" />}
            </svg>
          </button>
        )}
        <ThemeToggle />
      </div>

      <p id={hintId} className="sr-only">
        Use the left and right arrow keys to change the word.
      </p>

      <p className="sr-only" aria-live={paused || reduced ? 'polite' : 'off'}>
        {`${current.word}: ${current.caption}`}
      </p>

      {showCursor && (
        <div
          ref={cursorRef}
          aria-hidden
          data-hidden=""
          className="group/cursor pointer-events-none absolute left-0 top-0 z-20 -ml-4 -mt-4 size-8 transition-[width,height,margin,opacity] duration-150 data-[hidden]:opacity-0 data-[big]:-ml-8 data-[big]:-mt-8 data-[big]:size-16"
          style={{ transform: 'translate(-100px, -100px)' }}
        >
          {/* lock-on reticle */}
          <span className="absolute inset-0 rounded-full border-[2.5px] border-accent" />
          <span className="absolute left-1/2 top-0 h-2 w-[2.5px] -translate-x-1/2 -translate-y-1 bg-ink" />
          <span className="absolute bottom-0 left-1/2 h-2 w-[2.5px] -translate-x-1/2 translate-y-1 bg-ink" />
          <span className="absolute left-0 top-1/2 h-[2.5px] w-2 -translate-x-1 -translate-y-1/2 bg-ink" />
          <span className="absolute right-0 top-1/2 h-[2.5px] w-2 translate-x-1 -translate-y-1/2 bg-ink" />
          <span className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent" />
        </div>
      )}
    </section>
  );
}
