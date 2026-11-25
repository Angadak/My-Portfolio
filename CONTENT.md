# Updating your content

Everything on the site — profile, CV, jobs, skills, numbers, case studies, blog, hero words and section titles — is edited in the **admin panel**. You never need to touch code.

## Password (required)

The admin is password-protected everywhere. Until a password is set it stays locked.

- Add to `.env.local` (never commit this file): `ADMIN_PASSWORD=` followed by a long password of 12+ characters.
- Sign in at `/admin-login`. You stay signed in for 12 hours; **Sign out** is bottom-right in the panel.
- After 5 wrong passwords an address is locked out for 15 minutes.
- Changing `ADMIN_PASSWORD` signs out every open session.

## Edit on your computer

1. Run the site: `npm run dev`
2. Open **http://localhost:3000/keystatic** and sign in with your password
3. Pick what to change, edit, press **Save**. The site updates straight away.
4. When you are happy, commit and push the changed files (they are in `src/content/` and `public/`). Vercel redeploys on its own.

## What is in the panel

| Section | What you edit |
|---|---|
| **Profile and CV** | Name, headline, location, availability, email, GitHub, LinkedIn, career start month, **CV PDF upload** |
| **Jobs and education** | Jobs (newest first) with start/end month and highlights, education, certifications, small projects |
| **Skills** | Each skill, its group, the year you started using it, where you used it |
| **Testimonials** | Real quotes only. The section shows on the home page at 2 or more |
| **Hero and page text** | Search/social description, hero words (word, picture, caption), home section titles, contact texts |
| **Case studies** | Title, summary, client, role, team size, period, stack, **metrics**, show-on-home, order, private notes, the story |
| **Projects** | Title, status, links, stack, details |
| **Blog posts** | Title, date, summary, tags, draft switch, the post |

**Worked out for you** (never type these): years of experience, job durations, "Clubs / On the pitch / Countries" stats, skill years and bars, the season bar.

Tips:
- Months are written `2024-12`. Leave a job's **End** empty while you still work there.
- In a hero caption, `{years}` becomes your years of experience (e.g. "4.5+ years").
- Case study **metrics**: use real numbers only. The first three show on cards.
- **Private notes** on case studies are reminders for you and never appear on the site.
- To replace your CV, upload the new PDF in **Profile and CV** → Save. Every "Download CV" button uses it.

## Edit on the live site (one-time setup, optional)

This lets you edit from any browser at `https://your-site/keystatic`, log in with GitHub, and have every Save publish automatically.

1. In `.env.local` add: `NEXT_PUBLIC_KEYSTATIC_STORAGE=github`
2. Run `npm run dev`, open http://localhost:3000/keystatic and follow **Create GitHub App**. Keystatic adds four values to `.env.local`:
   `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG`
3. In the GitHub App settings add the live callback URL: `https://your-site/api/keystatic/github/oauth/callback`
4. In Vercel → Project → Settings → Environment Variables, add those four values plus `NEXT_PUBLIC_KEYSTATIC_STORAGE=github` and `ADMIN_PASSWORD` (use a different, strong password from your local one), then redeploy.
5. Open `https://your-site/keystatic`, sign in with your admin password, then with GitHub. Edit, Save. Each Save is a commit; Vercel redeploys in about a minute.

Two locks protect the live panel: your admin password, then a GitHub login with write access to the repo. Without step 4 the admin panel does not exist on the live site at all (it returns "not found").

To go back to editing local files, remove `NEXT_PUBLIC_KEYSTATIC_STORAGE` from `.env.local`.
