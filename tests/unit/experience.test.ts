import { describe, expect, it } from 'vitest';
import { formatPeriod, formatYears, yearsOfExperience } from '@/lib/experience';

describe('yearsOfExperience', () => {
  it('rounds down to the nearest half year', () => {
    expect(yearsOfExperience('2022-04', new Date(2026, 10, 24))).toBe(4.5);
    expect(yearsOfExperience('2022-04', new Date(2026, 2, 31))).toBe(3.5);
    expect(yearsOfExperience('2022-04', new Date(2026, 3, 1))).toBe(4);
  });
  it('never goes negative', () => {
    expect(yearsOfExperience('2030-01', new Date(2026, 0, 1))).toBe(0);
  });
});

describe('formatYears', () => {
  it('formats whole and half years', () => {
    expect(formatYears(4)).toBe('4+ years');
    expect(formatYears(4.5)).toBe('4.5+ years');
  });
});

describe('formatPeriod', () => {
  it('formats start and end months', () => {
    expect(formatPeriod('2024-12', '2026-03')).toBe('Dec 2024 – Mar 2026');
  });
  it('shows Present without an end', () => {
    expect(formatPeriod('2026-04')).toBe('Apr 2026 – Present');
  });
});
