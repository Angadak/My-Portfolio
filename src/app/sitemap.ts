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
