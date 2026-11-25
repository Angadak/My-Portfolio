'use client';

import { toggleDocumentTheme } from '@/lib/theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => toggleDocumentTheme()}
      aria-label="Toggle colour theme"
      title="Toggle ego mode"
      className={`relative size-9 shrink-0 rotate-45 border-2 border-ink bg-accent shadow-[2px_2px_0_0_var(--ink)] transition hover:rotate-[135deg] active:scale-90 ${className}`}
    >
      <span aria-hidden className="absolute inset-1.5 bg-bg [clip-path:polygon(0_0,100%_0,0_100%)]" />
    </button>
  );
}
