'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/site';
import { openPalette, openTerminal } from '@/lib/events';
import { CloseIcon, CommandIcon, MenuIcon, TerminalIcon } from '@/components/ui/icons';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Socials } from '@/components/ui/socials';

type Props = { nav: NavItem[]; github: string; linkedin: string; email: string };

const toolButton =
  'grid size-10 place-items-center border-2 border-ink bg-surface text-fg shadow-[2px_2px_0_0_var(--shadow)] transition hover:text-accent active:scale-90';

function focusablesIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
}

export function SiteMenu({ nav, github, linkedin, email }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [lastPath, setLastPath] = useState(pathname);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close when the route changes (back/forward, terminal or palette navigation).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = useCallback((restoreFocus: boolean) => {
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    if (panel) focusablesIn(panel)[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      // A shortcut is about to open the terminal or palette over us: get out of the way first.
      if (event.key === '`' || ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k')) {
        close(true);
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== 'Tab' || event.defaultPrevented || !panel) return;
      const items = focusablesIn(panel);
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (panel?.contains(target) || buttonRef.current?.contains(target)) return;
      close(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open, close]);

  function runTool(action: () => void) {
    close(true);
    action();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => (open ? close(true) : setOpen(true))}
        className="fixed right-4 top-4 z-50 grid size-12 place-items-center border-2 border-ink bg-accent text-on-accent shadow-[3px_3px_0_0_var(--ink)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--ink)] active:scale-90 sm:right-6 sm:top-6"
      >
        {open ? <CloseIcon className="size-5" /> : <MenuIcon className="size-5" />}
      </button>
      {open && (
        <div
          ref={panelRef}
          id="site-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="menu-panel panel fixed inset-x-3 top-20 z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto p-6 sm:inset-x-auto sm:right-6 sm:top-[5.5rem] sm:w-80"
        >
          <nav aria-label="Main">
            <ul className="space-y-1">
              {nav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => close(false)}
                      className={`block py-1 font-display text-3xl tracking-[-0.01em] transition hover:translate-x-2 hover:text-accent ${active ? 'text-accent' : 'text-fg'}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="mt-6 flex items-center gap-2 border-t-2 border-line pt-5">
            <button type="button" aria-label="Open terminal (backtick key)" onClick={() => runTool(openTerminal)} className={toolButton}>
              <TerminalIcon className="size-4" />
            </button>
            <button type="button" aria-label="Open command palette (Ctrl K)" onClick={() => runTool(openPalette)} className={toolButton}>
              <CommandIcon className="size-4" />
            </button>
            <ThemeToggle className="ml-auto" />
          </div>
          <div className="mt-5">
            <Socials github={github} linkedin={linkedin} email={email} />
          </div>
          <button
            type="button"
            onClick={() => close(true)}
            className="sr-only focus:not-sr-only focus:mt-4 focus:inline-block focus:text-sm focus:underline focus:underline-offset-4"
          >
            Close site menu
          </button>
        </div>
      )}
    </>
  );
}
