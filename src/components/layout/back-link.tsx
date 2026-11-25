'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LABELS: Record<string, string> = {
  '/': 'Home',
  '/work': 'Case studies',
  '/projects': 'Projects',
  '/blog': 'Blog',
};

/** "Back" goes one level up the site (case study -> case studies -> home), so it works from a shared link too. */
export function parentOf(pathname: string): { href: string; label: string } | null {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/') return null;
  const parent = clean.slice(0, clean.lastIndexOf('/')) || '/';
  const href = parent in LABELS ? parent : '/';
  return { href, label: LABELS[href] };
}

export function BackLink() {
  const pathname = usePathname();
  const parent = parentOf(pathname ?? '/');
  if (!parent) return null;
  return (
    <nav aria-label="Back" className="mx-auto w-full max-w-6xl px-4 sm:px-8">
      <Link
        href={parent.href}
        className="group inline-flex items-center gap-2 border-2 border-ink/40 bg-surface px-3 py-1.5 text-sm font-bold transition hover:-translate-x-0.5 hover:border-ink hover:text-accent hover:shadow-[3px_3px_0_0_var(--accent)] active:scale-95"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="size-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        Back to {parent.label}
      </Link>
    </nav>
  );
}
