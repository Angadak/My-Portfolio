import { describe, expect, it } from 'vitest';
import { caseStudySchema, experienceSchema } from '@/lib/schemas';

const study = {
  title: 'T',
  client: 'C',
  domain: 'D',
  role: 'R',
  teamSize: '4',
  period: '2026',
  stack: ['x'],
  summary: 'S',
  order: 1,
};

describe('caseStudySchema numeric text', () => {
  it('converts numeric teamSize and period to strings', () => {
    const r = caseStudySchema.safeParse({ ...study, teamSize: 4, period: 2026 });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.teamSize).toBe('4');
      expect(r.data.period).toBe('2026');
    }
  });

  it('still rejects a missing teamSize', () => {
    const rest: Partial<typeof study> = { ...study };
    delete rest.teamSize;
    expect(caseStudySchema.safeParse(rest).success).toBe(false);
  });
});

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
