import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { getCaseStudies, getPosts, loadCollection } from '@/lib/content';
import { caseStudySchema } from '@/lib/schemas';

const fixtures = path.join(process.cwd(), 'tests', 'fixtures', 'content');

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('loadCollection', () => {
  it('returns [] for a missing folder', () => {
    expect(loadCollection(path.join(fixtures, 'nope'), caseStudySchema)).toEqual([]);
  });

  it('throws with file and field on invalid frontmatter', () => {
    expect(() => loadCollection(path.join(fixtures, 'invalid'), caseStudySchema)).toThrow(/broken\.mdx[\s\S]*client/);
  });

  it('allows fill-in markers when not strict', () => {
    const [entry] = loadCollection(path.join(fixtures, 'unfinished'), caseStudySchema);
    expect(entry.teamSize).toContain('[fill-in');
  });

  it('rejects fill-in markers in strict mode', () => {
    vi.stubEnv('CONTENT_STRICT', '1');
    expect(() => loadCollection(path.join(fixtures, 'unfinished'), caseStudySchema)).toThrow(/Unfinished content.*teamSize/);
  });
});

describe('getCaseStudies', () => {
  it('sorts by order and adds slug + body', () => {
    const studies = getCaseStudies(path.join(fixtures, 'case-studies'));
    expect(studies.map((s) => s.slug)).toEqual(['beta', 'alpha']);
    expect(studies[1].metrics).toEqual([{ value: '10k', label: 'users' }]);
    expect(studies[0].featured).toBe(false);
    expect(studies[1].body).toContain('Alpha body.');
  });
});

describe('getPosts', () => {
  const dir = path.join(fixtures, 'blog');

  it('hides drafts when asked and sorts newest first', () => {
    expect(getPosts(dir, { includeDrafts: false }).map((p) => p.slug)).toEqual(['published']);
    expect(getPosts(dir, { includeDrafts: true }).map((p) => p.slug)).toEqual(['draft', 'published']);
  });

  it('parses dates', () => {
    expect(getPosts(dir, { includeDrafts: false })[0].date).toBeInstanceOf(Date);
  });
});
