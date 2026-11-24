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
