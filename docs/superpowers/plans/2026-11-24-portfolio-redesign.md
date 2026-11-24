# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the old template portfolio with a fast, typographic, interactive Next.js + TypeScript site that proves Angad Kumar's full-stack (.NET + TypeScript) experience to global recruiters.

**Architecture:** Static-first Next.js App Router site. Content lives in the repo as MDX (case studies, projects, blog) and typed TS data files (profile, experience, skills, testimonials), validated with zod at build time. Every route is pre-rendered; only the hero stage, theme toggle, mobile menu, terminal, command palette, toaster, nav progress and contact form run on the client. Contact form posts to a server action that sends via Resend.

**Tech Stack:** Next.js (latest stable, ≥ 15, App Router), React 19, TypeScript strict, Tailwind CSS v4, zod 4, gray-matter, `@mdx-js/mdx`, remark-gfm, `@shikijs/rehype`, cmdk, resend, `@vercel/analytics`; Vitest + Testing Library + jsdom; Playwright + `@axe-core/playwright`; Lighthouse CI; GitHub Actions; Vercel.

**Spec:** `docs/superpowers/specs/2026-11-24-portfolio-redesign-design.md`

---

## Conventions for every task

- Work from the repo root (the worktree). Shell is bash.
- Next.js ≥ 15: dynamic route `params` is a **Promise** — always `const { slug } = await params`.
- Tailwind colour utilities come from tokens in `src/app/globals.css`: `bg-bg`, `bg-surface`, `text-fg`, `text-muted`, `border-line`, `text-accent`, `bg-accent`, `text-success`, `bg-success`, `text-danger`.
- Mono uppercase labels use the `label` class (defined in globals.css).
- Never leave `console.log` in committed code (one `console.info` in the dev mail transport is intended).
- Commit after every task with the message given. End every commit message with:
  `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`

## File map

```
src/
  app/
    layout.tsx                 root layout: fonts, theme script, header, footer, interactive layer
    globals.css                tokens, Tailwind theme, prose, hero, shiki, reduced motion
    page.tsx                   home
    not-found.tsx              404
    sitemap.ts  robots.ts  opengraph-image.tsx
    work/page.tsx              case study index
    work/[slug]/page.tsx       case study
    work/[slug]/opengraph-image.tsx
    projects/page.tsx  projects/[slug]/page.tsx
    experience/page.tsx
    blog/page.tsx  blog/[slug]/page.tsx  blog/[slug]/opengraph-image.tsx  blog/rss.xml/route.ts
    contact/page.tsx  contact/actions.ts
  components/
    ui/icons.tsx  ui/button.tsx  ui/chip.tsx  ui/section-heading.tsx  ui/socials.tsx  ui/theme-toggle.tsx
    props/props.tsx            SVG prop illustrations + PropIcon
    motion/reveal.tsx  motion/tilt-card.tsx  motion/magnetic.tsx  motion/nav-progress.tsx  motion/toaster.tsx
    layout/header.tsx  layout/nav-links.tsx  layout/mobile-menu.tsx  layout/interactive-buttons.tsx  layout/footer.tsx
    hero/hero-stage.tsx
    sections/case-study-card.tsx  sections/featured-work.tsx  sections/projects-section.tsx
    sections/experience-snapshot.tsx  sections/testimonials-section.tsx  sections/latest-posts.tsx  sections/contact-cta.tsx
    work/summary-bar.tsx  work/results.tsx
    mdx/mdx-components.tsx  mdx/mdx.tsx
    contact/contact-form.tsx  contact/copy-email-button.tsx
    terminal/terminal.tsx
    palette/command-palette.tsx
    interactive/interactive-layer.tsx
  content/case-studies/*.mdx   content/blog/*.mdx   (content/projects/ created later by demo sub-projects)
  data/profile.ts  data/experience.ts  data/skills.ts  data/testimonials.ts
  hooks/use-media-query.ts
  lib/
    schemas.ts  fill-in.ts  experience.ts  skills.ts  content.ts  theme.ts  events.ts  clipboard.ts
    site.ts  seo.ts  og.tsx  rss.ts  hero.ts  contact.ts  senders.ts
    terminal/commands.ts
public/cv.pdf
tests/
  setup.ts  helpers/media.ts  fixtures/content/**
  unit/*.test.ts(x)
  e2e/*.spec.ts
vitest.config.mts  playwright.config.ts  lighthouserc.json  .github/workflows/ci.yml  .env.example  README.md
```

---

### Task 1: Scaffold a fresh Next.js app (replace the old template)

**Files:**
- Delete: all old tracked app files (`app/`, `components/`, `hooks/`, `lib/`, `public/`, `jsconfig.json`, `components.json`, `tailwind.config.js`, `postcss.config.js`, `next.config.mjs`, `.eslintrc.json`, `package.json`, `package-lock.json`, `README.md`, `.gitignore`)
- Create: fresh scaffold from `create-next-app` (TypeScript, Tailwind v4, ESLint, App Router, `src/` dir, `@/*` alias)

- [ ] **Step 1: Remove the old template**

```bash
git rm -r -q app components hooks lib public jsconfig.json components.json tailwind.config.js postcss.config.js next.config.mjs .eslintrc.json package.json package-lock.json README.md .gitignore
git status --short | head
```
Expected: many `D ` lines. `docs/` and the untracked `.claude/` folder remain.

- [ ] **Step 2: Generate the scaffold in a temporary sub-folder**

```bash
npx create-next-app@latest scaffold-tmp --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```
Expected: `Success! Created scaffold-tmp`.

- [ ] **Step 3: Move the scaffold into the repo root**

```bash
rm -rf scaffold-tmp/node_modules scaffold-tmp/.git
cp -r scaffold-tmp/. .
rm -rf scaffold-tmp
rm -f public/*.svg
npm install
```

- [ ] **Step 4: Check the Next.js major version**

```bash
node -e "console.log(require('./package.json').dependencies.next)"
```
Expected: a version `>=15`. All code in this plan assumes async `params` (Next 15+). If it prints 14.x, stop and report.

- [ ] **Step 5: Install runtime dependencies**

```bash
npm i zod@^4 gray-matter @mdx-js/mdx remark-gfm @shikijs/rehype shiki cmdk resend @vercel/analytics
```

- [ ] **Step 6: Install dev dependencies**

```bash
npm i -D vitest @vitejs/plugin-react vite-tsconfig-paths jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test @axe-core/playwright @lhci/cli
```

- [ ] **Step 7: Extend `.gitignore`**

Append these lines to the generated `.gitignore`:

```gitignore
# tests and audits
/test-results
/playwright-report
/.lighthouseci
# keep the env template
!.env.example
```

- [ ] **Step 8: Set package scripts**

Replace the `"scripts"` block in `package.json` with:

```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lhci": "lhci autorun"
  },
```

- [ ] **Step 9: Verify the scaffold builds**

```bash
npm run build
```
Expected: build succeeds (default starter page).

- [ ] **Step 10: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "chore: replace old template with fresh Next.js + TypeScript scaffold

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Test tooling (Vitest + Playwright)

**Files:**
- Create: `vitest.config.mts`, `tests/setup.ts`, `tests/helpers/media.ts`, `playwright.config.ts`, `tests/unit/tooling.test.ts`

- [ ] **Step 1: Create `vitest.config.mts`**

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/unit/**/*.test.{ts,tsx}'],
  },
});
```

- [ ] **Step 2: Create `tests/helpers/media.ts`** (shared, controllable `matchMedia` + `IntersectionObserver` fakes)

```ts
import { vi } from 'vitest';

const mediaState: Record<string, boolean> = {};

export function setMedia(query: string, matches: boolean): void {
  mediaState[query] = matches;
}

export function resetMedia(): void {
  for (const key of Object.keys(mediaState)) delete mediaState[key];
}

export function installMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: mediaState[query] ?? false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean, target: Element): void {
    this.callback(
      [{ isIntersecting, target } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}
```

- [ ] **Step 3: Create `tests/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';
import { createElement } from 'react';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { installMatchMedia, MockIntersectionObserver, resetMedia } from './helpers/media';

// next/link needs the App Router at click time; tests only need a plain anchor.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    createElement('a', { href, ...rest }, children),
}));

installMatchMedia();
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);
Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  cleanup();
  resetMedia();
  MockIntersectionObserver.instances.length = 0;
  document.documentElement.removeAttribute('data-theme');
  window.localStorage.clear();
});
```

- [ ] **Step 4: Write a tooling smoke test** `tests/unit/tooling.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { setMedia } from '../helpers/media';

describe('test tooling', () => {
  it('fakes matchMedia per query', () => {
    expect(window.matchMedia('(pointer: fine)').matches).toBe(false);
    setMedia('(pointer: fine)', true);
    expect(window.matchMedia('(pointer: fine)').matches).toBe(true);
  });
});
```

- [ ] **Step 5: Run it**

Run: `npx vitest run tests/unit/tooling.test.ts`
Expected: 1 passed.

- [ ] **Step 6: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from '@playwright/test';

const PORT = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] }, testMatch: /smoke\.spec\.ts/ },
  ],
  webServer: {
    // CI builds once in an earlier step; locally build first.
    command: process.env.CI ? `npm run start -- -p ${PORT}` : `npm run build && npm run start -- -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
    env: { CONTACT_TRANSPORT: 'log' },
  },
});
```

- [ ] **Step 7: Install the Playwright browser**

```bash
npx playwright install chromium
```

- [ ] **Step 8: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "test: add Vitest and Playwright tooling

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Design tokens, fonts and theme switching

**Files:**
- Create: `src/lib/theme.ts`, `src/components/ui/theme-toggle.tsx`, `tests/unit/theme.test.ts`
- Replace: `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/theme.test.ts`

```tsx
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { resolveTheme, toggleTheme, toggleDocumentTheme, THEME_KEY } from '@/lib/theme';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { setMedia } from '../helpers/media';

describe('resolveTheme', () => {
  it('uses a stored choice when valid', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });
  it('falls back to the system setting', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(undefined, false)).toBe('light');
    expect(resolveTheme('purple', false)).toBe('light');
  });
});

describe('toggleTheme', () => {
  it('flips between light and dark', () => {
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });
});

describe('toggleDocumentTheme', () => {
  it('switches from system dark to light and stores it', () => {
    setMedia('(prefers-color-scheme: dark)', true);
    expect(toggleDocumentTheme()).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
  });
});

describe('ThemeToggle', () => {
  it('sets data-theme on click', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle colour theme/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/theme.test.ts`
Expected: FAIL, cannot resolve `@/lib/theme`.

- [ ] **Step 3: Create `src/lib/theme.ts`**

```ts
export type Theme = 'light' | 'dark';

export const THEME_KEY = 'theme';

export function resolveTheme(stored: string | null | undefined, systemDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return systemDark ? 'dark' : 'light';
}

export function toggleTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

/** Flips the theme on <html>, persists it, and returns the new theme. Browser only. */
export function toggleDocumentTheme(): Theme {
  const root = document.documentElement;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(THEME_KEY);
  } catch {
    // storage blocked: fall back to the system setting
  }
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const next = toggleTheme(resolveTheme(root.dataset.theme ?? stored, systemDark));
  root.dataset.theme = next;
  try {
    window.localStorage.setItem(THEME_KEY, next);
  } catch {
    // storage blocked: the choice lasts for this page view only
  }
  return next;
}

/** Inline <head> script: marks JS as available and applies a stored theme before first paint. */
export const themeInitScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')d.dataset.theme=t;}catch(e){}})();`;
```

- [ ] **Step 4: Create `src/components/ui/theme-toggle.tsx`**

```tsx
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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run tests/unit/theme.test.ts`
Expected: 6 passed.

- [ ] **Step 6: Replace `src/app/globals.css`**

```css
@import "tailwindcss";

:root {
  --bg: #f3f3f1;
  --surface: #ffffff;
  --text: #111114;
  --muted: #6b6b73;
  --line: #dcdcd8;
  --accent: #6d28d9;
  --success: #15803d;
  --danger: #b91c1c;
  --word: #ffffff;
  --word-edge: #dcdcd8;
  --word-shadow: rgb(0 0 0 / 0.16);
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #0d0d10;
    --surface: #17171c;
    --text: #ededf0;
    --muted: #8a8a93;
    --line: #24242b;
    --accent: #a78bfa;
    --success: #3fb950;
    --danger: #f87171;
    --word: #17171c;
    --word-edge: #24242b;
    --word-shadow: rgb(0 0 0 / 0.6);
    color-scheme: dark;
  }
}

:root[data-theme="dark"] {
  --bg: #0d0d10;
  --surface: #17171c;
  --text: #ededf0;
  --muted: #8a8a93;
  --line: #24242b;
  --accent: #a78bfa;
  --success: #3fb950;
  --danger: #f87171;
  --word: #17171c;
  --word-edge: #24242b;
  --word-shadow: rgb(0 0 0 / 0.6);
  color-scheme: dark;
}

@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--text);
  --color-muted: var(--muted);
  --color-line: var(--line);
  --color-accent: var(--accent);
  --color-success: var(--success);
  --color-danger: var(--danger);
  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
}

html {
  background: var(--bg);
  color: var(--text);
}

body {
  font-family: var(--font-sans);
  background: var(--bg);
  color: var(--text);
  -webkit-font-smoothing: antialiased;
}

::selection {
  background: var(--accent);
  color: #fff;
}

:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Decorative hero word: light fill + stacked edge = embossed look */
.word-emboss {
  color: var(--word);
  text-shadow:
    0 1px 0 var(--word-edge),
    0 2px 0 var(--word-edge),
    0 3px 0 var(--word-edge),
    0 4px 0 var(--word-edge),
    0 14px 28px var(--word-shadow);
}

/* Readable section headings: real text colour + small emboss edge */
.word-heading {
  color: var(--text);
  text-shadow: 0 3px 0 var(--word-edge);
}

@keyframes hero-pop {
  from { opacity: 0; transform: scale(0.85) rotate(-10deg); }
  to { opacity: 1; transform: scale(1) rotate(-5deg); }
}
.hero-pop {
  animation: hero-pop 0.5s cubic-bezier(0.34, 1.45, 0.64, 1) both;
}

@keyframes nav-load {
  from { transform: scaleX(0); }
  to { transform: scaleX(0.9); }
}

/* Scroll reveal: hidden only when JS is running, so no-JS users still see content */
[data-reveal] {
  transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.js [data-reveal]:not([data-shown]) {
  opacity: 0;
  transform: translateY(14px);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  .js [data-reveal]:not([data-shown]) {
    opacity: 1;
    transform: none;
  }
}
```

- [ ] **Step 7: Replace `src/app/layout.tsx`** (temporary; Task 10 and Task 21 extend it)

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { themeInitScript } from '@/lib/theme';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  title: 'Angad Kumar — Full-stack engineer (.NET + TypeScript)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh bg-bg text-fg antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Replace `src/app/page.tsx`** (temporary; Task 13 replaces it)

```tsx
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function HomePage() {
  return (
    <div className="grid min-h-dvh place-items-center gap-6">
      <p className="word-emboss text-8xl font-black">BACKEND</p>
      <ThemeToggle />
    </div>
  );
}
```

- [ ] **Step 9: Verify in the browser**

Run: `npm run dev`, open `http://localhost:3000`. Expected: embossed word on off-white; clicking the violet button switches to the dark palette; reload keeps the choice. Stop the server.

- [ ] **Step 10: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add design tokens, Geist fonts and theme toggle

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Schemas, fill-in guard and experience maths

**Files:**
- Create: `src/lib/schemas.ts`, `src/lib/fill-in.ts`, `src/lib/experience.ts`
- Test: `tests/unit/fill-in.test.ts`, `tests/unit/experience.test.ts`

- [ ] **Step 1: Write the failing tests**

`tests/unit/fill-in.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { findFillIns, guardFillIns, isStrictContent } from '@/lib/fill-in';

describe('findFillIns', () => {
  it('finds markers in nested strings with their paths', () => {
    const value = { title: 'ok', metrics: [{ value: '[fill-in: users]', label: 'users' }], body: 'a [fill-in] b' };
    expect(findFillIns(value)).toEqual(['metrics.0.value', 'body']);
  });
  it('returns nothing for finished content', () => {
    expect(findFillIns({ a: 'done', b: [1, true, null] })).toEqual([]);
  });
});

describe('guardFillIns', () => {
  it('returns the value when not strict', () => {
    const value = { a: '[fill-in]' };
    expect(guardFillIns(value, 'x.mdx', false)).toBe(value);
  });
  it('throws with the location when strict', () => {
    expect(() => guardFillIns({ a: '[fill-in: team]' }, 'x.mdx', true)).toThrow(/Unfinished content in x\.mdx: a/);
  });
});

describe('isStrictContent', () => {
  it('is strict on Vercel production or CONTENT_STRICT=1', () => {
    expect(isStrictContent({ VERCEL_ENV: 'production' })).toBe(true);
    expect(isStrictContent({ CONTENT_STRICT: '1' })).toBe(true);
    expect(isStrictContent({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(isStrictContent({})).toBe(false);
  });
});
```

`tests/unit/experience.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { formatPeriod, formatYears, yearsOfExperience } from '@/lib/experience';

describe('yearsOfExperience', () => {
  it('rounds down to the nearest half year', () => {
    expect(yearsOfExperience('2022-04', new Date(2026, 10, 24))).toBe(4.5);
    expect(yearsOfExperience('2022-04', new Date(2026, 2, 31))).toBe(3.5);
    expect(yearsOfExperience('2022-04', new Date(2026, 3, 1))).toBe(4);
  });
  it('never goes negative', () => {
    expect(yearsOfExperience('2030-01', new Date(2026, 0, 1))).toBe(0);
  });
});

describe('formatYears', () => {
  it('formats whole and half years', () => {
    expect(formatYears(4)).toBe('4+ years');
    expect(formatYears(4.5)).toBe('4.5+ years');
  });
});

describe('formatPeriod', () => {
  it('formats start and end months', () => {
    expect(formatPeriod('2024-12', '2026-03')).toBe('Dec 2024 – Mar 2026');
  });
  it('shows Present without an end', () => {
    expect(formatPeriod('2026-04')).toBe('Apr 2026 – Present');
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/fill-in.test.ts tests/unit/experience.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/lib/fill-in.ts`**

```ts
export const FILL_IN = /\[fill-in[^\]]*\]/i;

type Env = Record<string, string | undefined>;

export function isStrictContent(env: Env = process.env): boolean {
  return env.CONTENT_STRICT === '1' || env.VERCEL_ENV === 'production';
}

export function findFillIns(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return FILL_IN.test(value) ? [path || '(root)'] : [];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findFillIns(item, path ? `${path}.${i}` : String(i)));
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.entries(value).flatMap(([key, item]) => findFillIns(item, path ? `${path}.${key}` : key));
  }
  return [];
}

/** Throws in strict mode (production) if any `[fill-in…]` marker is left in the value. */
export function guardFillIns<T>(value: T, where: string, strict: boolean = isStrictContent()): T {
  const hits = findFillIns(value);
  if (strict && hits.length > 0) {
    throw new Error(`Unfinished content in ${where}: ${hits.join(', ')}`);
  }
  return value;
}
```

- [ ] **Step 4: Create `src/lib/experience.ts`**

```ts
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseMonth(value: string): { year: number; month: number } {
  const [year, month] = value.split('-').map(Number);
  return { year, month };
}

/** Whole months between `careerStart` (YYYY-MM) and `now`, rounded down to 0.5 years. */
export function yearsOfExperience(careerStart: string, now: Date = new Date()): number {
  const { year, month } = parseMonth(careerStart);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(0, Math.floor(months / 6) / 2);
}

export function formatYears(years: number): string {
  return `${Number.isInteger(years) ? years.toFixed(0) : years.toFixed(1)}+ years`;
}

export function formatMonth(value: string): string {
  const { year, month } = parseMonth(value);
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatPeriod(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}
```

- [ ] **Step 5: Create `src/lib/schemas.ts`**

```ts
import { z } from 'zod';

const text = z.string().trim().min(1);
const month = z.string().regex(/^\d{4}-\d{2}$/, 'Use YYYY-MM');

export const metricSchema = z.object({ value: text, label: text });

export const caseStudySchema = z.object({
  title: text,
  client: text,
  domain: text,
  role: text,
  teamSize: text,
  period: text,
  stack: z.array(text).min(1),
  summary: text,
  metrics: z.array(metricSchema).default([]),
  featured: z.boolean().default(false),
  order: z.number().int(),
});

export const projectSchema = z.object({
  title: text,
  status: z.enum(['live', 'building']),
  repoUrl: z.url(),
  liveUrl: z.url().optional(),
  stack: z.array(text).min(1),
  summary: text,
  order: z.number().int().default(0),
});

export const postSchema = z.object({
  title: text,
  date: z.coerce.date(),
  summary: text,
  tags: z.array(text).default([]),
  draft: z.boolean().default(false),
});

export const testimonialSchema = z.object({
  quote: text,
  name: text,
  role: text,
  company: text,
  linkedinUrl: z.url(),
});

export const experienceSchema = z.object({
  company: text,
  role: text,
  location: text,
  start: month,
  end: month.optional(),
  highlights: z.array(text).min(1),
});

export const skillGroups = ['backend', 'frontend', 'cloud', 'data', 'tools'] as const;

export const skillSchema = z.object({
  name: text,
  group: z.enum(skillGroups),
  since: z.number().int().min(2015),
  usedIn: z.array(text).min(1),
});

export const profileSchema = z.object({
  name: text,
  headline: text,
  location: text,
  availability: text,
  email: z.email(),
  github: z.url(),
  /** plain string so a `[fill-in]` marker is allowed until the real URL is known */
  linkedin: text,
  careerStart: month,
});

export type CaseStudyData = z.output<typeof caseStudySchema>;
export type ProjectData = z.output<typeof projectSchema>;
export type PostData = z.output<typeof postSchema>;
export type Testimonial = z.output<typeof testimonialSchema>;
export type Experience = z.output<typeof experienceSchema>;
export type Skill = z.output<typeof skillSchema>;
export type SkillGroup = (typeof skillGroups)[number];
export type Profile = z.output<typeof profileSchema>;
```

- [ ] **Step 6: Run the tests to verify they pass**

Run: `npx vitest run tests/unit/fill-in.test.ts tests/unit/experience.test.ts`
Expected: all passed.

- [ ] **Step 7: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add content schemas, fill-in guard and experience helpers

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 5: Profile, experience, skills and testimonials data

**Files:**
- Create: `src/data/profile.ts`, `src/data/experience.ts`, `src/data/skills.ts`, `src/data/testimonials.ts`, `src/lib/skills.ts`
- Test: `tests/unit/data.test.ts`

- [ ] **Step 1: Write the failing test** `tests/unit/data.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { skills } from '@/data/skills';
import { testimonials } from '@/data/testimonials';
import { groupSkills } from '@/lib/skills';

describe('data files', () => {
  it('profile has the career start used for years of experience', () => {
    expect(profile.careerStart).toBe('2022-04');
    expect(profile.email).toContain('@');
  });

  it('experience is ordered newest first', () => {
    const starts = experience.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
    expect(experience[0].company).toBe('AEPartners');
  });

  it('testimonials start empty (only real quotes are added)', () => {
    expect(testimonials).toEqual([]);
  });
});

describe('groupSkills', () => {
  it('groups in fixed order, computes years and sorts by years', () => {
    const groups = groupSkills(
      [
        { name: 'Svelte 5', group: 'frontend', since: 2026, usedIn: ['AEPartners'] },
        { name: 'C#', group: 'backend', since: 2023, usedIn: ['TRIS'] },
        { name: 'TypeScript', group: 'frontend', since: 2024, usedIn: ['AEPartners'] },
      ],
      new Date(2026, 10, 1),
    );
    expect(groups.map((g) => g.group)).toEqual(['backend', 'frontend']);
    expect(groups[1].skills.map((s) => [s.name, s.years])).toEqual([
      ['TypeScript', 2],
      ['Svelte 5', 1],
    ]);
  });

  it('real skills data groups without error', () => {
    expect(groupSkills(skills).length).toBeGreaterThan(3);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/data.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/data/profile.ts`**

```ts
import { profileSchema } from '@/lib/schemas';
import { guardFillIns } from '@/lib/fill-in';

export const profile = guardFillIns(
  profileSchema.parse({
    name: 'Angad Kumar',
    headline: 'Full-stack engineer (.NET + TypeScript)',
    location: '[fill-in: location line, e.g. India · open to remote worldwide]',
    availability: 'Open to remote roles worldwide',
    email: 'angad.ak70@gmail.com',
    github: 'https://github.com/Angadak',
    linkedin: '[fill-in: correct LinkedIn profile URL]',
    careerStart: '2022-04',
  }),
  'src/data/profile.ts',
);
```

- [ ] **Step 4: Create `src/data/experience.ts`**

```ts
import { z } from 'zod';
import { experienceSchema } from '@/lib/schemas';
import { guardFillIns } from '@/lib/fill-in';

export const experience = guardFillIns(
  z.array(experienceSchema).parse([
    {
      company: 'AEPartners',
      role: 'Software Engineer',
      location: 'Brighton, VIC, Australia',
      start: '2026-04',
      highlights: [
        'Building a custom practice-management platform for accounting firms: client document requests, job workflow and email.',
        'Developing Svelte 5 + TypeScript front ends and ASP.NET Core Web APIs.',
        'Integrating third-party systems through REST APIs.',
      ],
    },
    {
      company: 'TechUTD',
      role: 'Software Engineer',
      location: 'Noida, India',
      start: '2024-12',
      end: '2026-03',
      highlights: [
        'Built the Edenred employee-benefits admin portal with Blazor and .NET Core, used by global clients.',
        'Set up CI/CD pipelines and Azure deployments.',
      ],
    },
    {
      company: 'AD Software Solutions',
      role: 'Software Developer',
      location: 'Delhi, India',
      start: '2023-04',
      end: '2024-12',
      highlights: [
        'Built ASP.NET Core APIs and dashboards for IRCTC government projects (TRIS), including face-recognition login.',
        'Delivered reporting modules for the CWECS water and energy analytics platform.',
        'Built Node.js back ends for the Moowr reconciliation platform and ClaimsToExcel.',
      ],
    },
    {
      company: 'MRM / McCann',
      role: 'Junior Software Developer',
      location: 'Gurugram, India',
      start: '2022-04',
      end: '2023-04',
      highlights: ['Developed websites for JCB, NASSCOM and BITS Pilani.'],
    },
  ]),
  'src/data/experience.ts',
);

export const education = [
  { school: 'Guru Gobind Singh Indraprastha University', degree: 'BCA (Computer Applications)', period: '2018 – 2021' },
] as const;

export const certifications = [
  { name: 'ASP.NET MVC 5 — Ultimate Guide', issuer: 'Udemy', date: 'Oct 2025' },
] as const;

export const alsoBuilt = [
  { name: 'ClaimsToExcel', detail: 'Node.js + Sequelize back end that turns healthcare claims into structured Excel reports (2023).' },
] as const;
```

- [ ] **Step 5: Create `src/data/skills.ts`**

```ts
import { z } from 'zod';
import { skillSchema } from '@/lib/schemas';

export const skills = z.array(skillSchema).parse([
  { name: 'C#', group: 'backend', since: 2022, usedIn: ['Edenred', 'TRIS', 'CWECS', 'AEPartners'] },
  { name: 'ASP.NET Core / Web API', group: 'backend', since: 2023, usedIn: ['TRIS', 'Edenred', 'AEPartners'] },
  { name: 'Entity Framework Core', group: 'backend', since: 2023, usedIn: ['TRIS', 'Edenred'] },
  { name: 'Blazor', group: 'backend', since: 2024, usedIn: ['Edenred'] },
  { name: 'Node.js / Express', group: 'backend', since: 2023, usedIn: ['Moowr', 'ClaimsToExcel'] },
  { name: 'TypeScript', group: 'frontend', since: 2024, usedIn: ['AEPartners'] },
  { name: 'Svelte 5', group: 'frontend', since: 2026, usedIn: ['AEPartners'] },
  { name: 'JavaScript', group: 'frontend', since: 2022, usedIn: ['MRM', 'TRIS', 'CWECS'] },
  { name: 'HTML / CSS / Tailwind', group: 'frontend', since: 2022, usedIn: ['MRM', 'AEPartners'] },
  { name: 'Azure', group: 'cloud', since: 2025, usedIn: ['Edenred'] },
  { name: 'Docker', group: 'cloud', since: 2025, usedIn: ['Edenred'] },
  { name: 'CI/CD (Azure DevOps, GitHub)', group: 'cloud', since: 2025, usedIn: ['Edenred'] },
  { name: 'SQL Server', group: 'data', since: 2023, usedIn: ['Edenred', 'TRIS'] },
  { name: 'MySQL', group: 'data', since: 2023, usedIn: ['TRIS', 'CWECS', 'Moowr'] },
  { name: 'Git', group: 'tools', since: 2022, usedIn: ['All projects'] },
  { name: 'Visual Studio / VS Code', group: 'tools', since: 2022, usedIn: ['All projects'] },
  { name: 'Swagger / OpenAPI', group: 'tools', since: 2023, usedIn: ['TRIS', 'CWECS'] },
]);
```

- [ ] **Step 6: Create `src/data/testimonials.ts`**

```ts
import { z } from 'zod';
import { testimonialSchema, type Testimonial } from '@/lib/schemas';

/** Add only real, attributed quotes (e.g. from LinkedIn recommendations). Section shows at 2+. */
export const testimonials: Testimonial[] = z.array(testimonialSchema).parse([]);
```

- [ ] **Step 7: Create `src/lib/skills.ts`**

```ts
import type { Skill, SkillGroup } from './schemas';

export const SKILL_GROUP_LABELS: Record<SkillGroup, string> = {
  backend: 'Backend',
  frontend: 'Frontend',
  cloud: 'Cloud & DevOps',
  data: 'Data',
  tools: 'Tools',
};

export type SkillWithYears = Skill & { years: number };
export type SkillGroupView = { group: SkillGroup; label: string; skills: SkillWithYears[] };

export function groupSkills(skills: Skill[], now: Date = new Date()): SkillGroupView[] {
  return (Object.keys(SKILL_GROUP_LABELS) as SkillGroup[])
    .map((group) => ({
      group,
      label: SKILL_GROUP_LABELS[group],
      skills: skills
        .filter((s) => s.group === group)
        .map((s) => ({ ...s, years: Math.max(1, now.getFullYear() - s.since) }))
        .sort((a, b) => b.years - a.years),
    }))
    .filter((g) => g.skills.length > 0);
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npx vitest run tests/unit/data.test.ts`
Expected: all passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add profile, experience, skills and testimonials data

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 6: MDX content loader and renderer

**Files:**
- Create: `src/lib/content.ts`, `src/components/mdx/mdx-components.tsx`, `src/components/mdx/mdx.tsx`
- Create fixtures: `tests/fixtures/content/case-studies/{alpha,beta}.mdx`, `tests/fixtures/content/invalid/broken.mdx`, `tests/fixtures/content/unfinished/todo.mdx`, `tests/fixtures/content/blog/{published,draft}.mdx`
- Test: `tests/unit/content.test.ts`, `tests/unit/mdx.test.tsx`

- [ ] **Step 1: Create the fixtures**

`tests/fixtures/content/case-studies/alpha.mdx`:

```mdx
---
title: Alpha platform
client: Example Co
domain: Fintech
role: Software Engineer
teamSize: "4"
period: 2025 – 2026
stack: [C#, TypeScript]
summary: Alpha summary.
metrics:
  - { value: "10k", label: users }
featured: true
order: 2
---

## Problem

Alpha body.
```

`tests/fixtures/content/case-studies/beta.mdx`:

```mdx
---
title: Beta portal
client: Example Co
domain: Benefits
role: Software Engineer
teamSize: "6"
period: 2024 – 2025
stack: [Blazor]
summary: Beta summary.
order: 1
---

Beta body.
```

`tests/fixtures/content/invalid/broken.mdx`:

```mdx
---
title: Missing everything else
order: 1
---

Body.
```

`tests/fixtures/content/unfinished/todo.mdx`:

```mdx
---
title: Todo
client: Example Co
domain: Fintech
role: Engineer
teamSize: "[fill-in: team size]"
period: 2026
stack: [C#]
summary: Todo.
order: 1
---

Body.
```

`tests/fixtures/content/blog/published.mdx`:

```mdx
---
title: Published post
date: 2026-10-01
summary: Published summary.
tags: [dotnet]
---

Published body.
```

`tests/fixtures/content/blog/draft.mdx`:

```mdx
---
title: Draft post
date: 2026-11-01
summary: Draft summary.
draft: true
---

Draft body.
```

- [ ] **Step 2: Write the failing test** `tests/unit/content.test.ts`

```ts
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCaseStudies, getPosts, loadCollection } from '@/lib/content';
import { caseStudySchema } from '@/lib/schemas';

const fixtures = path.join(process.cwd(), 'tests', 'fixtures', 'content');

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('loadCollection', () => {
  it('returns [] for a missing folder', () => {
    expect(loadCollection(path.join(fixtures, 'nope'), caseStudySchema)).toEqual([]);
  });

  it('throws with file and field on invalid frontmatter', () => {
    expect(() => loadCollection(path.join(fixtures, 'invalid'), caseStudySchema)).toThrow(/broken\.mdx.*client/s);
  });

  it('allows fill-in markers when not strict', () => {
    const [entry] = loadCollection(path.join(fixtures, 'unfinished'), caseStudySchema);
    expect(entry.teamSize).toContain('[fill-in');
  });

  it('rejects fill-in markers in strict mode', () => {
    vi.stubEnv('CONTENT_STRICT', '1');
    expect(() => loadCollection(path.join(fixtures, 'unfinished'), caseStudySchema)).toThrow(/Unfinished content.*teamSize/);
  });
});

describe('getCaseStudies', () => {
  it('sorts by order and adds slug + body', () => {
    const studies = getCaseStudies(path.join(fixtures, 'case-studies'));
    expect(studies.map((s) => s.slug)).toEqual(['beta', 'alpha']);
    expect(studies[1].metrics).toEqual([{ value: '10k', label: 'users' }]);
    expect(studies[0].featured).toBe(false);
    expect(studies[1].body).toContain('Alpha body.');
  });
});

describe('getPosts', () => {
  const dir = path.join(fixtures, 'blog');

  it('hides drafts when asked and sorts newest first', () => {
    expect(getPosts(dir, { includeDrafts: false }).map((p) => p.slug)).toEqual(['published']);
    expect(getPosts(dir, { includeDrafts: true }).map((p) => p.slug)).toEqual(['draft', 'published']);
  });

  it('parses dates', () => {
    expect(getPosts(dir, { includeDrafts: false })[0].date).toBeInstanceOf(Date);
  });
});
```

- [ ] **Step 3: Run it to verify it fails**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: FAIL, cannot resolve `@/lib/content`.

- [ ] **Step 4: Create `src/lib/content.ts`**

```ts
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { z } from 'zod';
import { caseStudySchema, postSchema, projectSchema } from './schemas';
import { guardFillIns } from './fill-in';

export const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export type Entry<T> = T & { slug: string; body: string };
export type CaseStudy = Entry<z.output<typeof caseStudySchema>>;
export type Project = Entry<z.output<typeof projectSchema>>;
export type Post = Entry<z.output<typeof postSchema>>;

export function loadCollection<S extends z.ZodType>(dir: string, schema: S): Entry<z.output<S>>[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const fullPath = path.join(dir, file);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        throw new Error(`Invalid frontmatter in ${fullPath}: ${issues}`);
      }
      const entry = {
        ...(parsed.data as object),
        slug: file.replace(/\.mdx$/, ''),
        body: content,
      } as Entry<z.output<S>>;
      return guardFillIns(entry, fullPath);
    });
}

export function getCaseStudies(dir = path.join(CONTENT_DIR, 'case-studies')): CaseStudy[] {
  return loadCollection(dir, caseStudySchema).sort((a, b) => a.order - b.order);
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((s) => s.slug === slug);
}

export function getProjects(
  dir = path.join(CONTENT_DIR, 'projects'),
  { liveOnly = true }: { liveOnly?: boolean } = {},
): Project[] {
  const all = loadCollection(dir, projectSchema).sort((a, b) => a.order - b.order);
  return liveOnly ? all.filter((p) => p.status === 'live') : all;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getPosts(
  dir = path.join(CONTENT_DIR, 'blog'),
  { includeDrafts = process.env.NODE_ENV !== 'production' }: { includeDrafts?: boolean } = {},
): Post[] {
  return loadCollection(dir, postSchema)
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
```

- [ ] **Step 5: Run the content test to verify it passes**

Run: `npx vitest run tests/unit/content.test.ts`
Expected: all passed.

- [ ] **Step 6: Write the failing MDX test** `tests/unit/mdx.test.tsx`

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Mdx } from '@/components/mdx/mdx';

describe('Mdx', () => {
  it('renders markdown, GFM tables and custom components', async () => {
    const source = [
      '## Problem',
      '',
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
      '',
      '<Callout title="Note">Hello callout</Callout>',
    ].join('\n');
    render(await Mdx({ source }));
    expect(screen.getByRole('heading', { level: 2, name: 'Problem' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Hello callout')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
  });

  it('highlights code blocks', async () => {
    render(await Mdx({ source: '```ts\nconst a = 1;\n```' }));
    expect(document.querySelector('pre.shiki')).not.toBeNull();
  });
});
```

- [ ] **Step 7: Run it to verify it fails**

Run: `npx vitest run tests/unit/mdx.test.tsx`
Expected: FAIL, cannot resolve `@/components/mdx/mdx`.

- [ ] **Step 8: Create `src/components/mdx/mdx-components.tsx`**

```tsx
import Image from 'next/image';

export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="my-8 rounded-xl border border-line border-l-4 border-l-accent bg-surface p-5">
      {title && <p className="label mb-2 text-accent">{title}</p>}
      <div className="text-fg">{children}</div>
    </aside>
  );
}

export function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="my-10">
      <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full rounded-xl border border-line" />
      {caption && <figcaption className="mt-3 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents = { Callout, Figure };
```

- [ ] **Step 9: Create `src/components/mdx/mdx.tsx`**

```tsx
import { evaluate, type EvaluateOptions } from '@mdx-js/mdx';
import * as runtime from 'react/jsx-runtime';
import remarkGfm from 'remark-gfm';
import rehypeShiki from '@shikijs/rehype';
import { mdxComponents } from './mdx-components';

const jsxRuntime = runtime as unknown as Pick<EvaluateOptions, 'Fragment' | 'jsx' | 'jsxs'>;

/** Server component: compiles MDX at build time (pages are statically generated). */
export async function Mdx({ source }: { source: string }) {
  const { default: Content } = await evaluate(source, {
    ...jsxRuntime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeShiki, { themes: { light: 'github-light', dark: 'github-dark' }, defaultColor: false }]],
  });
  return <Content components={mdxComponents} />;
}
```

- [ ] **Step 10: Run the MDX test to verify it passes**

Run: `npx vitest run tests/unit/mdx.test.tsx`
Expected: 2 passed.

- [ ] **Step 11: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add validated MDX content loader and renderer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Seed content (5 case studies, 2 blog drafts, CV)

Copy is drafted from the CV. Every unknown fact is a `[fill-in: …]` marker; dev builds show them, production (`VERCEL_ENV=production` or `CONTENT_STRICT=1`) refuses to build until they are replaced.

**Files:**
- Create: `src/content/case-studies/practice-manager.mdx`, `edenred-benefits-portal.mdx`, `tris.mdx`, `cwecs.mdx`, `moowr-reconciliation.mdx`
- Create: `src/content/blog/jwt-refresh-across-tabs.mdx`, `src/content/blog/client-document-requests.mdx`
- Create: `public/cv.pdf`
- Test: `tests/unit/seed-content.test.ts`

- [ ] **Step 1: Write the failing test** `tests/unit/seed-content.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { getCaseStudies, getPosts } from '@/lib/content';

describe('seed content', () => {
  it('has five case studies in the agreed order, three featured', () => {
    const studies = getCaseStudies();
    expect(studies.map((s) => s.slug)).toEqual([
      'practice-manager',
      'edenred-benefits-portal',
      'tris',
      'cwecs',
      'moowr-reconciliation',
    ]);
    expect(studies.filter((s) => s.featured).map((s) => s.slug)).toEqual([
      'practice-manager',
      'edenred-benefits-portal',
      'tris',
    ]);
  });

  it('does not include Finetica', () => {
    expect(getCaseStudies().some((s) => /finetica/i.test(s.title + s.body))).toBe(false);
  });

  it('ships blog posts as drafts until reviewed', () => {
    expect(getPosts(undefined, { includeDrafts: false })).toEqual([]);
    expect(getPosts(undefined, { includeDrafts: true })).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/seed-content.test.ts`
Expected: FAIL (no content yet).

- [ ] **Step 3: Create `src/content/case-studies/practice-manager.mdx`**

```mdx
---
title: Practice manager for accounting firms
client: "[fill-in: client name, or 'Australian accounting firm' if it can't be named]"
domain: Practice management
role: Software Engineer (full-stack)
teamSize: "[fill-in: team size]"
period: Apr 2026 – Present
stack: [Svelte 5, TypeScript, ASP.NET Core Web API, C#, "[fill-in: database and hosting]"]
summary: A custom practice-management platform in the spirit of Xero Practice Manager, combining a client document-request portal, job and task workflow, and email linked to clients and jobs.
metrics:
  - { value: "[fill-in]", label: active clients }
  - { value: "[fill-in]", label: jobs tracked per month }
  - { value: "[fill-in]", label: hours saved per week }
featured: true
order: 1
---

## Problem

Accounting firms chase clients for documents over email, track jobs in spreadsheets, and lose context because conversations live in personal inboxes. Off-the-shelf tools each solve one piece: one for collecting client information, another for workflow, another for practice admin. The firm wanted one system shaped around how it actually works.

## What I built

- **Client portal and document requests.** Staff send structured requests (checklists, file uploads, questions) and clients complete them in a portal with reminders until everything arrives.
- **Jobs and tasks.** Jobs move through configurable stages; tasks have owners, due dates and statuses so managers can see workload at a glance.
- **Email linked to work.** Client emails are threaded and attached to the right client and job, so anyone on the team can pick up the conversation.

[fill-in: your exact part — which of these you built end to end, which you contributed to]

## Architecture

[fill-in: short description for the architecture diagram — Svelte front end, .NET API, database, file storage, email provider, background jobs]

## Hard problems

### 1. Request status that clients and staff both trust

[fill-in: how request and item states are modelled, and how reminders avoid spamming clients]

### 2. Linking email to the right client and job

[fill-in: matching rules, edge cases such as shared addresses or forwarded threads]

### 3. Permissions across staff roles and client contacts

[fill-in: how access is checked in the API and reflected in the UI]
```

- [ ] **Step 4: Create `src/content/case-studies/edenred-benefits-portal.mdx`**

```mdx
---
title: Employee benefits admin portal
client: "[fill-in: confirm 'Edenred' can be named publicly]"
domain: Employee benefits
role: Software Engineer
teamSize: "[fill-in: team size]"
period: Dec 2024 – Mar 2026
stack: [Blazor, .NET Core, C#, Entity Framework, SQL Server, Azure, GitHub Actions]
summary: A secure admin portal for managing employee benefit schemes, used by large global clients to run benefit operations.
metrics:
  - { value: "[fill-in]", label: client companies }
  - { value: "[fill-in]", label: employees covered }
  - { value: "[fill-in]", label: deploy time after CI/CD }
featured: true
order: 2
---

## Problem

Benefit administrators at large companies needed one place to configure schemes, manage eligibility and review activity, without raising support tickets for routine changes.

## What I built

- Admin screens in Blazor backed by .NET Core services and Entity Framework.
- CI/CD pipelines and Azure deployments so releases became routine.
- [fill-in: the features you owned, e.g. scheme configuration, eligibility rules, audit history]

## Architecture

[fill-in: Blazor app, API layer, SQL Server, Azure services used]

## Hard problems

### 1. [fill-in: first challenge]

[fill-in: what made it hard and how you solved it]

### 2. Safe releases for a portal clients rely on daily

[fill-in: pipeline stages, environments, rollback approach]

### 3. [fill-in: third challenge]

[fill-in: details]
```

- [ ] **Step 5: Create `src/content/case-studies/tris.mdx`**

```mdx
---
title: TRIS — train operations APIs and dashboard
client: "[fill-in: how to name the IRCTC / government client publicly]"
domain: Government · Rail
role: Software Developer
teamSize: "[fill-in: team size]"
period: Aug 2023 – May 2024
stack: [ASP.NET Core, Web API, ASP.NET Core MVC, C#, Entity Framework, MySQL, jQuery, Swagger]
summary: RESTful APIs for train tracking and user management, plus a modular dashboard with face-recognition login and customisable reports.
metrics:
  - { value: "[fill-in]", label: API endpoints }
  - { value: "[fill-in]", label: daily users }
  - { value: "[fill-in]", label: response time after tuning }
featured: true
order: 3
---

## Problem

Operations staff needed reliable, secure access to train tracking data and reports, with strong authentication on shared terminals.

## What I built

- REST APIs for train tracking, user management and facial recognition, documented with Swagger.
- A modular ASP.NET Core MVC dashboard with customisable reports.
- Face-recognition login integrated into the dashboard sign-in flow.

## Architecture

[fill-in: API, dashboard, database, face-recognition service and how they connect]

## Hard problems

### 1. Face-recognition login that staff actually use

[fill-in: enrolment, matching threshold, fallback login]

### 2. Performance tuning the APIs

[fill-in: queries or caching changed, before/after numbers]

### 3. [fill-in: third challenge]

[fill-in: details]
```

- [ ] **Step 6: Create `src/content/case-studies/cwecs.mdx`**

```mdx
---
title: CWECS — water and energy analytics
client: "[fill-in: how to name the government client publicly]"
domain: Government · Sustainability
role: Software Developer
teamSize: "[fill-in: team size]"
period: May 2024 – Nov 2024
stack: [ASP.NET MVC, C#, MySQL, JavaScript, jQuery, Swagger]
summary: Scalable modules, dynamic charts and interactive dashboards for a government programme optimising water and energy usage.
metrics:
  - { value: "[fill-in]", label: sites monitored }
  - { value: "[fill-in]", label: reports generated per month }
featured: false
order: 4
---

## Problem

Programme managers needed to compare water and energy usage across sites and turn raw readings into decisions.

## What I built

- Modules for the CWECS Advanced Hi-Tech platform using MVC architecture.
- Dynamic charting and reporting for environmental analysis.
- Interactive operational dashboards for decision-making (CWECS Reporting System).

## Hard problems

### 1. [fill-in: first challenge]

[fill-in: details]

### 2. [fill-in: second challenge]

[fill-in: details]
```

- [ ] **Step 7: Create `src/content/case-studies/moowr-reconciliation.mdx`**

```mdx
---
title: Moowr — import/export reconciliation
client: "[fill-in: confirm 'Moowr' can be named publicly]"
domain: Logistics · Finance
role: Software Developer (back end)
teamSize: "[fill-in: team size]"
period: Jun 2024 – Nov 2024
stack: [Node.js, Express, MySQL, Sequelize, EJS]
summary: Back-end services for import/export operations, shipment tracking and customs duty reconciliation, with automated invoice generation.
metrics:
  - { value: "[fill-in]", label: shipments reconciled per month }
  - { value: "[fill-in]", label: manual hours removed }
featured: false
order: 5
---

## Problem

Finance teams reconciled customs duty and invoices for shipments by hand, which was slow and error-prone.

## What I built

- Back-end services for import/export operations and shipment tracking.
- Customs duty reconciliation logic.
- Automated invoice generation and financial data pipeline integration.

## Hard problems

### 1. [fill-in: first challenge]

[fill-in: details]

### 2. [fill-in: second challenge]

[fill-in: details]
```

- [ ] **Step 8: Create `src/content/blog/jwt-refresh-across-tabs.mdx`**

````mdx
---
title: Refreshing JWTs without logging users out of other tabs
date: 2026-11-24
summary: How to refresh short-lived access tokens once, share the result across every open tab, and avoid the race that logs people out.
tags: [auth, typescript, browser]
draft: true
---

Short-lived access tokens are good security, but they create a familiar bug: a user has three tabs open, the token expires, and all three tabs try to refresh at the same moment. One wins, the refresh token rotates, and the other two fail and log the user out.

## The fix: one refresher, many listeners

1. Before calling the refresh endpoint, a tab takes a lock so only one refresh runs at a time.
2. The winning tab stores the new token and announces it on a `BroadcastChannel`.
3. Every other tab listens and swaps in the new token instead of refreshing on its own.

```ts
const channel = new BroadcastChannel('auth');

channel.addEventListener('message', (event) => {
  if (event.data.type === 'token-refreshed') setAccessToken(event.data.token);
});

export async function refreshOnce(): Promise<string> {
  return navigator.locks.request('auth-refresh', async () => {
    const current = getAccessToken();
    if (current && !isExpiringSoon(current)) return current; // another tab already refreshed
    const token = await callRefreshEndpoint();
    setAccessToken(token);
    channel.postMessage({ type: 'token-refreshed', token });
    return token;
  });
}
```

## Logging out everywhere

The same channel carries a `logged-out` message, so signing out in one tab signs out all of them.

[fill-in: review this draft, add what you learned in production, then set draft: false]
````

- [ ] **Step 9: Create `src/content/blog/client-document-requests.mdx`**

```mdx
---
title: Designing a client document-request workflow
date: 2026-11-20
summary: Modelling requests, items and reminders so clients know what to send and staff know what is missing.
tags: [dotnet, svelte, product]
draft: true
---

Chasing documents is most of the admin work in an accounting practice. A good request workflow makes the missing items obvious to both sides.

## Model the request, not the email

A request belongs to a client and usually a job. It holds items: a file to upload, a question to answer, a checkbox to confirm. Each item has its own status, so "3 of 5 received" is a query, not a guess.

## Reminders that respect people

Reminders stop the moment a request is complete, and they back off over time. Staff can see when the last reminder went out before chasing manually.

## Make the portal boring

Clients should open the link, see a short checklist, upload, and leave. No account setup before the first upload.

[fill-in: review this draft, add details from the real build, then set draft: false]
```

- [ ] **Step 10: Add the CV file**

```bash
cp "D:/downlaods/Angad_Kumar.pdf" public/cv.pdf
```
This is an interim copy of the current CV. Angad will replace it with the updated CV (typo "AEPartnres" fixed, TypeScript/Svelte added, Finetica entry reviewed, phone number optional). Listed in spec §10.

- [ ] **Step 11: Run the test to verify it passes**

Run: `npx vitest run tests/unit/seed-content.test.ts`
Expected: 3 passed.

- [ ] **Step 12: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "content: draft case studies, blog drafts and interim CV

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Icons, UI primitives and prop illustrations

**Files:**
- Create: `src/components/ui/icons.tsx`, `src/components/ui/button.tsx`, `src/components/ui/chip.tsx`, `src/components/ui/section-heading.tsx`, `src/components/ui/socials.tsx`, `src/components/props/props.tsx`
- Test: `tests/unit/ui.test.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/ui.test.tsx`

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Socials } from '@/components/ui/socials';
import { PropIcon, PROP_NAMES } from '@/components/props/props';

describe('ButtonLink', () => {
  it('uses a plain anchor for files and external links', () => {
    render(<ButtonLink href="/cv.pdf" download>CV</ButtonLink>);
    const link = screen.getByRole('link', { name: 'CV' });
    expect(link).toHaveAttribute('href', '/cv.pdf');
    expect(link).toHaveAttribute('download');
  });
  it('opens external links in a new tab safely', () => {
    render(<ButtonLink href="https://github.com/x">Code</ButtonLink>);
    expect(screen.getByRole('link', { name: 'Code' })).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('SectionHeading', () => {
  it('renders the label and an h2', () => {
    render(<SectionHeading id="x" index="01" label="Case studies" word="WORK" prop="browser" />);
    expect(screen.getByText('01 / Case studies')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'WORK' })).toHaveAttribute('id', 'x');
  });
});

describe('Socials', () => {
  it('renders labelled links', () => {
    render(<Socials github="https://github.com/a" linkedin="https://linkedin.com/in/a" email="a@b.co" />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/a');
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:a@b.co');
  });
});

describe('PropIcon', () => {
  it('renders every prop as decorative svg', () => {
    for (const name of PROP_NAMES) {
      const { container, unmount } = render(<PropIcon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      unmount();
    }
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/ui.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/components/ui/icons.tsx`**

```tsx
type IconProps = { className?: string };

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function GitHubIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56v-1.97c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.17 1.18a10.98 10.98 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12.02C23.5 5.74 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function TerminalIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="m5 7 5 5-5 5" />
      <path d="M12 17h7" />
    </svg>
  );
}

export function CommandIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3Z" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} {...stroke}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/button.tsx`**

```tsx
import Link from 'next/link';

type Variant = 'primary' | 'secondary';

const base =
  'inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition active:scale-95';
const variants: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:bg-accent hover:text-bg',
  secondary: 'border border-line bg-surface text-fg hover:border-accent hover:text-accent',
};

export function buttonClass(variant: Variant = 'primary', className = ''): string {
  return `${base} ${variants[variant]} ${className}`.trim();
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  download?: boolean;
  children: React.ReactNode;
};

export function ButtonLink({ href, variant = 'primary', className = '', download, children }: ButtonLinkProps) {
  const external = href.startsWith('http');
  const plain = external || href.startsWith('mailto:') || /\.(pdf|xml)$/.test(href);
  if (plain) {
    return (
      <a
        href={href}
        className={buttonClass(variant, className)}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 5: Create `src/components/ui/chip.tsx`**

```tsx
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
```

- [ ] **Step 6: Create `src/components/props/props.tsx`**

```tsx
export const PROP_NAMES = ['database', 'browser', 'api', 'cloud', 'mug'] as const;
export type PropName = (typeof PROP_NAMES)[number];

const svgProps = {
  viewBox: '0 0 150 150',
  'aria-hidden': true as const,
  focusable: false as const,
  className: 'h-auto w-full',
};

function DatabaseProp() {
  return (
    <svg {...svgProps}>
      <path d="M29 36v78c0 8 20 14 46 14s46-6 46-14V36" className="fill-surface stroke-fg" strokeWidth={3} />
      <path d="M29 62c0 8 20 14 46 14s46-6 46-14M29 88c0 8 20 14 46 14s46-6 46-14" fill="none" className="stroke-fg" strokeWidth={3} />
      <ellipse cx="75" cy="36" rx="46" ry="14" className="fill-surface stroke-fg" strokeWidth={3} />
      <circle cx="104" cy="72" r="4" className="fill-accent" />
      <circle cx="104" cy="98" r="4" className="fill-accent" />
    </svg>
  );
}

function BrowserProp() {
  return (
    <svg {...svgProps}>
      <rect x="14" y="28" width="122" height="94" rx="8" className="fill-surface stroke-fg" strokeWidth={3} />
      <path d="M14 46h122" className="stroke-fg" strokeWidth={3} />
      <circle cx="26" cy="37" r="3" className="fill-accent" />
      <circle cx="36" cy="37" r="3" className="fill-fg" />
      <rect x="26" y="58" width="44" height="52" rx="4" className="fill-accent" />
      <rect x="78" y="58" width="46" height="8" rx="3" className="fill-fg" />
      <rect x="78" y="74" width="36" height="8" rx="3" className="fill-muted" />
      <rect x="78" y="90" width="42" height="20" rx="10" fill="none" className="stroke-fg" strokeWidth={3} />
    </svg>
  );
}

function ApiProp() {
  return (
    <svg {...svgProps}>
      <rect x="12" y="30" width="126" height="90" rx="8" className="fill-fg" />
      <text x="26" y="62" className="fill-accent font-mono" style={{ fontSize: 15, fontWeight: 700 }}>GET</text>
      <text x="62" y="62" className="fill-bg font-mono" style={{ fontSize: 15 }}>/me</text>
      <text x="26" y="88" className="fill-success font-mono" style={{ fontSize: 14 }}>200 OK</text>
      <rect x="26" y="98" width="10" height="14" className="fill-accent" />
    </svg>
  );
}

function CloudProp() {
  return (
    <svg {...svgProps}>
      <path
        d="M44 108c-17 0-28-11-28-25s11-25 26-25c4-17 18-28 35-28 20 0 35 14 37 33 13 1 22 11 22 22 0 13-10 23-24 23z"
        className="fill-surface stroke-fg"
        strokeWidth={3}
      />
      <path d="M60 84l14 12 22-26" fill="none" className="stroke-accent" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MugProp() {
  return (
    <svg {...svgProps}>
      <path d="M58 30q-8-12 2-22M76 30q-8-12 2-22M94 30q-8-12 2-22" fill="none" className="stroke-muted" strokeWidth={3} strokeLinecap="round" />
      <path d="M108 58q26 0 26 22t-26 22" fill="none" className="stroke-fg" strokeWidth={8} />
      <rect x="34" y="40" width="74" height="86" rx="10" className="fill-surface stroke-fg" strokeWidth={3} />
      <text x="46" y="92" className="fill-accent" style={{ fontSize: 22, fontWeight: 900 }}>C#</text>
    </svg>
  );
}

const PROPS: Record<PropName, () => React.JSX.Element> = {
  database: DatabaseProp,
  browser: BrowserProp,
  api: ApiProp,
  cloud: CloudProp,
  mug: MugProp,
};

export function PropIcon({ name }: { name: PropName }) {
  const Prop = PROPS[name];
  return <Prop />;
}
```

- [ ] **Step 7: Create `src/components/ui/section-heading.tsx`**

```tsx
import { PropIcon, type PropName } from '@/components/props/props';

type Props = { id: string; index: string; label: string; word: string; prop?: PropName };

export function SectionHeading({ id, index, label, word, prop }: Props) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        <p className="label text-accent">
          {index} / {label}
        </p>
        <h2 id={id} className="word-heading mt-2 text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-[-0.03em]">
          {word}
        </h2>
      </div>
      {prop && (
        <div className="hidden w-20 shrink-0 sm:block">
          <PropIcon name={prop} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create `src/components/ui/socials.tsx`**

```tsx
import { GitHubIcon, LinkedInIcon, MailIcon } from './icons';

type Props = { github: string; linkedin: string; email: string; vertical?: boolean };

export function Socials({ github, linkedin, email, vertical = false }: Props) {
  const items = [
    { href: github, label: 'GitHub', Icon: GitHubIcon },
    { href: linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { href: `mailto:${email}`, label: 'Email', Icon: MailIcon },
  ];
  return (
    <ul className={`flex gap-3 ${vertical ? 'flex-col' : ''}`}>
      {items.map(({ href, label, Icon }) => {
        const external = href.startsWith('http');
        return (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="grid size-9 place-items-center rounded-full border border-line text-fg transition hover:border-accent hover:text-accent active:scale-90"
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npx vitest run tests/unit/ui.test.tsx`
Expected: all passed.

- [ ] **Step 10: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add icons, buttons, section heading and prop illustrations

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Motion primitives (Reveal, TiltCard, Magnetic)

**Files:**
- Create: `src/hooks/use-media-query.ts`, `src/components/motion/reveal.tsx`, `src/components/motion/tilt-card.tsx`, `src/components/motion/magnetic.tsx`
- Test: `tests/unit/motion.test.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/motion.test.tsx`

```tsx
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';
import { MockIntersectionObserver, setMedia } from '../helpers/media';

const rect = { left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;

describe('Reveal', () => {
  it('marks content as shown once it scrolls into view', () => {
    render(<Reveal><p>Hello</p></Reveal>);
    const wrapper = screen.getByText('Hello').parentElement!;
    expect(wrapper).not.toHaveAttribute('data-shown');
    MockIntersectionObserver.instances[0].trigger(true, wrapper);
    expect(wrapper).toHaveAttribute('data-shown');
  });
});

describe('TiltCard', () => {
  it('tilts with a fine pointer', () => {
    setMedia('(pointer: fine)', true);
    render(<TiltCard><p>Card</p></TiltCard>);
    const el = screen.getByText('Card').parentElement!;
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect);
    fireEvent.mouseMove(el, { clientX: 100, clientY: 50 });
    expect(el.style.transform).toContain('rotateY(4.00deg)');
    fireEvent.mouseLeave(el);
    expect(el.style.transform).toBe('');
  });

  it('stays still with reduced motion', () => {
    setMedia('(pointer: fine)', true);
    setMedia('(prefers-reduced-motion: reduce)', true);
    render(<TiltCard><p>Card</p></TiltCard>);
    const el = screen.getByText('Card').parentElement!;
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect);
    fireEvent.mouseMove(el, { clientX: 100, clientY: 50 });
    expect(el.style.transform).toBe('');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/motion.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/hooks/use-media-query.ts`**

```ts
'use client';

import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
```

- [ ] **Step 4: Create `src/components/motion/reveal.tsx`**

```tsx
'use client';

import { useEffect, useRef } from 'react';

/** Fades content in once when scrolled into view. Hidden state only applies when JS runs (see globals.css). */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          el.dataset.shown = '';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-reveal className={className} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/motion/tilt-card.tsx`**

```tsx
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
```

- [ ] **Step 6: Create `src/components/motion/magnetic.tsx`**

```tsx
'use client';

import { useRef } from 'react';
import { useMediaQuery } from '@/hooks/use-media-query';

export function Magnetic({ children, strength = 0.25 }: { children: React.ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const finePointer = useMediaQuery('(pointer: fine)');

  function onMouseMove(event: React.MouseEvent<HTMLSpanElement>) {
    const el = ref.current;
    if (!el || reduced || !finePointer) return;
    const r = el.getBoundingClientRect();
    const dx = (event.clientX - (r.left + r.width / 2)) * strength;
    const dy = (event.clientY - (r.top + r.height / 2)) * strength;
    el.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
  }

  function onMouseLeave() {
    if (ref.current) ref.current.style.transform = '';
  }

  return (
    <span
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]"
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 7: Run the test to verify it passes**

Run: `npx vitest run tests/unit/motion.test.tsx`
Expected: 3 passed.

- [ ] **Step 8: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add reveal, tilt and magnetic motion primitives

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 10: Site navigation, header, footer and root layout

**Files:**
- Create: `src/lib/site.ts`, `src/lib/events.ts`, `src/components/layout/header.tsx`, `src/components/layout/nav-links.tsx`, `src/components/layout/mobile-menu.tsx`, `src/components/layout/interactive-buttons.tsx`, `src/components/layout/footer.tsx`
- Replace: `src/app/layout.tsx`
- Test: `tests/unit/layout.test.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/layout.test.tsx`

```tsx
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { buildNav } from '@/lib/site';
import { NavLinks } from '@/components/layout/nav-links';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { InteractiveButtons } from '@/components/layout/interactive-buttons';
import { OPEN_PALETTE, OPEN_TERMINAL } from '@/lib/events';

vi.mock('next/navigation', () => ({ usePathname: () => '/work/tris' }));

describe('buildNav', () => {
  it('hides Projects and Blog until they have content', () => {
    expect(buildNav({ hasProjects: false, hasPosts: false }).map((i) => i.label)).toEqual(['Work', 'Experience', 'Contact']);
    expect(buildNav({ hasProjects: true, hasPosts: true }).map((i) => i.label)).toEqual([
      'Work',
      'Projects',
      'Experience',
      'Blog',
      'Contact',
    ]);
  });
});

describe('NavLinks', () => {
  it('marks the current section', () => {
    render(<NavLinks items={buildNav({ hasProjects: false, hasPosts: false })} />);
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current');
  });
});

describe('MobileMenu', () => {
  it('opens and closes', () => {
    render(<MobileMenu items={buildNav({ hasProjects: false, hasPosts: false })} />);
    const toggle = screen.getByRole('button', { name: /menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getAllByRole('link', { name: 'Experience' })[0]);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('InteractiveButtons', () => {
  it('dispatches open events', () => {
    const terminal = vi.fn();
    const palette = vi.fn();
    window.addEventListener(OPEN_TERMINAL, terminal);
    window.addEventListener(OPEN_PALETTE, palette);
    render(<InteractiveButtons />);
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }));
    fireEvent.click(screen.getByRole('button', { name: /command palette/i }));
    expect(terminal).toHaveBeenCalledTimes(1);
    expect(palette).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/layout.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/lib/site.ts`**

```ts
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://my-portfolio-nine-khaki-46.vercel.app').replace(/\/$/, '');

export type NavItem = { href: string; label: string };
export type LinkRef = { slug: string; title: string };

/** Everything the terminal and command palette need, built once on the server. */
export type SiteIndex = {
  nav: NavItem[];
  caseStudies: LinkRef[];
  posts: LinkRef[];
  email: string;
  cvHref: string;
  whoami: string;
  status: string;
  skills: string[];
};

export function buildNav({ hasProjects, hasPosts }: { hasProjects: boolean; hasPosts: boolean }): NavItem[] {
  return [
    { href: '/work', label: 'Work' },
    ...(hasProjects ? [{ href: '/projects', label: 'Projects' }] : []),
    { href: '/experience', label: 'Experience' },
    ...(hasPosts ? [{ href: '/blog', label: 'Blog' }] : []),
    { href: '/contact', label: 'Contact' },
  ];
}
```

- [ ] **Step 4: Create `src/lib/events.ts`**

```ts
export const OPEN_TERMINAL = 'portfolio:open-terminal';
export const OPEN_PALETTE = 'portfolio:open-palette';
export const TOAST = 'portfolio:toast';

export type ToastTone = 'info' | 'error';
export type ToastDetail = { message: string; tone: ToastTone };

export function openTerminal(): void {
  window.dispatchEvent(new Event(OPEN_TERMINAL));
}

export function openPalette(): void {
  window.dispatchEvent(new Event(OPEN_PALETTE));
}

export function toast(message: string, tone: ToastTone = 'info'): void {
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST, { detail: { message, tone } }));
}
```

- [ ] **Step 5: Create `src/components/layout/nav-links.tsx`**

```tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/site';

export function NavLinks({ items, onNavigate, vertical = false }: { items: NavItem[]; onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname();
  return (
    <ul className={vertical ? 'flex flex-col gap-1' : 'flex items-center gap-6'}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`text-sm font-medium transition hover:text-accent ${active ? 'text-accent' : 'text-fg'} ${vertical ? 'block py-3 text-lg' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 6: Create `src/components/layout/interactive-buttons.tsx`**

```tsx
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
```

- [ ] **Step 7: Create `src/components/layout/mobile-menu.tsx`**

```tsx
'use client';

import { useState } from 'react';
import type { NavItem } from '@/lib/site';
import { NavLinks } from './nav-links';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-full border border-line active:scale-90"
      >
        {open ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
      </button>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="absolute inset-x-0 top-16 border-b border-line bg-bg px-4 pb-6">
          <NavLinks items={items} vertical onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}
```

- [ ] **Step 8: Create `src/components/layout/header.tsx`**

```tsx
import Link from 'next/link';
import type { NavItem } from '@/lib/site';
import { NavLinks } from './nav-links';
import { MobileMenu } from './mobile-menu';
import { InteractiveButtons } from './interactive-buttons';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header({ nav }: { nav: NavItem[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-sm font-black tracking-[0.08em]">
          ANGAD KUMAR
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks items={nav} />
        </nav>
        <div className="flex items-center gap-2">
          <InteractiveButtons />
          <ThemeToggle className="ml-1" />
          <MobileMenu items={nav} />
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 9: Create `src/components/layout/footer.tsx`**

```tsx
import { profile } from '@/data/profile';
import { Socials } from '@/components/ui/socials';

// Computed at build time (module scope keeps render pure).
const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-8">
        <p className="text-sm text-muted">
          © {YEAR} {profile.name}. Built with Next.js ·{' '}
          <a href="https://github.com/Angadak/My-Portfolio" className="underline underline-offset-4 hover:text-accent">
            source code
          </a>
        </p>
        <Socials github={profile.github} linkedin={profile.linkedin} email={profile.email} />
      </div>
    </footer>
  );
}
```

- [ ] **Step 10: Replace `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { themeInitScript } from '@/lib/theme';
import { SITE_URL, buildNav } from '@/lib/site';
import { getPosts, getProjects } from '@/lib/content';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Angad Kumar — Full-stack engineer (.NET + TypeScript)',
    template: '%s · Angad Kumar',
  },
  description:
    'Full-stack engineer building secure ASP.NET Core APIs and TypeScript front ends for fintech and enterprise teams. Open to remote roles worldwide.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Angad Kumar', locale: 'en' },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = buildNav({ hasProjects: getProjects().length > 0, hasPosts: getPosts().length > 0 });
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Header nav={nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 11: Run the test to verify it passes**

Run: `npx vitest run tests/unit/layout.test.tsx`
Expected: all passed.

- [ ] **Step 12: Check in the browser**

Run: `npm run dev`. Expected: sticky header with name, Work / Experience / Contact (Blog shows in dev because drafts are visible in dev), terminal and ⌘ icon buttons (no-op for now), theme toggle; footer with socials. Mobile width: menu button opens the list. Stop the server.

- [ ] **Step 13: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add header, footer, navigation and root layout

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 11: Hero word logic

**Files:**
- Create: `src/lib/hero.ts`
- Test: `tests/unit/hero.test.ts`

- [ ] **Step 1: Write the failing test** `tests/unit/hero.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { AUTO_ADVANCE_MS, cycle, heroWords } from '@/lib/hero';

describe('heroWords', () => {
  it('lists the five words in order with props', () => {
    const words = heroWords('4.5+ years');
    expect(words.map((w) => [w.word, w.prop])).toEqual([
      ['BACKEND', 'database'],
      ['FRONTEND', 'browser'],
      ['APIs', 'api'],
      ['CLOUD', 'cloud'],
      ['SHIPPING', 'mug'],
    ]);
    expect(words[4].caption).toBe('4.5+ years of production work');
  });
});

describe('cycle', () => {
  it('wraps both ways', () => {
    expect(cycle(4, 5, 1)).toBe(0);
    expect(cycle(0, 5, -1)).toBe(4);
    expect(cycle(2, 5, 1)).toBe(3);
  });
  it('is safe for empty lists', () => {
    expect(cycle(0, 0, 1)).toBe(0);
  });
});

it('auto-advances every 4 seconds', () => {
  expect(AUTO_ADVANCE_MS).toBe(4000);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/hero.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `src/lib/hero.ts`**

```ts
import type { PropName } from '@/components/props/props';

export type HeroWord = { word: string; prop: PropName; caption: string };

export const AUTO_ADVANCE_MS = 4000;

export function heroWords(years: string): HeroWord[] {
  return [
    { word: 'BACKEND', prop: 'database', caption: 'C# · ASP.NET Core · EF Core · SQL Server' },
    { word: 'FRONTEND', prop: 'browser', caption: 'TypeScript · Svelte 5 · React' },
    { word: 'APIs', prop: 'api', caption: 'REST · auth · integrations' },
    { word: 'CLOUD', prop: 'cloud', caption: 'Azure · Docker · CI/CD' },
    { word: 'SHIPPING', prop: 'mug', caption: `${years} of production work` },
  ];
}

export function cycle(index: number, length: number, step: 1 | -1): number {
  if (length <= 0) return 0;
  return (index + step + length) % length;
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/hero.test.ts`
Expected: all passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add hero word cycle logic

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 12: Hero stage component

**Files:**
- Create: `src/components/hero/hero-stage.tsx`
- Test: `tests/unit/hero-stage.test.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/hero-stage.test.tsx`

```tsx
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HeroStage } from '@/components/hero/hero-stage';
import { heroWords } from '@/lib/hero';
import { OPEN_TERMINAL } from '@/lib/events';
import { setMedia } from '../helpers/media';

const props = {
  words: heroWords('4.5+ years'),
  name: 'Angad Kumar',
  headline: 'Full-stack engineer (.NET + TypeScript)',
  availability: 'Open to remote roles worldwide',
  location: 'India',
  github: 'https://github.com/x',
  linkedin: 'https://linkedin.com/in/x',
  email: 'a@b.co',
};

const stage = () => screen.getByRole('region', { name: /skills showcase/i });

afterEach(() => {
  vi.useRealTimers();
});

describe('HeroStage', () => {
  it('shows the name as h1 and the first caption', () => {
    render(<HeroStage {...props} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Angad Kumar');
    expect(screen.getByText(/^01 \/ C#/)).toBeInTheDocument();
  });

  it('advances on click and moves with arrow keys', () => {
    render(<HeroStage {...props} />);
    fireEvent.click(stage());
    expect(screen.getByText(/^02 \/ TypeScript/)).toBeInTheDocument();
    fireEvent.keyDown(stage(), { key: 'ArrowLeft' });
    fireEvent.keyDown(stage(), { key: 'ArrowLeft' });
    expect(screen.getByText(/^05 \/ 4\.5\+ years/)).toBeInTheDocument();
  });

  it('auto-advances after 4 seconds', () => {
    vi.useFakeTimers();
    render(<HeroStage {...props} />);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(/^02 \//)).toBeInTheDocument();
  });

  it('does not auto-advance with reduced motion', () => {
    setMedia('(prefers-reduced-motion: reduce)', true);
    vi.useFakeTimers();
    render(<HeroStage {...props} />);
    act(() => {
      vi.advanceTimersByTime(9000);
    });
    expect(screen.getByText(/^01 \//)).toBeInTheDocument();
  });

  it('opens the terminal from the API prop', () => {
    const listener = vi.fn();
    window.addEventListener(OPEN_TERMINAL, listener);
    render(<HeroStage {...props} />);
    fireEvent.click(stage());
    fireEvent.click(stage());
    fireEvent.click(screen.getByRole('button', { name: 'Open terminal' }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/^03 \//)).toBeInTheDocument();
    window.removeEventListener(OPEN_TERMINAL, listener);
  });

  it('announces the current word politely', () => {
    render(<HeroStage {...props} />);
    expect(screen.getByText('BACKEND: C# · ASP.NET Core · EF Core · SQL Server')).toHaveAttribute('aria-live', 'polite');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/hero-stage.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `src/components/hero/hero-stage.tsx`**

```tsx
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
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/hero-stage.test.tsx`
Expected: 6 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add Sanjoo-style hero stage with word and prop cycling

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 13: Home page sections

**Files:**
- Create: `src/lib/seo.ts`, `src/components/sections/case-study-card.tsx`, `featured-work.tsx`, `projects-section.tsx`, `experience-snapshot.tsx`, `testimonials-section.tsx`, `latest-posts.tsx`, `contact-cta.tsx`
- Replace: `src/app/page.tsx`
- Test: `tests/unit/sections.test.tsx`, `tests/unit/seo.test.ts`

- [ ] **Step 1: Write the failing tests**

`tests/unit/sections.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeaturedWork } from '@/components/sections/featured-work';
import { ProjectsSection } from '@/components/sections/projects-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { LatestPosts } from '@/components/sections/latest-posts';
import type { CaseStudy, Post, Project } from '@/lib/content';
import type { Testimonial } from '@/lib/schemas';

const study = (slug: string, featured: boolean, order: number): CaseStudy => ({
  slug,
  body: '',
  title: `Title ${slug}`,
  client: 'Client',
  domain: 'Fintech',
  role: 'Engineer',
  teamSize: '4',
  period: '2025',
  stack: ['C#'],
  summary: `Summary ${slug}`,
  metrics: [{ value: '10k', label: 'users' }],
  featured,
  order,
});

const testimonial: Testimonial = {
  quote: 'Great engineer.',
  name: 'Sam Lee',
  role: 'Manager',
  company: 'Acme',
  linkedinUrl: 'https://linkedin.com/in/sam',
};

describe('home sections', () => {
  it('FeaturedWork shows up to three featured studies', () => {
    const studies = [study('a', true, 1), study('b', false, 2), study('c', true, 3), study('d', true, 4), study('e', true, 5)];
    render(<FeaturedWork studies={studies} />);
    expect(screen.getAllByRole('link', { name: /read case study/i })).toHaveLength(3);
    expect(screen.queryByText('Title b')).not.toBeInTheDocument();
  });

  it('empty sections render nothing', () => {
    const { container } = render(
      <>
        <FeaturedWork studies={[study('x', false, 1)]} />
        <ProjectsSection projects={[] as Project[]} />
        <TestimonialsSection items={[testimonial]} />
        <LatestPosts posts={[] as Post[]} />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('testimonials appear from two quotes', () => {
    render(<TestimonialsSection items={[testimonial, { ...testimonial, name: 'Ana Ruiz' }]} />);
    expect(screen.getByText('Ana Ruiz')).toBeInTheDocument();
  });
});
```

`tests/unit/seo.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { jsonLd, personJsonLd } from '@/lib/seo';

describe('seo helpers', () => {
  it('escapes < so JSON-LD cannot close the script tag', () => {
    expect(jsonLd({ a: '</script>' })).toBe('{"a":"\\u003c/script>"}');
  });

  it('person JSON-LD only links real URLs', () => {
    const person = personJsonLd();
    expect(person['@type']).toBe('Person');
    expect(person.sameAs.every((url: string) => url.startsWith('http'))).toBe(true);
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run tests/unit/sections.test.tsx tests/unit/seo.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/lib/seo.ts`**

```ts
import { profile } from '@/data/profile';
import { SITE_URL } from './site';

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin].filter((url) => url.startsWith('http')),
  };
}
```

- [ ] **Step 4: Create `src/components/sections/case-study-card.tsx`**

```tsx
import Link from 'next/link';
import type { CaseStudy } from '@/lib/content';
import { TiltCard } from '@/components/motion/tilt-card';
import { Chip } from '@/components/ui/chip';
import { ArrowRightIcon } from '@/components/ui/icons';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <TiltCard className="h-full">
      <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent">
        <p className="label text-accent">
          {String(study.order).padStart(2, '0')} / {study.domain}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">{study.title}</h3>
        <p className="mt-2 text-muted">{study.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {study.stack.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
        {study.metrics.length > 0 && (
          <dl className="mt-auto grid grid-cols-3 gap-2 pt-6">
            {study.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="flex flex-col-reverse rounded-lg border border-line p-3">
                <dt className="text-xs text-muted">{m.label}</dt>
                <dd className="text-lg font-black">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <Link
          href={`/work/${study.slug}`}
          aria-label={`Read case study: ${study.title}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent after:absolute after:inset-0"
        >
          Read case study <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
        </Link>
      </article>
    </TiltCard>
  );
}
```

- [ ] **Step 5: Create `src/components/sections/featured-work.tsx`**

```tsx
import type { CaseStudy } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { CaseStudyCard } from './case-study-card';

export function FeaturedWork({ studies }: { studies: CaseStudy[] }) {
  const featured = studies.filter((s) => s.featured).slice(0, 3);
  if (featured.length === 0) return null;
  return (
    <section aria-labelledby="featured-work" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="featured-work" index="01" label="Case studies" word="WORK" prop="browser" />
      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((study, i) => (
          <Reveal key={study.slug} delay={i * 80} className="h-full">
            <CaseStudyCard study={study} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10">
        <ButtonLink href="/work" variant="secondary">
          All case studies
        </ButtonLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create `src/components/sections/projects-section.tsx`**

```tsx
import Link from 'next/link';
import type { Project } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Chip } from '@/components/ui/chip';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full">
      <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-6">
        <h3 className="text-xl font-semibold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex gap-4 pt-6 text-sm font-medium">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
              Live demo
            </a>
          )}
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
            Source code
          </a>
        </div>
      </article>
    </TiltCard>
  );
}

export function ProjectsSection({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;
  return (
    <section aria-labelledby="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="projects" index="02" label="Open-source demos" word="BUILDS" prop="api" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Reveal key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Create `src/components/sections/experience-snapshot.tsx`**

```tsx
import type { Experience } from '@/lib/schemas';
import { formatPeriod } from '@/lib/experience';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';

export function ExperienceSnapshot({ items }: { items: Experience[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="experience-snapshot" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="experience-snapshot" index="03" label="Experience" word="JOURNEY" prop="mug" />
      <ol className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={`${item.company}-${item.start}`} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
            <div>
              <p className="font-semibold">
                {item.role} · {item.company}
              </p>
              <p className="text-sm text-muted">{item.location}</p>
            </div>
            <p className="label text-muted">{formatPeriod(item.start, item.end)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <ButtonLink href="/experience" variant="secondary">
          Full experience and skills
        </ButtonLink>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Create `src/components/sections/testimonials-section.tsx`**

```tsx
import type { Testimonial } from '@/lib/schemas';
import { SectionHeading } from '@/components/ui/section-heading';

export function TestimonialsSection({ items }: { items: Testimonial[] }) {
  if (items.length < 2) return null;
  return (
    <section aria-labelledby="testimonials" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="testimonials" index="04" label="Testimonials" word="KIND WORDS" />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t.name} className="rounded-xl border border-line bg-surface p-6">
            <blockquote className="text-lg">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <a href={t.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">
                {t.name}
              </a>
              <span className="text-muted">
                {' '}
                · {t.role}, {t.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 9: Create `src/components/sections/latest-posts.tsx`**

```tsx
import Link from 'next/link';
import type { Post } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });

export function LatestPosts({ posts }: { posts: Post[] }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="latest-posts" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="latest-posts" index="05" label="Writing" word="NOTES" />
      <ul className="divide-y divide-line border-y border-line">
        {posts.slice(0, 3).map((post) => (
          <li key={post.slug} className="py-5">
            <Link href={`/blog/${post.slug}`} className="group grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <span className="font-semibold group-hover:text-accent">{post.title}</span>
              <time dateTime={post.date.toISOString()} className="label text-muted">
                {dateFormat.format(post.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 10: Create `src/components/sections/contact-cta.tsx`**

```tsx
import { ButtonLink } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';

export function ContactCta({ email }: { email: string }) {
  return (
    <section aria-labelledby="contact-cta" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-8">
        <p className="label text-accent">06 / Contact</p>
        <h2 id="contact-cta" className="word-heading mt-3 text-[clamp(3rem,10vw,7rem)] font-black leading-none tracking-[-0.03em]">
          HELLO
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Hiring for a .NET or TypeScript role, or need a full-stack engineer for a project? Let&apos;s talk.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <ButtonLink href="/contact">Start a conversation</ButtonLink>
          </Magnetic>
          <ButtonLink href={`mailto:${email}`} variant="secondary">
            {email}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 11: Replace `src/app/page.tsx`**

```tsx
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { testimonials } from '@/data/testimonials';
import { getCaseStudies, getPosts, getProjects } from '@/lib/content';
import { formatYears, yearsOfExperience } from '@/lib/experience';
import { heroWords } from '@/lib/hero';
import { jsonLd, personJsonLd } from '@/lib/seo';
import { HeroStage } from '@/components/hero/hero-stage';
import { FeaturedWork } from '@/components/sections/featured-work';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ExperienceSnapshot } from '@/components/sections/experience-snapshot';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { LatestPosts } from '@/components/sections/latest-posts';
import { ContactCta } from '@/components/sections/contact-cta';

export default function HomePage() {
  const years = formatYears(yearsOfExperience(profile.careerStart));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd()) }} />
      <HeroStage
        words={heroWords(years)}
        name={profile.name}
        headline={profile.headline}
        availability={profile.availability}
        location={profile.location}
        github={profile.github}
        linkedin={profile.linkedin}
        email={profile.email}
      />
      <FeaturedWork studies={getCaseStudies()} />
      <ProjectsSection projects={getProjects()} />
      <ExperienceSnapshot items={experience} />
      <TestimonialsSection items={testimonials} />
      <LatestPosts posts={getPosts()} />
      <ContactCta email={profile.email} />
    </>
  );
}
```

- [ ] **Step 12: Run the tests to verify they pass**

Run: `npx vitest run tests/unit/sections.test.tsx tests/unit/seo.test.ts`
Expected: all passed.

- [ ] **Step 13: Check in the browser**

Run: `npm run dev`. Expected: full-height hero (word + prop, click/arrow cycling, cursor ring, parallax), then Work cards, Journey list, Notes (drafts visible in dev), Hello CTA. Stop the server.

- [ ] **Step 14: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: build home page sections

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 14: Case study pages

**Files:**
- Create: `src/components/work/summary-bar.tsx`, `src/components/work/results.tsx`, `src/app/work/page.tsx`, `src/app/work/[slug]/page.tsx`
- Modify: `src/app/globals.css` (append prose + Shiki rules)
- Test: `tests/unit/work.test.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/work.test.tsx`

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryBar } from '@/components/work/summary-bar';
import { Results } from '@/components/work/results';

describe('SummaryBar', () => {
  it('lists client, role, team, period and stack', () => {
    render(
      <SummaryBar client="Acme" role="Engineer" teamSize="5" period="2025 – 2026" stack={['C#', 'Svelte 5']} />,
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Svelte 5')).toBeInTheDocument();
  });
});

describe('Results', () => {
  it('renders nothing without metrics', () => {
    const { container } = render(<Results metrics={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it('renders a heading and each metric', () => {
    render(<Results metrics={[{ value: '40%', label: 'faster month-end' }]} />);
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/work.test.tsx`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/components/work/summary-bar.tsx`**

```tsx
import { Chip } from '@/components/ui/chip';

type Props = { client: string; role: string; teamSize: string; period: string; stack: string[] };

export function SummaryBar({ client, role, teamSize, period, stack }: Props) {
  const rows: [string, string][] = [
    ['Client', client],
    ['Role', role],
    ['Team', teamSize],
    ['Period', period],
  ];
  return (
    <dl className="mt-10 grid gap-6 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="label text-muted">{label}</dt>
          <dd className="mt-1 font-medium">{value}</dd>
        </div>
      ))}
      <div className="sm:col-span-2">
        <dt className="label text-muted">Stack</dt>
        <dd className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}
```

- [ ] **Step 4: Create `src/components/work/results.tsx`**

```tsx
type Metric = { value: string; label: string };

export function Results({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;
  return (
    <section aria-labelledby="results" className="mt-16">
      <h2 id="results" className="text-2xl font-extrabold tracking-tight">
        Results
      </h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col-reverse rounded-xl border border-line bg-surface p-5">
            <dt className="mt-1 text-sm text-muted">{m.label}</dt>
            <dd className="text-3xl font-black tracking-tight">{m.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 5: Append prose and Shiki styles to `src/app/globals.css`**

```css
/* Long-form content (case studies, blog) */
.prose-body {
  font-size: 1.0625rem;
  line-height: 1.75;
}
.prose-body > * + * { margin-top: 1.25em; }
.prose-body h2 { margin-top: 2.5em; font-size: 1.75rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
.prose-body h3 { margin-top: 2em; font-size: 1.25rem; font-weight: 700; }
.prose-body a { color: var(--accent); text-decoration: underline; text-underline-offset: 4px; }
.prose-body ul { list-style: disc; padding-left: 1.25em; }
.prose-body ol { list-style: decimal; padding-left: 1.25em; }
.prose-body li + li { margin-top: 0.4em; }
.prose-body strong { font-weight: 700; }
.prose-body :not(pre) > code {
  font-family: var(--font-mono);
  font-size: 0.9em;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 0.1em 0.35em;
}
.prose-body pre {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1rem 1.25rem;
}
.prose-body table { width: 100%; border-collapse: collapse; }
.prose-body th, .prose-body td { border-bottom: 1px solid var(--line); padding: 0.5rem; text-align: left; }

/* Shiki dual themes follow the site theme */
.shiki, .shiki span { color: var(--shiki-light); background-color: var(--shiki-light-bg); }
:root[data-theme="dark"] .shiki,
:root[data-theme="dark"] .shiki span { color: var(--shiki-dark); background-color: var(--shiki-dark-bg); }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .shiki,
  :root:not([data-theme="light"]) .shiki span { color: var(--shiki-dark); background-color: var(--shiki-dark-bg); }
}
```

- [ ] **Step 6: Create `src/app/work/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { getCaseStudies } from '@/lib/content';
import { CaseStudyCard } from '@/components/sections/case-study-card';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Case studies',
  description: 'Production systems Angad Kumar has built: practice management, employee benefits, rail operations and more.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  const studies = getCaseStudies();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <p className="label text-accent">Work</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
        Case studies
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Systems I&apos;ve built in production. Client code stays private, so each write-up explains the problem, my part
        and the results instead.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {studies.map((study) => (
          <Reveal key={study.slug} className="h-full">
            <CaseStudyCard study={study} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 7: Create `src/app/work/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCaseStudies, getCaseStudy } from '@/lib/content';
import { Mdx } from '@/components/mdx/mdx';
import { SummaryBar } from '@/components/work/summary-bar';
import { Results } from '@/components/work/results';
import { ArrowRightIcon } from '@/components/ui/icons';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: 'article', title: study.title, description: study.summary },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const all = getCaseStudies();
  const next = all[(all.findIndex((s) => s.slug === slug) + 1) % all.length];

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <p className="label text-accent">
        {String(study.order).padStart(2, '0')} / Case study · {study.domain}
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{study.title}</h1>
      <p className="mt-4 text-lg text-muted">{study.summary}</p>
      <SummaryBar client={study.client} role={study.role} teamSize={study.teamSize} period={study.period} stack={study.stack} />
      <div className="prose-body mt-12">
        <Mdx source={study.body} />
      </div>
      <Results metrics={study.metrics} />
      {next && next.slug !== study.slug && (
        <nav aria-label="Next case study" className="mt-20 border-t border-line pt-8">
          <p className="label text-muted">Next case study</p>
          <Link href={`/work/${next.slug}`} className="group mt-2 inline-flex items-center gap-3 text-2xl font-bold hover:text-accent">
            {next.title}
            <ArrowRightIcon className="size-6 transition group-hover:translate-x-1" />
          </Link>
        </nav>
      )}
    </article>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npx vitest run tests/unit/work.test.tsx`
Expected: 3 passed.

- [ ] **Step 9: Check in the browser**

Run: `npm run dev`, open `/work` and `/work/practice-manager`. Expected: cards grid; case study shows summary bar, MDX sections, Results with `[fill-in]` placeholders, next-study link. Stop the server.

- [ ] **Step 10: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add case study index and detail pages

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 15: Demo project pages (empty until demos ship)

**Files:**
- Create: `src/app/projects/page.tsx`, `src/app/projects/[slug]/page.tsx`
- Test: `tests/unit/projects.test.ts`

- [ ] **Step 1: Write the failing test** `tests/unit/projects.test.ts`

```ts
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { describe, expect, it } from 'vitest';
import { getProjects } from '@/lib/content';

function tempProjects(files: Record<string, string>): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'projects-'));
  for (const [name, body] of Object.entries(files)) fs.writeFileSync(path.join(dir, name), body);
  return dir;
}

const project = (status: string, order: number) => `---
title: Demo ${order}
status: ${status}
repoUrl: https://github.com/Angadak/demo-${order}
stack: [C#]
summary: Demo.
order: ${order}
---
Body.`;

describe('getProjects', () => {
  it('returns only live projects by default, sorted by order', () => {
    const dir = tempProjects({ 'b.mdx': project('live', 2), 'a.mdx': project('live', 1), 'c.mdx': project('building', 0) });
    expect(getProjects(dir).map((p) => p.slug)).toEqual(['a', 'b']);
    expect(getProjects(dir, { liveOnly: false })).toHaveLength(3);
  });

  it('is empty when the folder does not exist yet', () => {
    expect(getProjects()).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it**

Run: `npx vitest run tests/unit/projects.test.ts`
Expected: PASS already (loader from Task 6). This test locks the behaviour the pages rely on.

- [ ] **Step 3: Create `src/app/projects/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/content';
import { ProjectCard } from '@/components/sections/projects-section';

export const metadata: Metadata = {
  title: 'Demo projects',
  description: 'Open-source demo apps with live deployments, tests and CI.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  const projects = getProjects();
  if (projects.length === 0) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <p className="label text-accent">Builds</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
        Demo projects
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Open-source apps you can run, read and test. Each one has a live deployment, tests and CI.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/app/projects/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';
import { Mdx } from '@/components/mdx/mdx';
import { ButtonLink } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, alternates: { canonical: `/projects/${slug}` } };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <p className="label text-accent">Demo project</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.summary}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech}>
            <Chip>{tech}</Chip>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && <ButtonLink href={project.liveUrl}>Live demo</ButtonLink>}
        <ButtonLink href={project.repoUrl} variant="secondary">
          Source code
        </ButtonLink>
      </div>
      <div className="prose-body mt-12">
        <Mdx source={project.body} />
      </div>
    </article>
  );
}
```

- [ ] **Step 5: Verify the build tolerates zero projects**

Run: `npm run build`
Expected: build succeeds; `/projects` is listed and will return 404 at runtime; no `/projects/[slug]` pages are generated.

- [ ] **Step 6: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add demo project pages, hidden until a project is live

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 16: Experience page (timeline + skills sheet)

**Files:**
- Create: `src/app/experience/page.tsx`
- Test: `tests/unit/experience-page.test.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/experience-page.test.tsx`

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ExperiencePage from '@/app/experience/page';

describe('Experience page', () => {
  it('shows every role with highlights, grouped skills and ClaimsToExcel', () => {
    render(<ExperiencePage />);
    expect(screen.getByRole('heading', { level: 1, name: /experience/i })).toBeInTheDocument();
    const timeline = screen.getByRole('list', { name: 'Roles' });
    expect(within(timeline).getAllByRole('listitem').length).toBeGreaterThanOrEqual(4);
    expect(screen.getByRole('heading', { level: 3, name: 'Backend' })).toBeInTheDocument();
    expect(screen.getByText(/ClaimsToExcel/)).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/experience-page.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `src/app/experience/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { alsoBuilt, certifications, education, experience } from '@/data/experience';
import { skills } from '@/data/skills';
import { profile } from '@/data/profile';
import { formatPeriod, formatYears, yearsOfExperience } from '@/lib/experience';
import { groupSkills } from '@/lib/skills';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Experience and skills',
  description: 'Roles, skills with years of use, education and certification.',
  alternates: { canonical: '/experience' },
};

export default function ExperiencePage() {
  const years = formatYears(yearsOfExperience(profile.careerStart));
  const groups = groupSkills(skills);
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <p className="label text-accent">{years}</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
        Experience
      </h1>
      <div className="mt-6">
        <ButtonLink href="/cv.pdf" variant="secondary" download>
          Download CV (PDF)
        </ButtonLink>
      </div>

      <ol aria-label="Roles" className="mt-14 space-y-12 border-l border-line pl-6">
        {experience.map((role) => (
          <li key={`${role.company}-${role.start}`} className="relative">
            <span aria-hidden className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-accent" />
            <p className="label text-muted">{formatPeriod(role.start, role.end)}</p>
            <h2 className="mt-1 text-xl font-bold">
              {role.role} · {role.company}
            </h2>
            <p className="text-sm text-muted">{role.location}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {role.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section aria-labelledby="skills-heading" id="skills" className="mt-20">
        <h2 id="skills-heading" className="text-3xl font-black tracking-tight">
          Skills
        </h2>
        <p className="mt-2 text-muted">Years of hands-on use and where each skill was applied.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.group} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="label text-accent">{group.label}</h3>
              <ul className="mt-3 divide-y divide-line">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="py-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{skill.name}</span>
                      <span className="font-mono text-xs text-muted">
                        {skill.years} {skill.years === 1 ? 'yr' : 'yrs'}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{skill.usedIn.join(' · ')}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="education" className="mt-20 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 id="education" className="text-2xl font-black tracking-tight">
            Education
          </h2>
          {education.map((e) => (
            <p key={e.school} className="mt-3">
              <span className="font-medium">{e.degree}</span>
              <br />
              <span className="text-sm text-muted">
                {e.school} · {e.period}
              </span>
            </p>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Certification</h2>
          {certifications.map((c) => (
            <p key={c.name} className="mt-3">
              <span className="font-medium">{c.name}</span>
              <br />
              <span className="text-sm text-muted">
                {c.issuer} · {c.date}
              </span>
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="also-built" className="mt-16">
        <h2 id="also-built" className="text-2xl font-black tracking-tight">
          Also built
        </h2>
        <ul className="mt-3 space-y-2">
          {alsoBuilt.map((item) => (
            <li key={item.name}>
              <span className="font-medium">{item.name}</span> — <span className="text-muted">{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/experience-page.test.tsx`
Expected: 1 passed.

- [ ] **Step 5: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add experience page with timeline and skills sheet

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 17: Blog pages and RSS feed

**Files:**
- Create: `src/lib/rss.ts`, `src/app/blog/page.tsx`, `src/app/blog/[slug]/page.tsx`, `src/app/blog/rss.xml/route.ts`
- Modify: `src/lib/seo.ts` (add `articleJsonLd`)
- Test: `tests/unit/rss.test.ts`

- [ ] **Step 1: Write the failing test** `tests/unit/rss.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { buildRss, escapeXml } from '@/lib/rss';
import { articleJsonLd } from '@/lib/seo';
import type { Post } from '@/lib/content';

const post: Post = {
  slug: 'tokens',
  body: '',
  title: 'Tokens & tabs <part 1>',
  date: new Date('2026-11-01T00:00:00Z'),
  summary: 'Refresh "once".',
  tags: ['auth'],
  draft: false,
};

describe('escapeXml', () => {
  it('escapes the five XML entities', () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;');
  });
});

describe('buildRss', () => {
  it('builds a valid channel with escaped items', () => {
    const xml = buildRss([post], 'https://example.dev');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<link>https://example.dev/blog/tokens</link>');
    expect(xml).toContain('<title>Tokens &amp; tabs &lt;part 1&gt;</title>');
    expect(xml).toContain('<pubDate>Sun, 01 Nov 2026 00:00:00 GMT</pubDate>');
  });
});

describe('articleJsonLd', () => {
  it('describes a blog post', () => {
    const data = articleJsonLd(post);
    expect(data['@type']).toBe('BlogPosting');
    expect(data.headline).toBe(post.title);
    expect(data.datePublished).toBe('2026-11-01T00:00:00.000Z');
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/rss.test.ts`
Expected: FAIL, modules/exports not found.

- [ ] **Step 3: Create `src/lib/rss.ts`**

```ts
import type { Post } from './content';

export function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function buildRss(posts: Post[], siteUrl: string): string {
  const items = posts
    .map(
      (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}/blog/${p.slug}</link>
      <guid>${siteUrl}/blog/${p.slug}</guid>
      <pubDate>${p.date.toUTCString()}</pubDate>
      <description>${escapeXml(p.summary)}</description>
    </item>`,
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Angad Kumar — Notes</title>
    <link>${siteUrl}/blog</link>
    <description>Technical notes on .NET, TypeScript and building production software.</description>
    <language>en</language>
${items}
  </channel>
</rss>`;
}
```

- [ ] **Step 4: Replace `src/lib/seo.ts`** (adds `articleJsonLd`)

```ts
import { profile } from '@/data/profile';
import type { Post } from './content';
import { SITE_URL } from './site';

/** Serialises JSON-LD safely for a <script> tag. */
export function jsonLd(data: object): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    url: SITE_URL,
    email: `mailto:${profile.email}`,
    sameAs: [profile.github, profile.linkedin].filter((url) => url.startsWith('http')),
  };
}

export function articleJsonLd(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date.toISOString(),
    url: `${SITE_URL}/blog/${post.slug}`,
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    keywords: post.tags.join(', '),
  };
}
```

- [ ] **Step 5: Create `src/app/blog/page.tsx`**

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Technical notes on .NET, TypeScript and building production software.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
};

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

export default function BlogPage() {
  const posts = getPosts();
  if (posts.length === 0) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <p className="label text-accent">Writing</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">Notes</h1>
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <time dateTime={post.date.toISOString()} className="label text-muted">
              {dateFormat.format(post.date)}
            </time>
            <h2 className="mt-1 text-xl font-bold">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            <p className="mt-1 text-muted">{post.summary}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">
        <a href="/blog/rss.xml" className="underline underline-offset-4 hover:text-accent">
          RSS feed
        </a>
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Create `src/app/blog/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/content';
import { jsonLd, articleJsonLd } from '@/lib/seo';
import { Mdx } from '@/components/mdx/mdx';
import { Chip } from '@/components/ui/chip';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: 'article', title: post.title, description: post.summary, publishedTime: post.date.toISOString() },
  };
}

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }} />
      <time dateTime={post.date.toISOString()} className="label text-accent">
        {dateFormat.format(post.date)}
      </time>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-lg text-muted">{post.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li key={tag}>
            <Chip>{tag}</Chip>
          </li>
        ))}
      </ul>
      <div className="prose-body mt-12">
        <Mdx source={post.body} />
      </div>
    </article>
  );
}
```

- [ ] **Step 7: Create `src/app/blog/rss.xml/route.ts`**

```ts
import { getPosts } from '@/lib/content';
import { buildRss } from '@/lib/rss';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export function GET() {
  return new Response(buildRss(getPosts(), SITE_URL), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
```

- [ ] **Step 8: Run the test to verify it passes**

Run: `npx vitest run tests/unit/rss.test.ts`
Expected: all passed.

- [ ] **Step 9: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add blog index, post pages and RSS feed

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 18: Contact form, server action and contact page

**Files:**
- Create: `src/lib/contact.ts`, `src/lib/senders.ts`, `src/lib/clipboard.ts`, `src/app/contact/actions.ts`, `src/components/contact/contact-form.tsx`, `src/components/contact/copy-email-button.tsx`, `src/app/contact/page.tsx`
- Test: `tests/unit/contact.test.ts`, `tests/unit/contact-form.test.tsx`

- [ ] **Step 1: Write the failing logic test** `tests/unit/contact.test.ts`

```ts
import { describe, expect, it, vi } from 'vitest';
import { handleContact, MIN_FILL_MS, SUCCESS_MESSAGE, validateContact } from '@/lib/contact';
import { getSender } from '@/lib/senders';

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [k, v] of Object.entries(values)) data.set(k, v);
  return data;
}

const valid = { name: 'Sam Lee', email: 'sam@example.com', message: 'We would like to talk about a role.', elapsedMs: String(MIN_FILL_MS + 1) };

describe('validateContact', () => {
  it('returns friendly field errors', () => {
    const result = validateContact({ name: '', email: 'nope', message: 'short' });
    expect(result).toEqual({
      errors: {
        name: 'Enter your name',
        email: 'Enter a valid email address',
        message: 'Write at least 10 characters',
      },
    });
  });
  it('trims input', () => {
    expect(validateContact({ name: '  Sam  ', email: ' sam@example.com ', message: '  long enough message  ' })).toEqual({
      data: { name: 'Sam', email: 'sam@example.com', message: 'long enough message' },
    });
  });
});

describe('handleContact', () => {
  it('silently accepts honeypot submissions without sending', async () => {
    const send = vi.fn();
    const result = await handleContact(form({ ...valid, company: 'Spam Inc' }), send);
    expect(result.status).toBe('success');
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects forms submitted too fast', async () => {
    const send = vi.fn();
    const result = await handleContact(form({ ...valid, elapsedMs: '200' }), send);
    expect(result.status).toBe('error');
    expect(send).not.toHaveBeenCalled();
  });

  it('returns field errors for invalid input', async () => {
    const result = await handleContact(form({ ...valid, email: 'bad' }), vi.fn());
    expect(result.fieldErrors?.email).toBe('Enter a valid email address');
  });

  it('sends valid messages', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const result = await handleContact(form(valid), send);
    expect(send).toHaveBeenCalledWith({ name: 'Sam Lee', email: 'sam@example.com', message: 'We would like to talk about a role.' });
    expect(result).toEqual({ status: 'success', message: SUCCESS_MESSAGE });
  });

  it('reports sender failures instead of failing silently', async () => {
    const result = await handleContact(form(valid), vi.fn().mockRejectedValue(new Error('down')));
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/couldn't be sent/);
  });
});

describe('getSender', () => {
  it('log transport fails for @fail.test addresses and succeeds otherwise', async () => {
    const send = getSender({ CONTACT_TRANSPORT: 'log' });
    await expect(send({ name: 'A', email: 'x@fail.test', message: 'hello there!' })).rejects.toThrow();
    await expect(send({ name: 'A', email: 'x@example.com', message: 'hello there!' })).resolves.toBeUndefined();
  });

  it('throws when Resend is not configured', async () => {
    await expect(getSender({})({ name: 'A', email: 'a@b.co', message: 'hello there!' })).rejects.toThrow(/not configured/);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/contact.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/lib/contact.ts`** (no server-only imports: the form uses it in the browser too)

```ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Keep your name under 100 characters'),
  email: z.string().trim().pipe(z.email('Enter a valid email address')),
  message: z.string().trim().min(10, 'Write at least 10 characters').max(5000, 'Keep it under 5,000 characters'),
});

export type ContactInput = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;
export type ContactState = { status: 'idle' | 'success' | 'error'; message?: string; fieldErrors?: FieldErrors };
export type Sender = (input: ContactInput) => Promise<void>;

export const MIN_FILL_MS = 3000;
export const SUCCESS_MESSAGE = 'Thanks, your message is on its way.';

const FIELDS: ContactField[] = ['name', 'email', 'message'];

export function validateContact(input: Record<string, unknown>): { data: ContactInput } | { errors: FieldErrors } {
  const parsed = contactSchema.safeParse(input);
  if (parsed.success) return { data: parsed.data };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (FIELDS.includes(key as ContactField) && !errors[key as ContactField]) {
      errors[key as ContactField] = issue.message;
    }
  }
  return { errors };
}

function field(form: FormData, name: string): string {
  return String(form.get(name) ?? '');
}

export async function handleContact(form: FormData, send: Sender): Promise<ContactState> {
  if (field(form, 'company').trim() !== '') return { status: 'success', message: SUCCESS_MESSAGE };

  const elapsed = Number(form.get('elapsedMs'));
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { status: 'error', message: 'That was quick. Wait a few seconds and send again.' };
  }

  const result = validateContact({ name: field(form, 'name'), email: field(form, 'email'), message: field(form, 'message') });
  if ('errors' in result) {
    return { status: 'error', message: 'Check the highlighted fields.', fieldErrors: result.errors };
  }

  try {
    await send(result.data);
    return { status: 'success', message: SUCCESS_MESSAGE };
  } catch {
    return { status: 'error', message: "Your message couldn't be sent." };
  }
}
```

- [ ] **Step 4: Create `src/lib/senders.ts`**

```ts
import { Resend } from 'resend';
import type { Sender } from './contact';

type Env = Record<string, string | undefined>;

export function getSender(env: Env = process.env): Sender {
  if (env.CONTACT_TRANSPORT === 'log') {
    return async (message) => {
      if (message.email.endsWith('@fail.test')) throw new Error('Forced failure for tests');
      console.info('[contact] message received from', message.email);
    };
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return async () => {
      throw new Error('Contact email is not configured');
    };
  }

  const resend = new Resend(apiKey);
  return async (message) => {
    const { error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
      to,
      replyTo: message.email,
      subject: `Portfolio message from ${message.name}`,
      text: `${message.message}\n\n— ${message.name} <${message.email}>`,
    });
    if (error) throw new Error(error.message);
  };
}
```

- [ ] **Step 5: Run the logic test to verify it passes**

Run: `npx vitest run tests/unit/contact.test.ts`
Expected: all passed.

- [ ] **Step 6: Create `src/app/contact/actions.ts`**

```ts
'use server';

import { handleContact, type ContactState } from '@/lib/contact';
import { getSender } from '@/lib/senders';

export async function sendContact(form: FormData): Promise<ContactState> {
  return handleContact(form, getSender());
}
```

- [ ] **Step 7: Write the failing form test** `tests/unit/contact-form.test.tsx`

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactForm } from '@/components/contact/contact-form';
import { TOAST } from '@/lib/events';

const { sendContact } = vi.hoisted(() => ({ sendContact: vi.fn() }));
vi.mock('@/app/contact/actions', () => ({ sendContact }));

describe('ContactForm', () => {
  it('shows field errors without calling the server when invalid', async () => {
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByRole('alert')).toHaveTextContent('a@b.co');
    expect(sendContact).not.toHaveBeenCalled();
  });

  it('sends, toasts and resets on success', async () => {
    sendContact.mockResolvedValue({ status: 'success', message: 'Thanks, your message is on its way.' });
    const toastListener = vi.fn();
    window.addEventListener(TOAST, toastListener);
    const user = userEvent.setup();
    render(<ContactForm email="a@b.co" />);
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Sam Lee');
    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'sam@example.com');
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'We would like to talk about a role.');
    await user.click(screen.getByRole('button', { name: 'Send message' }));
    await waitFor(() => expect(toastListener).toHaveBeenCalledTimes(1));
    const sent = sendContact.mock.calls[0][0] as FormData;
    expect(sent.get('email')).toBe('sam@example.com');
    expect(Number(sent.get('elapsedMs'))).toBeGreaterThanOrEqual(0);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    window.removeEventListener(TOAST, toastListener);
  });
});
```

- [ ] **Step 8: Run it to verify it fails**

Run: `npx vitest run tests/unit/contact-form.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 9: Create `src/components/contact/contact-form.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { sendContact } from '@/app/contact/actions';
import { validateContact, type ContactState, type FieldErrors } from '@/lib/contact';
import { toast } from '@/lib/events';
import { buttonClass } from '@/components/ui/button';

export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<ContactState>({ status: 'idle' });
  const [pending, startTransition] = useTransition();
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const local = validateContact({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    if ('errors' in local) {
      setState({ status: 'error', message: 'Check the highlighted fields.', fieldErrors: local.errors });
      return;
    }
    data.set('elapsedMs', String(Date.now() - mountedAt.current));
    startTransition(async () => {
      const result = await sendContact(data);
      setState(result);
      if (result.status === 'success') {
        form.reset();
        mountedAt.current = Date.now();
        toast(result.message ?? 'Message sent');
      }
    });
  }

  const errors: FieldErrors = state.fieldErrors ?? {};

  return (
    <form onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field name="name" label="Name" autoComplete="name" error={errors.name} />
      <Field name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
      <Field name="message" label="Message" multiline error={errors.message} />
      {state.status === 'error' && state.message && (
        <p role="alert" className="text-sm text-danger">
          {state.message} You can also email{' '}
          <a href={`mailto:${email}`} className="font-medium underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      )}
      <div>
        <button type="submit" disabled={pending} className={buttonClass('primary', 'disabled:opacity-60')}>
          {pending ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  error?: string;
};

function Field({ name, label, type = 'text', autoComplete, multiline = false, error }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className:
      'w-full rounded-xl border border-line bg-bg px-4 py-3 text-fg outline-none transition focus:border-accent aria-[invalid=true]:border-danger',
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {multiline ? <textarea {...shared} rows={6} /> : <input {...shared} type={type} autoComplete={autoComplete} />}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 10: Run the form test to verify it passes**

Run: `npx vitest run tests/unit/contact-form.test.tsx`
Expected: 2 passed.

- [ ] **Step 11: Create `src/lib/clipboard.ts`**

```ts
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 12: Create `src/components/contact/copy-email-button.tsx`**

```tsx
'use client';

import { copyText } from '@/lib/clipboard';
import { toast } from '@/lib/events';
import { buttonClass } from '@/components/ui/button';

export function CopyEmailButton({ email }: { email: string }) {
  async function onClick() {
    if (await copyText(email)) toast('Email copied');
    else toast("Couldn't copy. Select the address instead.", 'error');
  }
  return (
    <button type="button" onClick={onClick} className={buttonClass('secondary', 'h-9 px-4 text-xs')}>
      Copy email
    </button>
  );
}
```

- [ ] **Step 13: Create `src/app/contact/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import { ContactForm } from '@/components/contact/contact-form';
import { CopyEmailButton } from '@/components/contact/copy-email-button';
import { ButtonLink } from '@/components/ui/button';
import { Socials } from '@/components/ui/socials';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Angad Kumar about full-stack .NET and TypeScript roles or projects.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-4 py-16 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="label text-accent">Contact</p>
        <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
          Let&apos;s talk
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          Hiring for a full-stack .NET or TypeScript role, or have a project in mind? Send a message or reach me directly.
        </p>
        <dl className="mt-10 space-y-6">
          <div>
            <dt className="label text-muted">Email</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="font-medium underline underline-offset-4 hover:text-accent">
                {profile.email}
              </a>
              <CopyEmailButton email={profile.email} />
            </dd>
          </div>
          <div>
            <dt className="label text-muted">Location</dt>
            <dd className="mt-1">{profile.location}</dd>
          </div>
          <div>
            <dt className="label text-muted">Elsewhere</dt>
            <dd className="mt-2">
              <Socials github={profile.github} linkedin={profile.linkedin} email={profile.email} />
            </dd>
          </div>
        </dl>
        <div className="mt-10">
          <ButtonLink href="/cv.pdf" variant="secondary" download>
            Download CV
          </ButtonLink>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <ContactForm email={profile.email} />
      </div>
    </div>
  );
}
```

- [ ] **Step 14: Manual check with the log transport**

Run: `CONTACT_TRANSPORT=log npm run dev`, open `/contact`, wait 3 s, send a valid message. Expected: terminal prints `[contact] message received from …`; form clears. Use an `…@fail.test` email: red error with a mailto link appears. Stop the server.

- [ ] **Step 15: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add contact page with validated server action and Resend sender

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 19: SEO routes, Open Graph images and 404

**Files:**
- Create: `src/lib/og.tsx`, `src/app/opengraph-image.tsx`, `src/app/work/[slug]/opengraph-image.tsx`, `src/app/blog/[slug]/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/not-found.tsx`
- Test: `tests/unit/seo-routes.test.ts`

- [ ] **Step 1: Write the failing test** `tests/unit/seo-routes.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { SITE_URL } from '@/lib/site';

describe('sitemap', () => {
  it('lists core pages and every case study, but not empty sections', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/work/practice-manager`);
    expect(urls).toContain(`${SITE_URL}/experience`);
    expect(urls).not.toContain(`${SITE_URL}/projects`);
  });
});

describe('robots', () => {
  it('allows crawling and points at the sitemap', () => {
    const result = robots();
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/seo-routes.test.ts`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create `src/app/sitemap.ts`**

```ts
import type { MetadataRoute } from 'next';
import { getCaseStudies, getPosts, getProjects } from '@/lib/content';
import { SITE_URL } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const projects = getProjects();
  const pages = ['/', '/work', '/experience', '/contact', ...(projects.length ? ['/projects'] : []), ...(posts.length ? ['/blog'] : [])];
  return [
    ...pages.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...getCaseStudies().map((s) => ({ url: `${SITE_URL}/work/${s.slug}` })),
    ...projects.map((p) => ({ url: `${SITE_URL}/projects/${p.slug}` })),
    ...posts.map((p) => ({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: p.date })),
  ];
}
```

- [ ] **Step 4: Create `src/app/robots.ts`**

```ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run tests/unit/seo-routes.test.ts`
Expected: 2 passed.

- [ ] **Step 6: Create `src/lib/og.tsx`**

```tsx
import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

export function renderOg({ kicker, title }: { kicker: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0d0d10',
          color: '#ededf0',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#a78bfa', letterSpacing: 4, textTransform: 'uppercase' }}>{kicker}</div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#8a8a93' }}>
          <span>Angad Kumar</span>
          <span>Full-stack engineer · .NET + TypeScript</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
```

- [ ] **Step 7: Create `src/app/opengraph-image.tsx`**

```tsx
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Angad Kumar — Full-stack engineer (.NET + TypeScript)';

export default function Image() {
  return renderOg({ kicker: 'Portfolio', title: 'Building secure .NET APIs and TypeScript apps' });
}
```

- [ ] **Step 8: Create `src/app/work/[slug]/opengraph-image.tsx`**

```tsx
import { getCaseStudies, getCaseStudy } from '@/lib/content';
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Case study by Angad Kumar';

export function generateStaticParams() {
  return getCaseStudies().map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return renderOg({ kicker: study ? `Case study · ${study.domain}` : 'Case study', title: study?.title ?? 'Case study' });
}
```

- [ ] **Step 9: Create `src/app/blog/[slug]/opengraph-image.tsx`**

```tsx
import { getPost, getPosts } from '@/lib/content';
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Note by Angad Kumar';

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return renderOg({ kicker: 'Notes', title: post?.title ?? 'Notes' });
}
```

- [ ] **Step 10: Create `src/app/not-found.tsx`**

```tsx
import { PropIcon } from '@/components/props/props';
import { ButtonLink } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-3xl place-items-center px-4 py-24 text-center">
      <div className="w-32">
        <PropIcon name="mug" />
      </div>
      <p className="label mt-6 text-accent">404 / Not found</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight">This page took a coffee break</h1>
      <p className="mt-3 text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <div className="mt-8">
        <ButtonLink href="/">Back to home</ButtonLink>
      </div>
    </div>
  );
}
```

- [ ] **Step 11: Verify the build and the OG images**

Run: `npm run build && npm run start -- -p 3300`, then open `http://localhost:3300/opengraph-image` and `http://localhost:3300/work/tris/opengraph-image`. Expected: dark 1200×630 cards with the right title. `http://localhost:3300/nope` shows the 404 page. Stop the server.

- [ ] **Step 12: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add sitemap, robots, Open Graph images and 404 page

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 20: Terminal command logic

**Files:**
- Create: `src/lib/terminal/commands.ts`
- Test: `tests/unit/terminal-commands.test.ts`

- [ ] **Step 1: Write the failing test** `tests/unit/terminal-commands.test.ts`

```ts
import { describe, expect, it } from 'vitest';
import { complete, runCommand } from '@/lib/terminal/commands';
import type { SiteIndex } from '@/lib/site';

const ctx: SiteIndex = {
  nav: [],
  caseStudies: [
    { slug: 'practice-manager', title: 'Practice manager' },
    { slug: 'tris', title: 'TRIS' },
  ],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'Angad Kumar · Full-stack engineer · 4.5+ years',
  status: '● Open to remote roles worldwide',
  skills: ['Backend         C#, ASP.NET Core'],
};

describe('runCommand', () => {
  it('ignores empty input', () => {
    expect(runCommand('   ', ctx)).toEqual({ lines: [] });
  });

  it('lists commands on help', () => {
    const { lines } = runCommand('help', ctx);
    expect(lines[0]).toBe('Available commands:');
    expect(lines.some((l) => l.includes('sudo hire-me'))).toBe(true);
  });

  it('is case and whitespace insensitive', () => {
    expect(runCommand('  WhoAmI ', ctx).lines).toEqual([ctx.whoami]);
  });

  it('lists and opens case studies', () => {
    expect(runCommand('work', ctx).lines.join('\n')).toContain('practice-manager');
    expect(runCommand('work tris', ctx).effect).toEqual({ type: 'navigate', href: '/work/tris' });
    expect(runCommand('work nope', ctx).effect).toBeUndefined();
  });

  it('has navigation, download, clear and close effects', () => {
    expect(runCommand('contact', ctx).effect).toEqual({ type: 'navigate', href: '/contact' });
    expect(runCommand('sudo hire-me', ctx).effect).toEqual({ type: 'navigate', href: '/contact' });
    expect(runCommand('cv', ctx).effect).toEqual({ type: 'download', href: '/cv.pdf' });
    expect(runCommand('clear', ctx).effect).toEqual({ type: 'clear' });
    expect(runCommand('exit', ctx).effect).toEqual({ type: 'close' });
  });

  it('says when there are no posts', () => {
    expect(runCommand('blog', ctx)).toEqual({ lines: ['No posts published yet.'] });
  });

  it('suggests help for unknown commands', () => {
    expect(runCommand('rm -rf /', ctx).lines[0]).toBe("command not found: rm. Type 'help'.");
  });
});

describe('complete', () => {
  it('completes known commands by prefix', () => {
    expect(complete('wh')).toEqual(['whoami']);
    expect(complete('c')).toEqual(['contact', 'cv', 'clear']);
    expect(complete('')).toEqual([]);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/terminal-commands.test.ts`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `src/lib/terminal/commands.ts`**

```ts
import type { SiteIndex } from '@/lib/site';

export type CommandEffect =
  | { type: 'navigate'; href: string }
  | { type: 'download'; href: string }
  | { type: 'clear' }
  | { type: 'close' };

export type CommandResult = { lines: string[]; effect?: CommandEffect };

const HELP: [string, string][] = [
  ['help', 'show this list'],
  ['whoami', 'who I am'],
  ['status', 'availability'],
  ['skills', 'skills by area'],
  ['work [name]', 'list or open case studies'],
  ['blog', 'latest notes'],
  ['contact', 'open the contact page'],
  ['cv', 'download my CV'],
  ['clear', 'clear the screen'],
  ['exit', 'close the terminal'],
  ['sudo hire-me', 'you know what this does'],
];

export const COMMANDS = ['help', 'whoami', 'status', 'skills', 'work', 'blog', 'contact', 'cv', 'clear', 'exit', 'sudo hire-me'];

export function runCommand(raw: string, ctx: SiteIndex): CommandResult {
  const input = raw.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!input) return { lines: [] };
  if (input === 'sudo hire-me') {
    return { lines: ['Permission granted. Opening the contact page…'], effect: { type: 'navigate', href: '/contact' } };
  }
  const [command, ...args] = input.split(' ');

  switch (command) {
    case 'help':
      return { lines: ['Available commands:', ...HELP.map(([name, description]) => `  ${name.padEnd(14)}${description}`)] };
    case 'whoami':
      return { lines: [ctx.whoami] };
    case 'status':
      return { lines: [ctx.status] };
    case 'skills':
      return { lines: ctx.skills };
    case 'work': {
      const slug = args[0];
      if (!slug) {
        return {
          lines: [...ctx.caseStudies.map((c) => `  ${c.slug.padEnd(26)}${c.title}`), "Type 'work <name>' to open one."],
        };
      }
      const study = ctx.caseStudies.find((c) => c.slug === slug);
      return study
        ? { lines: [`Opening ${study.title}…`], effect: { type: 'navigate', href: `/work/${study.slug}` } }
        : { lines: [`No case study called '${slug}'. Type 'work' to list them.`] };
    }
    case 'blog':
      return ctx.posts.length
        ? { lines: ctx.posts.slice(0, 5).map((p) => `  ${p.title}`), effect: { type: 'navigate', href: '/blog' } }
        : { lines: ['No posts published yet.'] };
    case 'contact':
      return { lines: [`Email: ${ctx.email}`, 'Opening the contact page…'], effect: { type: 'navigate', href: '/contact' } };
    case 'cv':
      return { lines: ['Downloading CV…'], effect: { type: 'download', href: ctx.cvHref } };
    case 'clear':
      return { lines: [], effect: { type: 'clear' } };
    case 'exit':
      return { lines: [], effect: { type: 'close' } };
    default:
      return { lines: [`command not found: ${command}. Type 'help'.`] };
  }
}

export function complete(prefix: string): string[] {
  const p = prefix.trim().toLowerCase();
  if (!p) return [];
  return COMMANDS.filter((c) => c.startsWith(p));
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/terminal-commands.test.ts`
Expected: all passed. (`complete('c')` order follows `COMMANDS`: contact, cv, clear.)

- [ ] **Step 5: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add terminal command registry

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 21: Terminal UI, toaster, nav progress and interactive layer

**Files:**
- Create: `src/components/terminal/terminal.tsx`, `src/components/motion/toaster.tsx`, `src/components/motion/nav-progress.tsx`, `src/components/interactive/interactive-layer.tsx`
- Create (stub for this task, replaced in Task 22): `src/components/palette/command-palette.tsx`
- Replace: `src/app/layout.tsx`
- Test: `tests/unit/terminal.test.tsx`, `tests/unit/interactive.test.tsx`

- [ ] **Step 1: Write the failing terminal test** `tests/unit/terminal.test.tsx`

```tsx
import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Terminal } from '@/components/terminal/terminal';
import type { SiteIndex } from '@/lib/site';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const ctx: SiteIndex = {
  nav: [],
  caseStudies: [{ slug: 'tris', title: 'TRIS' }],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'Angad Kumar · engineer',
  status: '● open',
  skills: ['Backend  C#'],
};

function setup() {
  const onClose = vi.fn();
  render(<Terminal ctx={ctx} onClose={onClose} />);
  const input = screen.getByRole('textbox', { name: 'Terminal command' });
  const run = (value: string) => {
    fireEvent.change(input, { target: { value } });
    fireEvent.keyDown(input, { key: 'Enter' });
  };
  return { onClose, input, run };
}

describe('Terminal', () => {
  it('focuses the prompt and runs help', () => {
    const { input, run } = setup();
    expect(input).toHaveFocus();
    run('help');
    expect(screen.getByText('Available commands:')).toBeInTheDocument();
  });

  it('navigates and closes on contact', () => {
    const { run, onClose } = setup();
    run('contact');
    expect(push).toHaveBeenCalledWith('/contact');
    expect(onClose).toHaveBeenCalled();
  });

  it('recalls history and completes with Tab', () => {
    const { input, run } = setup();
    run('whoami');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveValue('whoami');
    fireEvent.change(input, { target: { value: 'sta' } });
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input).toHaveValue('status');
  });

  it('clears and closes on Escape', () => {
    const { run, onClose, input } = setup();
    run('whoami');
    run('clear');
    expect(screen.queryByText('Angad Kumar · engineer')).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/terminal.test.tsx`
Expected: FAIL, module not found.

- [ ] **Step 3: Create `src/components/terminal/terminal.tsx`**

```tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { complete, runCommand } from '@/lib/terminal/commands';
import type { SiteIndex } from '@/lib/site';
import { CloseIcon } from '@/components/ui/icons';

type Line = { kind: 'in' | 'out'; text: string };

const PROMPT = 'angad@dev:~$';

export function Terminal({ ctx, onClose }: { ctx: SiteIndex; onClose: () => void }) {
  const router = useRouter();
  const [lines, setLines] = useState<Line[]>([{ kind: 'out', text: "Type 'help' to see what I can do." }]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const out = outputRef.current;
    if (out) out.scrollTop = out.scrollHeight;
  }, [lines]);

  function submit() {
    const input = value;
    setValue('');
    setCursor(null);
    if (input.trim()) setHistory((h) => [...h, input]);
    const result = runCommand(input, ctx);
    if (result.effect?.type === 'clear') {
      setLines([]);
      return;
    }
    setLines((current) => [...current, { kind: 'in', text: input }, ...result.lines.map((text) => ({ kind: 'out' as const, text }))]);
    if (result.effect?.type === 'navigate') {
      router.push(result.effect.href);
      onClose();
    } else if (result.effect?.type === 'download') {
      const link = document.createElement('a');
      link.href = result.effect.href;
      link.download = '';
      link.click();
    } else if (result.effect?.type === 'close') {
      onClose();
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      submit();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (history.length === 0) return;
      const next = cursor === null ? history.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setValue(history[next]);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (cursor === null) return;
      const next = cursor + 1;
      if (next >= history.length) {
        setCursor(null);
        setValue('');
      } else {
        setCursor(next);
        setValue(history[next]);
      }
    } else if (event.key === 'Tab') {
      event.preventDefault();
      const matches = complete(value);
      if (matches.length === 1) setValue(matches[0]);
      else if (matches.length > 1) setLines((current) => [...current, { kind: 'out', text: matches.join('   ') }]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terminal"
        className="w-full max-w-2xl overflow-hidden rounded-xl border border-white/10 bg-[#0f0f14] font-mono text-sm text-[#e9e6ef] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
          <span className="text-xs text-[#a39fb8]">angad@dev: ~</span>
          <button type="button" onClick={onClose} aria-label="Close terminal" className="rounded p-1 text-[#a39fb8] hover:text-white">
            <CloseIcon className="size-4" />
          </button>
        </div>
        <div ref={outputRef} aria-live="polite" className="max-h-[50vh] min-h-48 overflow-y-auto p-4">
          {lines.map((line, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {line.kind === 'in' ? (
                <>
                  <span className="text-[#c4b5fd]">{PROMPT}</span> {line.text}
                </>
              ) : (
                line.text
              )}
            </div>
          ))}
        </div>
        <label className="flex items-center gap-2 border-t border-white/10 px-4 py-3">
          <span aria-hidden className="text-[#c4b5fd]">
            {PROMPT}
          </span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal command"
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            className="flex-1 bg-transparent text-[#e9e6ef] outline-none"
          />
        </label>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the terminal test to verify it passes**

Run: `npx vitest run tests/unit/terminal.test.tsx`
Expected: 4 passed.

- [ ] **Step 5: Create `src/components/motion/toaster.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { TOAST, type ToastDetail } from '@/lib/events';

type Toast = ToastDetail & { id: number };

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    let nextId = 0;
    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      const item = { ...detail, id: ++nextId };
      setItems((current) => [...current, item]);
      window.setTimeout(() => setItems((current) => current.filter((t) => t.id !== item.id)), 3500);
    }
    window.addEventListener(TOAST, onToast);
    return () => window.removeEventListener(TOAST, onToast);
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-full px-4 py-2 text-sm font-medium shadow-lg ${item.tone === 'error' ? 'border border-danger bg-surface text-danger' : 'bg-fg text-bg'}`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 6: Create `src/components/motion/nav-progress.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/** Thin accent bar shown from an internal link click until the pathname changes. */
export function NavProgress() {
  const pathname = usePathname();
  const [from, setFrom] = useState<string | null>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement).closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (/\.(pdf|xml)$/.test(url.pathname)) return;
      setFrom(window.location.pathname);
    }
    function onPopState() {
      setFrom(null);
    }
    document.addEventListener('click', onClick);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  if (from === null || from !== pathname) return null;
  return (
    <div
      aria-hidden
      data-nav-progress
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent animate-[nav-load_8s_cubic-bezier(0.1,0.7,0.2,1)_forwards]"
    />
  );
}
```

- [ ] **Step 7: Create a temporary `src/components/palette/command-palette.tsx`** (Task 22 replaces it)

```tsx
'use client';

import type { SiteIndex } from '@/lib/site';

export function CommandPalette({ onClose }: { index: SiteIndex; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Command palette" className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <button type="button" onClick={onClose} className="rounded-full bg-surface px-4 py-2">
        Close
      </button>
    </div>
  );
}
```

- [ ] **Step 8: Write the failing interactive-layer test** `tests/unit/interactive.test.tsx`

```tsx
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { InteractiveLayer } from '@/components/interactive/interactive-layer';
import { Toaster } from '@/components/motion/toaster';
import { openTerminal, toast } from '@/lib/events';
import type { SiteIndex } from '@/lib/site';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const index: SiteIndex = {
  nav: [{ href: '/work', label: 'Work' }],
  caseStudies: [],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'me',
  status: 'open',
  skills: [],
};

describe('InteractiveLayer', () => {
  it('opens the terminal with the backtick key and closes with Escape', async () => {
    render(<InteractiveLayer index={index} />);
    fireEvent.keyDown(window, { key: '`' });
    const input = await screen.findByRole('textbox', { name: 'Terminal command' });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Terminal' })).not.toBeInTheDocument();
  });

  it('ignores the backtick while typing in a field', () => {
    render(
      <>
        <input aria-label="Other field" />
        <InteractiveLayer index={index} />
      </>,
    );
    const field = screen.getByRole('textbox', { name: 'Other field' });
    field.focus();
    fireEvent.keyDown(field, { key: '`' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the palette with Ctrl+K and the terminal from events', async () => {
    render(<InteractiveLayer index={index} />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    act(() => openTerminal());
    expect(await screen.findByRole('dialog', { name: 'Terminal' })).toBeInTheDocument();
  });
});

describe('Toaster', () => {
  it('shows and then removes a toast', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => toast('Email copied'));
    expect(screen.getByText('Email copied')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3600);
    });
    expect(screen.queryByText('Email copied')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
```

- [ ] **Step 9: Run it to verify it fails**

Run: `npx vitest run tests/unit/interactive.test.tsx`
Expected: FAIL, `interactive-layer` not found.

- [ ] **Step 10: Create `src/components/interactive/interactive-layer.tsx`**

```tsx
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { OPEN_PALETTE, OPEN_TERMINAL } from '@/lib/events';
import type { SiteIndex } from '@/lib/site';

const Terminal = dynamic(() => import('@/components/terminal/terminal').then((m) => m.Terminal), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/palette/command-palette').then((m) => m.CommandPalette), { ssr: false });

type Panel = 'terminal' | 'palette' | null;

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
}

export function InteractiveLayer({ index }: { index: SiteIndex }) {
  const [panel, setPanel] = useState<Panel>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((next: Exclude<Panel, null>) => {
    if (document.activeElement instanceof HTMLElement) lastFocus.current = document.activeElement;
    setPanel(next);
  }, []);

  const close = useCallback(() => {
    setPanel(null);
    window.requestAnimationFrame(() => lastFocus.current?.focus());
  }, []);

  useEffect(() => {
    const onTerminal = () => show('terminal');
    const onPalette = () => show('palette');
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        show('palette');
      } else if (event.key === '`' && !isTyping(event.target)) {
        event.preventDefault();
        show('terminal');
      }
    }
    window.addEventListener(OPEN_TERMINAL, onTerminal);
    window.addEventListener(OPEN_PALETTE, onPalette);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener(OPEN_TERMINAL, onTerminal);
      window.removeEventListener(OPEN_PALETTE, onPalette);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [show]);

  if (panel === 'terminal') return <Terminal ctx={index} onClose={close} />;
  if (panel === 'palette') return <CommandPalette index={index} onClose={close} />;
  return null;
}
```

- [ ] **Step 11: Run the interactive test to verify it passes**

Run: `npx vitest run tests/unit/interactive.test.tsx`
Expected: 4 passed.

- [ ] **Step 12: Replace `src/app/layout.tsx`** (final version)

```tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { themeInitScript } from '@/lib/theme';
import { SITE_URL, buildNav, type SiteIndex } from '@/lib/site';
import { getCaseStudies, getPosts, getProjects } from '@/lib/content';
import { formatYears, yearsOfExperience } from '@/lib/experience';
import { groupSkills } from '@/lib/skills';
import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { InteractiveLayer } from '@/components/interactive/interactive-layer';
import { Toaster } from '@/components/motion/toaster';
import { NavProgress } from '@/components/motion/nav-progress';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Angad Kumar — Full-stack engineer (.NET + TypeScript)',
    template: '%s · Angad Kumar',
  },
  description:
    'Full-stack engineer building secure ASP.NET Core APIs and TypeScript front ends for fintech and enterprise teams. Open to remote roles worldwide.',
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: 'Angad Kumar', locale: 'en' },
  twitter: { card: 'summary_large_image' },
};

function buildSiteIndex(): SiteIndex {
  const posts = getPosts();
  const years = formatYears(yearsOfExperience(profile.careerStart));
  return {
    nav: buildNav({ hasProjects: getProjects().length > 0, hasPosts: posts.length > 0 }),
    caseStudies: getCaseStudies().map(({ slug, title }) => ({ slug, title })),
    posts: posts.map(({ slug, title }) => ({ slug, title })),
    email: profile.email,
    cvHref: '/cv.pdf',
    whoami: `${profile.name} · ${profile.headline} · ${years}`,
    status: `● ${profile.availability} · ${profile.location}`,
    skills: groupSkills(skills).map((g) => `${g.label.padEnd(16)}${g.skills.map((s) => s.name).join(', ')}`),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const index = buildSiteIndex();
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col bg-bg text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:rounded-full focus:bg-fg focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Header nav={index.nav} />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <InteractiveLayer index={index} />
        <Toaster />
        <NavProgress />
        <Analytics />
      </body>
    </html>
  );
}
```

- [ ] **Step 13: Check in the browser**

Run: `npm run dev`. Expected: `` ` `` opens the terminal (try `help`, `work tris`, `sudo hire-me`); header terminal button and the hero "APIs" prop open it too; Esc closes and returns focus; clicking a nav link shows the thin violet bar; "Copy email" on `/contact` shows a toast. Stop the server.

- [ ] **Step 14: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add terminal, toaster, nav progress and interactive layer

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 22: Command palette

**Files:**
- Replace: `src/components/palette/command-palette.tsx`
- Test: `tests/unit/command-palette.test.tsx`

- [ ] **Step 1: Write the failing test** `tests/unit/command-palette.test.tsx`

```tsx
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '@/components/palette/command-palette';
import { OPEN_TERMINAL } from '@/lib/events';
import type { SiteIndex } from '@/lib/site';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const index: SiteIndex = {
  nav: [
    { href: '/work', label: 'Work' },
    { href: '/experience', label: 'Experience' },
  ],
  caseStudies: [{ slug: 'tris', title: 'TRIS — train operations APIs and dashboard' }],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'me',
  status: 'open',
  skills: [],
};

describe('CommandPalette', () => {
  it('filters and navigates to a case study', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CommandPalette index={index} onClose={onClose} />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveFocus();
    await user.type(input, 'train');
    expect(screen.queryByRole('option', { name: 'Experience' })).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/work/tris');
  });

  it('runs actions', async () => {
    const user = userEvent.setup();
    const listener = vi.fn();
    window.addEventListener(OPEN_TERMINAL, listener);
    render(<CommandPalette index={index} onClose={vi.fn()} />);
    await user.click(screen.getByRole('option', { name: /open terminal/i }));
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_TERMINAL, listener);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CommandPalette index={index} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run tests/unit/command-palette.test.tsx`
Expected: FAIL (the stub has no combobox).

- [ ] **Step 3: Replace `src/components/palette/command-palette.tsx`**

```tsx
'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import type { SiteIndex } from '@/lib/site';
import { openTerminal, toast } from '@/lib/events';
import { toggleDocumentTheme } from '@/lib/theme';
import { copyText } from '@/lib/clipboard';

const itemClass =
  'cursor-pointer rounded-lg px-3 py-2 text-sm text-fg data-[selected=true]:bg-accent data-[selected=true]:text-bg';
const groupClass = '[&_[cmdk-group-heading]]:label [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-muted';

export function CommandPalette({ index, onClose }: { index: SiteIndex; onClose: () => void }) {
  const router = useRouter();

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function run(action: () => void) {
    onClose();
    action();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid items-start justify-items-center bg-black/50 p-4 pt-[15vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-xl">
        <Command
          label="Command palette"
          className="overflow-hidden rounded-xl border border-line bg-surface text-fg shadow-2xl"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              onClose();
            }
          }}
        >
          <Command.Input
            autoFocus
            placeholder="Search pages, case studies and actions"
            className="w-full border-b border-line bg-transparent px-4 py-3 text-fg outline-none placeholder:text-muted"
          />
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted">No results.</Command.Empty>
            <Command.Group heading="Pages" className={groupClass}>
              <Command.Item value="Home" onSelect={() => go('/')} className={itemClass}>
                Home
              </Command.Item>
              {index.nav.map((item) => (
                <Command.Item key={item.href} value={item.label} onSelect={() => go(item.href)} className={itemClass}>
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
            {index.caseStudies.length > 0 && (
              <Command.Group heading="Case studies" className={groupClass}>
                {index.caseStudies.map((study) => (
                  <Command.Item
                    key={study.slug}
                    value={`${study.title} ${study.slug}`}
                    onSelect={() => go(`/work/${study.slug}`)}
                    className={itemClass}
                  >
                    {study.title}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            {index.posts.length > 0 && (
              <Command.Group heading="Notes" className={groupClass}>
                {index.posts.map((post) => (
                  <Command.Item key={post.slug} value={`${post.title} ${post.slug}`} onSelect={() => go(`/blog/${post.slug}`)} className={itemClass}>
                    {post.title}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            <Command.Group heading="Actions" className={groupClass}>
              <Command.Item value="Open terminal" onSelect={() => run(openTerminal)} className={itemClass}>
                Open terminal
              </Command.Item>
              <Command.Item
                value="Toggle theme dark light"
                onSelect={() => run(() => toast(`Switched to ${toggleDocumentTheme()} theme`))}
                className={itemClass}
              >
                Toggle theme
              </Command.Item>
              <Command.Item
                value="Copy email"
                onSelect={() =>
                  run(() => {
                    void copyText(index.email).then((ok) => toast(ok ? 'Email copied' : "Couldn't copy email", ok ? 'info' : 'error'));
                  })
                }
                className={itemClass}
              >
                Copy email
              </Command.Item>
              <Command.Item value="Download CV" onSelect={() => run(() => window.location.assign(index.cvHref))} className={itemClass}>
                Download CV
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run tests/unit/command-palette.test.tsx tests/unit/interactive.test.tsx`
Expected: all passed.

- [ ] **Step 5: Check in the browser**

Run: `npm run dev`. Expected: `Ctrl+K` opens the palette; typing "tris" and Enter opens the TRIS case study; "Toggle theme" switches theme with a toast; Esc closes. Stop the server.

- [ ] **Step 6: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "feat: add Ctrl+K command palette

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 23: End-to-end and accessibility tests

**Files:**
- Create: `tests/e2e/smoke.spec.ts`, `tests/e2e/hero.spec.ts`, `tests/e2e/interactive.spec.ts`, `tests/e2e/contact.spec.ts`, `tests/e2e/a11y.spec.ts`

- [ ] **Step 1: Create `tests/e2e/smoke.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

const routes = ['/', '/work', '/work/practice-manager', '/work/edenred-benefits-portal', '/work/tris', '/experience', '/contact'];

for (const route of routes) {
  test(`${route} loads with one h1`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('unknown routes show the 404 page', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /coffee break/i })).toBeVisible();
});

test('empty sections stay hidden in production', async ({ page }) => {
  expect((await page.goto('/projects'))?.status()).toBe(404);
  expect((await page.goto('/blog'))?.status()).toBe(404);
});

test('CV, RSS, sitemap and robots are served', async ({ request }) => {
  const cv = await request.get('/cv.pdf');
  expect(cv.status()).toBe(200);
  expect(cv.headers()['content-type']).toContain('pdf');
  expect((await request.get('/blog/rss.xml')).headers()['content-type']).toContain('xml');
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/work/practice-manager');
  expect(await (await request.get('/robots.txt')).text()).toContain('sitemap.xml');
});
```

- [ ] **Step 2: Create `tests/e2e/hero.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('cycles words by click and keyboard', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByRole('region', { name: /skills showcase/i });
  await expect(page.getByText(/^01 \//)).toBeVisible();
  await stage.click({ position: { x: 40, y: 140 } });
  await expect(page.getByText(/^02 \//)).toBeVisible();
  await stage.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(page.getByText(/^01 \//)).toBeVisible();
});

test('auto-advances when idle', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText(/^02 \//)).toBeVisible({ timeout: 6000 });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('does not auto-advance', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(5000);
    await expect(page.getByText(/^01 \//)).toBeVisible();
  });
});
```

- [ ] **Step 3: Create `tests/e2e/interactive.spec.ts`**

```ts
import { expect, test } from '@playwright/test';

test('terminal opens with backtick and navigates', async ({ page }) => {
  await page.goto('/experience');
  await page.keyboard.press('Backquote');
  const input = page.getByRole('textbox', { name: 'Terminal command' });
  await expect(input).toBeFocused();
  await input.fill('help');
  await input.press('Enter');
  await expect(page.getByText('Available commands:')).toBeVisible();
  await input.fill('contact');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/contact$/);
});

test('command palette navigates with Ctrl+K', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
  await page.keyboard.type('Experience');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/experience$/);
});

test('theme choice persists across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  // header and hero both have a toggle; use the header one
  await page.getByRole('banner').getByRole('button', { name: 'Toggle colour theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
```

- [ ] **Step 4: Create `tests/e2e/contact.spec.ts`**

```ts
import { expect, test, type Page } from '@playwright/test';

async function fill(page: Page, email: string) {
  await page.getByRole('textbox', { name: 'Name' }).fill('Test Recruiter');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Message' }).fill('We would like to talk about a full-stack role.');
  await page.waitForTimeout(3200);
  await page.getByRole('button', { name: 'Send message' }).click();
}

test('validates before sending', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Enter your name')).toBeVisible();
});

test('sends a message and clears the form', async ({ page }) => {
  await page.goto('/contact');
  await fill(page, 'recruiter@example.com');
  await expect(page.getByText('Thanks, your message is on its way.')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('');
});

test('shows an error with a mailto fallback when sending fails', async ({ page }) => {
  await page.goto('/contact');
  await fill(page, 'recruiter@fail.test');
  const alert = page.getByRole('alert');
  await expect(alert).toContainText("couldn't be sent");
  await expect(alert.getByRole('link')).toHaveAttribute('href', /^mailto:/);
});
```

- [ ] **Step 5: Create `tests/e2e/a11y.spec.ts`**

```ts
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/work', '/work/practice-manager', '/experience', '/contact', '/does-not-exist'];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`${route} has no axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // the giant hero word is decorative and aria-hidden
        .exclude('[data-decorative]')
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
```

- [ ] **Step 6: Run the end-to-end suite**

Run: `npm run test:e2e`
Expected: all tests pass (desktop project runs everything; mobile project runs the smoke spec). If an axe violation appears, fix the component (contrast, label, landmark), not the test.

- [ ] **Step 7: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "test: add end-to-end and accessibility suites

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 24: CI, Lighthouse budget, README and env template

**Files:**
- Create: `.github/workflows/ci.yml`, `lighthouserc.json`, `.env.example`, `README.md`

- [ ] **Step 1: Create `lighthouserc.json`**

```json
{
  "ci": {
    "collect": {
      "startServerCommand": "npm run start -- -p 3200",
      "startServerReadyPattern": "Ready",
      "url": [
        "http://localhost:3200/",
        "http://localhost:3200/work",
        "http://localhost:3200/work/practice-manager",
        "http://localhost:3200/experience",
        "http://localhost:3200/contact"
      ],
      "numberOfRuns": 1
    },
    "assert": {
      "assertions": {
        "categories:performance": ["error", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["error", { "minScore": 0.95 }],
        "categories:seo": ["error", { "minScore": 0.95 }]
      }
    },
    "upload": { "target": "filesystem", "outputDir": ".lighthouseci" }
  }
}
```

- [ ] **Step 2: Create `.github/workflows/ci.yml`**

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
      - run: npm run lhci
      - if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: reports
          path: |
            playwright-report
            .lighthouseci
```

- [ ] **Step 3: Create `.env.example`**

```bash
# Public URL used for canonical links, sitemap and OG images
NEXT_PUBLIC_SITE_URL=https://my-portfolio-nine-khaki-46.vercel.app

# Contact form (Resend). Set these in Vercel → Project → Settings → Environment Variables
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=Portfolio <onboarding@resend.dev>

# Local and CI only: "log" prints messages instead of emailing (emails ending @fail.test simulate a failure)
CONTACT_TRANSPORT=

# Set to 1 to fail the build on any [fill-in] marker. Vercel production builds do this automatically.
CONTENT_STRICT=
```

- [ ] **Step 4: Create `README.md`**

````markdown
# Angad Kumar — Portfolio

Personal site of a full-stack engineer (.NET + TypeScript). Static-first Next.js with a typographic hero, an in-page terminal and a `Ctrl+K` command palette.

## Stack

Next.js (App Router, React Server Components) · TypeScript (strict) · Tailwind CSS v4 · MDX content validated with zod · Resend (contact form) · Vitest + Testing Library · Playwright + axe · Lighthouse CI · GitHub Actions · Vercel

## Run it

```bash
npm install
cp .env.example .env.local   # set CONTACT_TRANSPORT=log for local testing
npm run dev
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (draft posts and `[fill-in]` markers visible) |
| `npm run build` / `npm start` | Production build / serve |
| `npm test` | Unit and component tests (Vitest) |
| `npm run test:e2e` | End-to-end + accessibility tests (Playwright, builds first) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run lhci` | Lighthouse budget against a running production build |

## Editing content

- **Case studies:** `src/content/case-studies/*.mdx`. Frontmatter is validated by `src/lib/schemas.ts`; a missing field fails the build with the file and field name.
- **Blog:** `src/content/blog/*.mdx`. `draft: true` hides a post in production.
- **Demo projects:** `src/content/projects/*.mdx`. Only `status: live` projects appear; the Projects page and nav link stay hidden until one exists.
- **Profile, experience, skills, testimonials:** `src/data/*.ts`. Testimonials appear once there are two real ones.
- **Unfinished facts:** write `[fill-in: what is missing]`. Dev shows it; production (`VERCEL_ENV=production` or `CONTENT_STRICT=1`) refuses to build until every marker is replaced.

## Architecture

- Every route is statically generated from repo content. Client components are limited to the hero stage, theme toggle, mobile menu, terminal, command palette, toaster, nav progress and contact form.
- The terminal and command palette are lazy-loaded and talk to the rest of the page through window events (`src/lib/events.ts`).
- The contact form validates on the client, then a server action re-validates, checks a honeypot and minimum fill time, and sends through Resend. Failures show an error with a `mailto:` fallback.
- Theme follows the system setting until the visitor picks one; an inline head script applies the choice before first paint.

## Quality gates (CI)

Lint → typecheck → unit tests → build → Playwright (+ axe in light and dark) → Lighthouse (performance ≥ 90; accessibility, best practices, SEO ≥ 95).
````

- [ ] **Step 5: Run the Lighthouse budget locally**

```bash
npm run build
npm run lhci
```
Expected: all assertions pass. If performance is below 0.9, check the report in `.lighthouseci/` (usually image size or render-blocking work) and fix the cause.

- [ ] **Step 6: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "ci: add GitHub Actions pipeline, Lighthouse budget, README and env template

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

---

### Task 25: Final verification

**Files:**
- Modify: `docs/superpowers/specs/2026-11-24-portfolio-redesign-design.md` (add the `--danger` token row)

- [ ] **Step 1: Run every gate in order**

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run test:e2e
npm run lhci
```
Expected: each command exits 0. Note any failure with its output; fix and re-run before continuing.

- [ ] **Step 2: Prove the fill-in guard blocks production**

```bash
CONTENT_STRICT=1 npm run build
```
Expected: build FAILS with `Unfinished content in …` naming the files and fields still holding `[fill-in]` markers. This is the list Angad must answer before the first production deploy. Then rebuild normally: `npm run build`.

- [ ] **Step 3: Manual review in the browser (light, dark, mobile width)**

Run: `npm run build && npm run start`. Check:
- Hero: word + prop cycle by click, arrows and auto-advance; cursor ring; parallax; "APIs" prop opens the terminal.
- No Japanese text, no manga styling, no pink/beige palette anywhere.
- No date of birth, phone number, Instagram or Facebook anywhere on the site.
- `/work/practice-manager` is case study 01; Finetica appears nowhere.
- Keyboard only: Tab through header, hero, cards, footer; visible focus everywhere.

- [ ] **Step 4: Add the danger token to the spec**

In `docs/superpowers/specs/2026-11-24-portfolio-redesign-design.md` §5.1, add this row after `--success`:

```markdown
| `--danger` | `#b91c1c` | `#f87171` | Form errors, error toasts |
```

- [ ] **Step 5: Commit**

```bash
git add -A
git reset -q .claude
git commit -m "docs: record danger token and finish verification

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
```

- [ ] **Step 6: Report**

Summarise: gates passed (with numbers from Lighthouse), the `CONTENT_STRICT` fill-in list, and anything skipped. Do not push or open a PR without asking.

