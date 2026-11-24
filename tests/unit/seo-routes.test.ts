import { describe, expect, it } from 'vitest';
import sitemap from '@/app/sitemap';
import robots from '@/app/robots';
import { SITE_URL } from '@/lib/site';

describe('sitemap', () => {
  it('lists core pages and every case study, but not empty sections', () => {
    const urls = sitemap().map((entry) => entry.url);
    expect(urls).toContain(`${SITE_URL}/`);
    expect(urls).toContain(`${SITE_URL}/work/practice-manager`);
    expect(urls).toContain(`${SITE_URL}/experience`);
    expect(urls).not.toContain(`${SITE_URL}/projects`);
  });
});

describe('robots', () => {
  it('allows crawling and points at the sitemap', () => {
    const result = robots();
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
