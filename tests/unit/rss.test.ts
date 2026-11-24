import { describe, expect, it } from 'vitest';
import { buildRss, escapeXml } from '@/lib/rss';
import { articleJsonLd } from '@/lib/seo';
import type { Post } from '@/lib/content';

const post: Post = {
  slug: 'tokens',
  body: '',
  title: 'Tokens & tabs <part 1>',
  date: new Date('2026-11-01T00:00:00Z'),
  summary: 'Refresh "once".',
  tags: ['auth'],
  draft: false,
};

describe('escapeXml', () => {
  it('escapes the five XML entities', () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;');
  });
});

describe('buildRss', () => {
  it('builds a valid channel with escaped items', () => {
    const xml = buildRss([post], 'https://example.dev');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<link>https://example.dev/blog/tokens</link>');
    expect(xml).toContain('<title>Tokens &amp; tabs &lt;part 1&gt;</title>');
    expect(xml).toContain('<pubDate>Sun, 01 Nov 2026 00:00:00 GMT</pubDate>');
  });
});

describe('articleJsonLd', () => {
  it('describes a blog post', () => {
    const data = articleJsonLd(post);
    expect(data['@type']).toBe('BlogPosting');
    expect(data.headline).toBe(post.title);
    expect(data.datePublished).toBe('2026-11-01T00:00:00.000Z');
  });
});
