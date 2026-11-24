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
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  );
}
