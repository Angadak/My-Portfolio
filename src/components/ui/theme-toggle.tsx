'use client';

import { toggleDocumentTheme } from '@/lib/theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => toggleDocumentTheme()}
      aria-label="Toggle colour theme"
      className={`relative size-8 shrink-0 rounded-full bg-accent transition active:scale-90 ${className}`}
    >
      <span aria-hidden className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-fg" />
    </button>
  );
}
