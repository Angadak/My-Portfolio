import { describe, expect, it } from 'vitest';
import { numberSections, visibleSections } from '@/lib/sections';

describe('numberSections', () => {
  it('numbers all sections 01-06 when everything renders', () => {
    const all = { work: true, projects: true, experience: true, testimonials: true, posts: true, contact: true };
    expect(Object.values(numberSections(all))).toEqual(['01', '02', '03', '04', '05', '06']);
  });

  it('closes gaps when optional sections are hidden', () => {
    const n = numberSections({ work: true, projects: false, experience: true, testimonials: false, posts: false, contact: true });
    expect(n.work).toBe('01');
    expect(n.experience).toBe('02');
    expect(n.contact).toBe('03');
  });
});

describe('visibleSections', () => {
  it('lists only shown sections in page order with their heading ids', () => {
    const list = visibleSections({ work: true, projects: false, experience: true, testimonials: false, posts: false, contact: true });
    expect(list).toEqual([
      { key: 'work', id: 'featured-work', label: 'Work' },
      { key: 'experience', id: 'experience-snapshot', label: 'Experience' },
      { key: 'contact', id: 'contact-cta', label: 'Contact' },
    ]);
  });
});
