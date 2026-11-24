'use client';

import { openPalette, openTerminal } from '@/lib/events';
import { CommandIcon, TerminalIcon } from '@/components/ui/icons';

const iconButton =
  'grid size-9 place-items-center rounded-full border border-line text-fg transition hover:border-accent hover:text-accent active:scale-90';

export function InteractiveButtons() {
  return (
    <>
      <button type="button" onClick={openTerminal} aria-label="Open terminal (backtick key)" className={iconButton}>
        <TerminalIcon className="size-4" />
      </button>
      <button type="button" onClick={openPalette} aria-label="Open command palette (Ctrl K)" className={iconButton}>
        <CommandIcon className="size-4" />
      </button>
    </>
  );
}
