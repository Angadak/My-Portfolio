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
