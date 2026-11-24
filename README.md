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
| `npm run lhci` | Lighthouse budget; run `npm run build` first (it starts its own server) |

## Editing content

- **Case studies:** `src/content/case-studies/*.mdx`. Frontmatter is validated by `src/lib/schemas.ts`; a missing field fails the build with the file and field name.
- **Blog:** `src/content/blog/*.mdx`. `draft: true` hides a post in production.
- **Demo projects:** create `src/content/projects/` and add `*.mdx` files when adding the first demo (the folder does not exist yet). Only `status: live` projects appear; the Projects page and nav link stay hidden until one exists.
- **Profile, experience, skills, testimonials:** `src/data/*.ts`. Testimonials appear once there are two real ones.
- **Unfinished facts:** write `[fill-in: what is missing]`. Dev shows it; production (`VERCEL_ENV=production` or `CONTENT_STRICT=1`) refuses to build until every marker is replaced.

## Architecture

- Every route is statically generated from repo content. Client components are limited to the hero stage, theme toggle, mobile menu, terminal, command palette, toaster, nav progress and contact form.
- The terminal and command palette are lazy-loaded and talk to the rest of the page through window events (`src/lib/events.ts`).
- The contact form validates on the client, then a server action re-validates, checks a honeypot and minimum fill time, and sends through Resend. Failures show an error with a `mailto:` fallback.
- Theme follows the system setting until the visitor picks one; an inline head script applies the choice before first paint.

## Launch checklist

- Replace every `[fill-in]`. Find them with `grep -rn "\[fill-in" src/` (a strict build, `CONTENT_STRICT=1 npm run build`, stops at the first file that still has one). Vercel production builds enforce this.
- Replace `public/cv.pdf` with the updated CV: fix "AEPartnres", add TypeScript/Svelte, remove Finetica, and decide whether to include a phone number.
- Set `RESEND_API_KEY` and `CONTACT_TO_EMAIL` in Vercel. Verify a sending domain and set `CONTACT_FROM_EMAIL` (the default `onboarding@resend.dev` only delivers to the Resend account owner).
- In Vercel: use Node.js 20.9+ (22 recommended), enable Web Analytics, and keep deployment protection on previews (they show `[fill-in]` text).
- Set `NEXT_PUBLIC_SITE_URL` when a custom domain is added.
- Optional before launch: architecture diagrams for case studies (spec section 4.3). They are not built yet; the `## Architecture` sections are text.

## Quality gates (CI)

Lint → typecheck → unit tests → build → Playwright (+ axe in light and dark) → Lighthouse (performance ≥ 90; accessibility, best practices, SEO ≥ 95).
