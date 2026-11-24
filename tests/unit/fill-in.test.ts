import { describe, expect, it } from 'vitest';
import { findFillIns, guardFillIns, isStrictContent } from '@/lib/fill-in';

describe('findFillIns', () => {
  it('finds markers in nested strings with their paths', () => {
    const value = { title: 'ok', metrics: [{ value: '[fill-in: users]', label: 'users' }], body: 'a [fill-in] b' };
    expect(findFillIns(value)).toEqual(['metrics.0.value', 'body']);
  });
  it('returns nothing for finished content', () => {
    expect(findFillIns({ a: 'done', b: [1, true, null] })).toEqual([]);
  });
});

describe('guardFillIns', () => {
  it('returns the value when not strict', () => {
    const value = { a: '[fill-in]' };
    expect(guardFillIns(value, 'x.mdx', false)).toBe(value);
  });
  it('throws with the location when strict', () => {
    expect(() => guardFillIns({ a: '[fill-in: team]' }, 'x.mdx', true)).toThrow(/Unfinished content in x\.mdx: a/);
  });
});

describe('isStrictContent', () => {
  it('is strict on Vercel production or CONTENT_STRICT=1', () => {
    expect(isStrictContent({ VERCEL_ENV: 'production' })).toBe(true);
    expect(isStrictContent({ CONTENT_STRICT: '1' })).toBe(true);
    expect(isStrictContent({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(isStrictContent({})).toBe(false);
  });
});
