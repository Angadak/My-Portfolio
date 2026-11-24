import { describe, expect, it } from 'vitest';
import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { skills } from '@/data/skills';
import { testimonials } from '@/data/testimonials';
import { groupSkills } from '@/lib/skills';

describe('data files', () => {
  it('profile has the career start used for years of experience', () => {
    expect(profile.careerStart).toBe('2022-04');
    expect(profile.email).toContain('@');
  });

  it('experience is ordered newest first', () => {
    const starts = experience.map((e) => e.start);
    expect([...starts].sort().reverse()).toEqual(starts);
    expect(experience[0].company).toBe('AEPartners');
  });

  it('testimonials start empty (only real quotes are added)', () => {
    expect(testimonials).toEqual([]);
  });
});

describe('groupSkills', () => {
  it('groups in fixed order, computes years and sorts by years', () => {
    const groups = groupSkills(
      [
        { name: 'Svelte 5', group: 'frontend', since: 2026, usedIn: ['AEPartners'] },
        { name: 'C#', group: 'backend', since: 2023, usedIn: ['TRIS'] },
        { name: 'TypeScript', group: 'frontend', since: 2024, usedIn: ['AEPartners'] },
      ],
      new Date(2026, 10, 1),
    );
    expect(groups.map((g) => g.group)).toEqual(['backend', 'frontend']);
    expect(groups[1].skills.map((s) => [s.name, s.years])).toEqual([
      ['TypeScript', 2],
      ['Svelte 5', 1],
    ]);
  });

  it('real skills data groups without error', () => {
    expect(groupSkills(skills).length).toBeGreaterThan(3);
  });
});
