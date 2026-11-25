'use client';

import { useEffect, useState } from 'react';
import { openTerminal } from '@/lib/events';
import { CloseIcon } from '@/components/ui/icons';

const HINT_KEY = 'terminal-hint-seen';
const HINT_DELAY_MS = 6000;

function seenHint(): boolean {
  try {
    return window.localStorage.getItem(HINT_KEY) === '1';
  } catch {
    return true;
  }
}
function markHintSeen() {
  try {
    window.localStorage.setItem(HINT_KEY, '1');
  } catch {
    // storage blocked: the hint may show again next visit, that is fine
  }
}

/**
 * Makes the hidden terminal discoverable: a tab on the left edge (desktop), a small button after
 * scrolling (phones), and a one-time hint bubble for first-time visitors.
 */
export function TerminalLauncher() {
  const [hint, setHint] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // skip for first-time tips in automated browsers (tests, audits) and for returning visitors
    if (seenHint() || navigator.webdriver) return;
    const id = window.setTimeout(() => setHint(true), HINT_DELAY_MS);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      setScrolled(window.scrollY > window.innerHeight * 0.5);
    }
    function onScroll() {
      if (!frame) frame = window.requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function launch() {
    dismiss();
    openTerminal();
  }
  function dismiss() {
    setHint(false);
    markHintSeen();
  }

  return (
    <>
      {/* desktop: tab on the left edge */}
      <button
        type="button"
        onClick={launch}
        aria-label="Open terminal (backtick key)"
        className="group fixed left-0 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-2 border-2 border-l-0 border-ink bg-[#05060b] px-2 py-4 font-mono text-xs font-bold tracking-[0.2em] text-[#eef1ff] shadow-[3px_3px_0_0_var(--accent)] transition-[padding,box-shadow] duration-200 [writing-mode:vertical-rl] hover:pl-3.5 hover:shadow-[5px_5px_0_0_var(--accent)] md:flex"
      >
        <span aria-hidden className="text-[#3d7bff]">&gt;_</span>
        TERMINAL
        <span aria-hidden className="mt-1 grid size-5 place-items-center border border-[#eef1ff]/40 text-[0.65rem] [writing-mode:horizontal-tb]">
          `
        </span>
        <span aria-hidden className="terminal-caret h-2 w-3 bg-[#3d7bff] [writing-mode:horizontal-tb]" />
      </button>

      {/* phones: small button once the hero has scrolled away */}
      <button
        type="button"
        onClick={launch}
        aria-label="Open terminal"
        tabIndex={scrolled ? 0 : -1}
        data-visible={scrolled ? '' : undefined}
        className="fixed bottom-4 left-4 z-40 flex h-11 items-center gap-1.5 border-2 border-ink bg-[#05060b] px-3 font-mono text-sm font-bold text-[#eef1ff] shadow-[3px_3px_0_0_var(--accent)] transition-[opacity,transform] duration-300 active:scale-95 data-[visible]:translate-y-0 data-[visible]:opacity-100 not-data-[visible]:pointer-events-none not-data-[visible]:translate-y-4 not-data-[visible]:opacity-0 md:hidden"
      >
        <span aria-hidden className="text-[#3d7bff]">&gt;_</span>
        <span aria-hidden className="terminal-caret h-3.5 w-2 bg-[#3d7bff]" />
      </button>

      {hint && (
        <div
          role="dialog"
          aria-label="Terminal tip"
          className="hint-pop fixed bottom-20 left-4 z-40 w-[min(18rem,calc(100vw-2rem))] border-2 border-ink bg-surface p-4 shadow-[4px_4px_0_0_var(--accent)] md:bottom-auto md:left-14 md:top-1/2 md:-translate-y-1/2"
        >
          <button type="button" onClick={dismiss} aria-label="Dismiss tip" className="absolute right-2 top-2 grid size-7 place-items-center text-muted transition hover:text-accent">
            <CloseIcon className="size-4" />
          </button>
          <p className="label font-bold text-accent">Pro tip</p>
          <p className="mt-1 pr-4 text-sm">
            This site has a terminal. Press <kbd className="border border-ink/40 px-1 font-mono text-xs">`</kbd> or tap the button, then type{' '}
            <code className="font-mono text-accent">help</code>.
          </p>
          <button type="button" onClick={launch} className="mt-3 border-2 border-ink bg-accent px-3 py-1.5 text-xs font-bold uppercase tracking-[0.1em] text-on-accent shadow-[2px_2px_0_0_var(--ink)] transition active:scale-95">
            Try it
          </button>
        </div>
      )}
    </>
  );
}
