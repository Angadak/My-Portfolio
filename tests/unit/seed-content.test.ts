import { describe, expect, it } from 'vitest';
import { getCaseStudies, getPosts } from '@/lib/content';

describe('seed content', () => {
  it('has five case studies in the agreed order, three featured', () => {
    const studies = getCaseStudies();
    expect(studies.map((s) => s.slug)).toEqual([
      'practice-manager',
      'edenred-benefits-portal',
      'tris',
      'cwecs',
      'moowr-reconciliation',
    ]);
    expect(studies.filter((s) => s.featured).map((s) => s.slug)).toEqual([
      'practice-manager',
      'edenred-benefits-portal',
      'tris',
    ]);
  });

  it('does not include Finetica', () => {
    expect(getCaseStudies().some((s) => /finetica/i.test(s.title + s.body))).toBe(false);
  });

  it('ships blog posts as drafts until reviewed', () => {
    expect(getPosts(undefined, { includeDrafts: false })).toEqual([]);
    expect(getPosts(undefined, { includeDrafts: true })).toHaveLength(2);
  });
});
