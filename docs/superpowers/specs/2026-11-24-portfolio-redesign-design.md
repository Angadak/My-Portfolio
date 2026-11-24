# Portfolio Redesign — Design Spec

- **Date:** 2026-11-24
- **Owner:** Angad Kumar
- **Status:** Draft for review
- **Sub-project:** 1 of 4 (portfolio site). Demo apps 1–3 get their own specs later.

---

## 1. Goal and success criteria

Rebuild the portfolio so it wins interviews for **full-stack engineer (.NET + TypeScript)** roles in a **global, remote-first** market. The current site (Next.js 14 template, last touched Feb 2024) shows 1.5 years of experience, 3 projects, placeholder text, broken links and personal data. It undersells ~4.5 years of real work.

The site is done when:

1. A recruiter understands **who, what role, how senior, and available** within 10 seconds of landing.
2. Every claim links to proof: a case study, a demo, or the CV.
3. Lighthouse (mobile, production build): Performance ≥ 90, Accessibility / Best Practices / SEO ≥ 95.
4. Contact form delivers email, CV downloads, no dead links, no placeholder copy.
5. No personal data beyond email, LinkedIn, GitHub and a city/country line.
6. Repo itself is clean enough to be judged: TypeScript strict, tests, CI, real README.

## 2. Decisions (locked during brainstorming)

| Topic | Decision |
|---|---|
| Market | Global, remote-first |
| Positioning | Full-Stack Engineer — .NET + TypeScript |
| Proof | Written case studies (NDA-safe) + 2–3 open-source demo apps (separate sub-projects) |
| Site stack | Fresh rebuild, latest stable Next.js App Router + TypeScript + Tailwind CSS v4 |
| Content storage | In repo: MDX + typed data files, validated at build time (gray-matter + zod, rendered with `@mdx-js/mdx`) |
| Hosting | Vercel; contact via server action + Resend |
| Hero | Sanjoo-style: giant embossed skill word + original illustrated prop object, click to cycle |
| Visual tone | Minimal, typographic, professional. Neutral surfaces + one violet accent |
| Rejected looks | Manga / comic style, Japanese text, paper-beige + pink palette, speech bubbles, SFX stamps |
| Theme | Light + dark, default follows system setting, manual toggle persisted |
| Extras | Technical blog (MDX) and testimonials. No AI chat, no live GitHub stats |
| Copy | Claude drafts from CV; Angad supplies facts via a question list |

## 3. Scope

**In scope (this spec):** the portfolio site, all its pages and content, cleanup of the old code, CV PDF update.

**Out of scope (own specs later):**
- Demo app 1–3 (each: .NET API + TypeScript frontend, tests, CI, deployed). The site gets an empty, hidden slot for them.
- Custom domain purchase (recommended, see §10).

## 4. Information architecture

### 4.1 Routes

| Route | Purpose |
|---|---|
| `/` | Home: typographic hero + proof summary |
| `/work` | Case study index |
| `/work/[slug]` | Case study page |
| `/projects` | Demo project index (hidden from nav until ≥ 1 project is `live`) |
| `/projects/[slug]` | Demo project page |
| `/experience` | Timeline, skills sheet, education, certification |
| `/blog`, `/blog/[slug]` | Technical posts; RSS at `/blog/rss.xml` |
| `/contact` | Form + email + LinkedIn + GitHub |
| `/cv.pdf` | Static CV file |
| `not-found` | Custom 404 with a prop and a link home |

### 4.2 Home page order

1. Header: name (left), menu (right), theme toggle.
2. **Hero** (see §5.3).
3. Featured case studies (3 cards).
4. Demo projects (only when ≥ 1 is `live`).
5. Experience snapshot (4 roles, one line each, link to `/experience`).
6. Testimonials (only when ≥ 2 exist).
7. Latest blog posts (only when ≥ 1 published post exists).
8. Contact call-to-action + footer.

**Rule:** sections with no real content are not rendered. No "coming soon" boxes.

### 4.3 Case study page template

1. Summary bar: role, team size, period, stack chips.
2. Problem.
3. What I built and my part in it.
4. Architecture diagram (inline SVG drawn for the site, no client screenshots).
5. Three hard challenges and how they were solved.
6. Results (metric blocks).
7. Link to next case study.

## 5. Visual design system

### 5.1 Colour tokens

Defined as CSS custom properties on `:root`, overridden under `[data-theme="dark"]` and `prefers-color-scheme: dark` (when no explicit choice). Exposed to Tailwind v4 via `@theme`.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--bg` | `#f3f3f1` | `#0d0d10` | Page background |
| `--surface` | `#ffffff` | `#17171c` | Cards, panels |
| `--text` | `#111114` | `#ededf0` | Body and headings |
| `--muted` | `#6b6b73` | `#8a8a93` | Captions, meta |
| `--line` | `#dcdcd8` | `#24242b` | Borders, dividers |
| `--accent` | `#6d28d9` | `#a78bfa` | Links, CTA, focus, selection, prop highlights |
| `--success` | `#15803d` | `#3fb950` | "Open to work" status, terminal OK output |
| `--word` | `#ffffff` | `#17171c` | Hero word fill |
| `--word-edge` | `#dcdcd8` | `#24242b` | Hero word emboss layers |

All text/background pairs must pass WCAG AA (4.5:1 body, 3:1 large text). Verified in tests (§7.4).

### 5.2 Typography

| Role | Font | Notes |
|---|---|---|
| Hero word, section words | Geist, weight 900 | `clamp()` sizing, tight tracking (`-0.03em`) |
| Body, UI | Geist 400 / 500 | 16–18px body, line length ≤ 72ch on long-form pages |
| Labels, terminal, code | Geist Mono | Uppercase labels with `0.1em` tracking (e.g. `01 / CASE STUDY`) |

Loaded with `next/font` (self-hosted, Latin subset only).

### 5.3 Hero (Sanjoo-style word + prop)

- Full-viewport stage on `--bg`. Minimal chrome: name top-left, menu top-right, vertical social icons (GitHub, LinkedIn, email) on the right edge, round accent theme-toggle button bottom-right.
- **Giant word** centred, embossed (stacked `text-shadow` using `--word-edge`, soft drop shadow). Words cycle in order:

| # | Word | Prop | Caption |
|---|---|---|---|
| 01 | BACKEND | Database cylinder | C# · ASP.NET Core · EF Core · SQL Server |
| 02 | FRONTEND | Browser window | TypeScript · Svelte 5 · React |
| 03 | APIs | Terminal card (`GET /me → 200 OK`) | REST · auth · integrations |
| 04 | CLOUD | Cloud with check mark | Azure · Docker · CI/CD |
| 05 | SHIPPING | Coffee mug with `C#` | Years of production work (computed) |

- **Prop** sits over the word, slightly rotated. Props are original inline SVG React components using theme tokens (no stock images, no copyrighted characters).
- **Bottom-left text block** holds the real `<h1>`: "Angad Kumar — Full-stack engineer (.NET + TypeScript)" plus availability line. The giant word is `aria-hidden`; its caption is announced via a polite live region when it changes.
- **Interactions**
  - Click / tap stage or press `→` → next word. `←` → previous.
  - Auto-advance every 4 s; pauses on hover, focus, or when tab is hidden.
  - Mouse parallax: word and prop drift in opposite directions (max ~10px / ~22px).
  - Custom cursor ring on the stage only (desktop, fine pointer); grows over the prop. Native cursor elsewhere.
  - Clicking the **APIs** prop opens the terminal (§5.5).
- **Reduced motion:** no auto-advance, no parallax, no spring; instant swap.
- **Mobile / touch:** no custom cursor, no parallax, tap to cycle, word sized to fit width.

### 5.4 Rest of the site

- Section headings: smaller embossed word + small prop icon + mono label (`02 / CASE STUDIES`).
- Cards: `--surface`, 1px `--line` border, 12px radius, no heavy shadows. Hover: small lift + subtle tilt (≤ 4°), accent border.
- Long-form pages (case studies, blog): calm reading layout, max 72ch, Geist body, code blocks in Geist Mono with syntax highlighting (Shiki at build time).

### 5.5 Interactive layer

| Feature | Trigger | Detail |
|---|---|---|
| Terminal | `` ` `` key, APIs prop, menu item | Overlay panel. Commands: `help`, `whoami`, `skills`, `work`, `blog`, `contact`, `cv`, `status`, `clear`, `sudo hire-me`. Tab-completion, ↑/↓ history, `Esc` closes. Navigation commands route with Next.js router. Unknown command → friendly hint. Lazy-loaded. |
| Command palette | `Ctrl/⌘ + K`, menu item | Search pages, case studies, posts; actions: toggle theme, copy email, download CV. Lazy-loaded (`cmdk`). |
| Navigation progress | Route change | Thin accent bar at top. |
| Toasts | Copy email, form result | Short, auto-dismiss, screen-reader announced. |

All of it is optional: every page and fact is reachable through the normal menu and links.

### 5.6 Motion

- No animation library. Small hand-written components inspired by the user's Manga UI Kit: `Reveal`, `TiltCard`, `Magnetic`, `NavProgress`, `Toaster`. Nothing else from that kit (no theme, fonts, textures).
- Only `transform` and `opacity` animate. Above-the-fold content renders without waiting for JS (CSS keyframes, not JS `opacity: 0` entrances).
- No `backdrop-filter` on sticky elements. No smooth-scroll hijacking.
- `prefers-reduced-motion` disables all non-essential motion globally.

## 6. Architecture

### 6.1 Stack

Next.js (latest stable, App Router, React Server Components), TypeScript strict, Tailwind CSS v4, `@mdx-js/mdx` + gray-matter + zod (content), `cmdk`, Resend, Shiki, Vercel Web Analytics. Package manager: npm.

Rebuilt in the existing repo on a feature branch. Old code removed entirely; git history and the Vercel project are kept.

### 6.2 Folder layout

```
src/
  app/
    (site)/            page routes from §4.1
    api/og/            dynamic OG images (next/og)
    sitemap.ts  robots.ts  layout.tsx  not-found.tsx
  components/
    hero/              stage, word, cursor, cycle logic
    props/             SVG prop components (Database, Browser, ApiCard, Cloud, Mug, …)
    terminal/          overlay UI
    palette/           command palette
    sections/          home sections
    mdx/               Callout, Metric, Diagram, Figure
    motion/            adapted kit components
    ui/                Button, Card, Chip, ThemeToggle
  content/
    case-studies/*.mdx
    projects/*.mdx
    blog/*.mdx
  data/                profile.ts, experience.ts, skills.ts, testimonials.ts
  lib/
    schemas.ts         zod schemas shared by Velite and data files
    experience.ts      years-of-experience calculation
    terminal/          command parser + command registry (pure, testable)
    contact.ts         server action
public/
  cv.pdf
tests/
  unit/  e2e/
```

### 6.3 Content models

| Model | Fields | Rules |
|---|---|---|
| Profile | name, headline, location, availability, email, socials, careerStart (`2022-04`) | Years of experience computed from `careerStart`, never hard-coded |
| CaseStudy | slug, title, client (name or anonymised label), domain, role, teamSize, period, stack[], summary, metrics[{value,label}], featured, order | Build fails on missing required field |
| Project | slug, title, status (`live` \| `building`), repoUrl, liveUrl, stack[], summary | Only `live` rendered |
| BlogPost | slug, title, date, summary, tags[], draft | Drafts excluded from production build |
| Testimonial | quote, name, role, company, linkedinUrl | Section shown only when ≥ 2 |
| Experience | company, role, location, start, end?, highlights[] | Sorted newest first |

### 6.4 Data flow

Build time: MDX + data files → Velite (zod validation) → typed objects → Server Components → static HTML for every route (`generateStaticParams`). Only client components: hero stage, theme toggle, mobile menu, terminal, command palette, contact form.

### 6.5 Contact form

- Fields: name, email, message (+ hidden honeypot). Client validation with zod.
- Server action re-validates, rejects honeypot hits and submissions faster than 3 s after render, then sends via Resend to `CONTACT_TO_EMAIL`.
- Success → toast + form reset. Failure → inline error + `mailto:` fallback link. Never a silent failure.
- Secrets in Vercel env vars only: `RESEND_API_KEY`, `CONTACT_TO_EMAIL`. `.env.example` committed without values.

### 6.6 Error handling

- Invalid content → build fails with the file and field name.
- Unknown routes → custom 404.
- Terminal and palette chunks fail to load → menu links still work (progressive enhancement).
- Theme preference read/write wrapped in try/catch; falls back to system setting.

## 7. Quality

### 7.1 SEO and sharing
Per-page metadata and canonical URLs; dynamic OG images per case study and post; `sitemap.xml`, `robots.txt`, RSS; JSON-LD `Person` (home) and `Article` (posts).

### 7.2 Performance
Targets in §1. Static pages, minimal client JS, lazy-load terminal and palette, `next/image` (AVIF/WebP), profile photo ≤ 150 KB, self-hosted fonts.

### 7.3 Accessibility
Landmarks, skip link, full keyboard support (hero, terminal, palette), visible focus rings, alt text, live region for hero caption, AA contrast both themes, reduced motion.

### 7.4 Tests
- **Unit (Vitest):** zod schemas, years-of-experience calculation, terminal command parser/registry, contact server action validation (Resend mocked), hero cycle logic.
- **E2E (Playwright):** every route returns 200; hero cycles by click and keyboard; terminal opens and runs `help` and `contact`; command palette navigates; theme toggle persists; contact form success and failure paths (Resend mocked); CV downloads; reduced-motion mode disables auto-advance.
- **Accessibility:** axe-core scan of every route in light and dark inside Playwright.

### 7.5 CI/CD
GitHub Actions on every PR: lint, typecheck, unit, build, e2e, Lighthouse CI budget (§1). Vercel preview per PR; production deploy on merge to `main`.

### 7.6 Analytics
Vercel Web Analytics (cookie-free, no consent banner).

## 8. Content plan

### 8.1 Case studies

| # | Case study | Featured | Notes |
|---|---|---|---|
| 01 | AEPartners practice manager (XPM-like; mix of Content Snare + Karbon) | ✅ | Client portal with document/info requests, job workflow and task management, email linked to clients and jobs. Stack per Angad's answers. |
| 02 | Edenred employee benefits admin portal | ✅ | Blazor, .NET Core, EF, Azure CI/CD; used by global clients |
| 03 | TRIS (Web API + dashboard, one story) | ✅ | Train tracking APIs, face-recognition login |
| 04 | CWECS (Advanced Hi-Tech + Reporting, one story) | | Government water/energy analytics and reporting |
| 05 | Moowr reconciliation platform | | Node/Express, customs duty reconciliation, invoice pipeline |

Finetica is **not** included. ClaimsToExcel appears as one line on `/experience`.

### 8.2 Other content
- **Experience:** AEPartners, TechUTD, AD Software Solutions, MRM/McCann — 2–3 result-focused bullets each.
- **Skills sheet:** groups (backend, frontend, cloud/devops, data, tools); each skill shows years used and where. No percentage bars.
- **Blog at launch:** 2 posts drafted by Claude, reviewed by Angad. Topics to be picked from real AEPartners/Edenred work (e.g. JWT refresh + multi-tab session sync; building a client document-request workflow).
- **Testimonials:** Angad requests 2–3 LinkedIn recommendations; hidden until ≥ 2.

### 8.3 Fact questionnaire (one per case study)
Team size · exact role · users / clients · data volume · performance or time gains · duration · hardest problem · stack confirmation · **permission to name the client publicly** (if no → anonymised label, e.g. "Australian accounting firm").

## 9. Cleanup and privacy

- Delete all old components, pages, unused images (fake review avatars, template art, 3 MB photos) and the template README.
- Remove date of birth, phone number, personal Instagram, dead Facebook link.
- Keep: email, LinkedIn, GitHub, contact form, location line.
- New CV PDF at `/cv.pdf`: fix "AEPartnres" typo, add TypeScript and Svelte to skills, replace Finetica entry consistent with §8.1 (Angad to confirm).
- New README: screenshot, stack, scripts, architecture notes, content-editing guide.

## 10. Open items (fill-ins, do not block the build)

| Item | Owner |
|---|---|
| Location line (e.g. "India · open to remote worldwide") | Angad |
| Correct LinkedIn URL (`/in/angad-kumar` vs `/in/angad-kumar-22173a175`) | Angad |
| Practice-manager stack and facts (§8.3) | Angad |
| Client-naming permission per case study | Angad |
| Custom domain (recommended, e.g. `angadkumar.dev`) | Angad |
| Resend account + verified sender | Angad |
| Profile photo (optional; neutral background) | Angad |

Placeholders render as `[fill-in: …]` only in local dev; production build fails if any remain.

## 11. Explicitly not doing

AI chat, live GitHub stats, CMS, own .NET backend for the site, manga/comic styling, Japanese text, smooth-scroll hijacking, skill percentage bars, fake or placeholder testimonials.
