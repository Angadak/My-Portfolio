import { describe, expect, it } from 'vitest';
import { experienceSchema } from '@/lib/schemas';

const base = {
  company: 'Acme',
  role: 'Engineer',
  location: 'Remote',
  start: '2024-01',
  highlights: ['Did things'],
};

describe('experienceSchema months', () => {
  it('rejects invalid months', () => {
    expect(experienceSchema.safeParse({ ...base, start: '2024-13' }).success).toBe(false);
    expect(experienceSchema.safeParse({ ...base, start: '2024-00' }).success).toBe(false);
  });

  it('accepts a valid month', () => {
    expect(experienceSchema.safeParse({ ...base, start: '2024-12' }).success).toBe(true);
  });
});
