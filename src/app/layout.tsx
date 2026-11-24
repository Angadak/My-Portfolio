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
