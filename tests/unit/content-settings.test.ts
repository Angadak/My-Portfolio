import { describe, expect, it } from 'vitest';
import { adminEnabled } from '@/lib/admin';
import { heroWords } from '@/lib/hero';
import { experienceSchema, profileSchema, siteCopySchema } from '@/lib/schemas';
import { profile } from '@/data/profile';
import { siteCopy } from '@/data/site';
import siteJson from '@/content/settings/site.json';

describe('admin panel access', () => {
  it('is on in development and on the live site only in GitHub mode', () => {
    expect(adminEnabled({ NODE_ENV: 'development' })).toBe(true);
    expect(adminEnabled({ NODE_ENV: 'production' })).toBe(false);
    expect(adminEnabled({ NODE_ENV: 'production', NEXT_PUBLIC_KEYSTATIC_STORAGE: 'github' })).toBe(true);
  });
});

describe('content files saved by the admin panel', () => {
  it('treat an empty job end as "still working here"', () => {
    const role = experienceSchema.parse({ company: 'A', role: 'B', location: 'C', start: '2024-01', end: '', highlights: ['x'] });
    expect(role.end).toBeUndefined();
  });

  it('fall back to /cv.pdf when no CV is uploaded', () => {
    const base = { ...profile };
    expect(profileSchema.parse({ ...base, cv: '' }).cv).toBe('/cv.pdf');
    expect(profileSchema.parse({ ...base, cv: '/cv.pdf' }).cv).toBe('/cv.pdf');
  });

  it('site text drives the hero words and fills in {years}', () => {
    expect(siteCopySchema.parse(siteJson).heroWords.length).toBeGreaterThan(0);
    const words = heroWords('4.5+ years', siteCopy.heroWords);
    expect(words.every((w) => !w.caption.includes('{years}'))).toBe(true);
    expect(heroWords('3+ years', [{ word: 'X', prop: 'mug', caption: '{years} shipping' }])[0].caption).toBe('3+ years shipping');
  });
});
