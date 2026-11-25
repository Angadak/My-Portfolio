import type { Metadata } from 'next';
import { Dela_Gothic_One, Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { themeInitScript } from '@/lib/theme';
import { SITE_URL, buildNav, type SiteIndex } from '@/lib/site';
import { getCaseStudies, getPosts, getProjects } from '@/lib/content';
import { formatYears, yearsOfExperience } from '@/lib/experience';
import { groupSkills } from '@/lib/skills';
import { profile } from '@/data/profile';
import { skills } from '@/data/skills';
import { siteCopy } from '@/data/site';
import { SiteTopBar } from '@/components/layout/site-top-bar';
import { SiteMenu } from '@/components/layout/site-menu';
import { BackLink } from '@/components/layout/back-link';
import { TerminalLauncher } from '@/components/layout/terminal-launcher';
import { Footer } from '@/components/layout/footer';
import { InteractiveLayer } from '@/components/interactive/interactive-layer';
import { Toaster } from '@/components/motion/toaster';
import { NavProgress } from '@/components/motion/nav-progress';
import { SpeedField } from '@/components/motion/speed-field';
import { PageWipe } from '@/components/motion/page-wipe';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono', display: 'swap' });
const display = Dela_Gothic_One({ subsets: ['latin'], weight: '400', variable: '--font-dela', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.headline}`,
    template: `%s · ${profile.name}`,
  },
  description: siteCopy.seoDescription,
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: profile.name, locale: 'en' },
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
    cvHref: profile.cv,
    whoami: `${profile.name} · ${profile.headline} · ${years}`,
    status: `● ${profile.availability} · ${profile.location}`,
    skills: groupSkills(skills).map((g) => `${g.label.padEnd(16)}${g.skills.map((s) => s.name).join(', ')}`),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const index = buildSiteIndex();
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-dvh flex-col text-fg antialiased">
        <SpeedField />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[80] focus:border-[3px] focus:border-ink focus:bg-accent focus:text-on-accent focus:px-4 focus:py-2 focus:font-bold"
        >
          Skip to content
        </a>
        <SiteTopBar name={profile.name} />
        <SiteMenu nav={index.nav} github={profile.github} linkedin={profile.linkedin} email={profile.email} />
        <BackLink />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <TerminalLauncher />
        <InteractiveLayer index={index} />
        <Toaster />
        <NavProgress />
        <PageWipe />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
