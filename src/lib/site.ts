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
