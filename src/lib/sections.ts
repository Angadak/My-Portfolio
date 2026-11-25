export type SectionKey = 'work' | 'projects' | 'experience' | 'testimonials' | 'posts' | 'contact';

export type SectionFlags = Record<SectionKey, boolean>;

const ORDER: SectionKey[] = ['work', 'projects', 'experience', 'testimonials', 'posts', 'contact'];

/** Two-digit labels for the home sections that actually render, in order. */
export function numberSections(flags: SectionFlags): Record<SectionKey, string> {
  let n = 0;
  const result = {} as Record<SectionKey, string>;
  for (const key of ORDER) {
    if (flags[key]) n += 1;
    result[key] = String(n || 1).padStart(2, '0');
  }
  return result;
}

/** Heading id and short label for each home section (ids match the section components). */
export const SECTION_META: Record<SectionKey, { id: string; label: string }> = {
  work: { id: 'featured-work', label: 'Work' },
  projects: { id: 'projects', label: 'Projects' },
  experience: { id: 'experience-snapshot', label: 'Experience' },
  testimonials: { id: 'testimonials', label: 'Testimonials' },
  posts: { id: 'latest-posts', label: 'Writing' },
  contact: { id: 'contact-cta', label: 'Contact' },
};

export type RailSection = { key: SectionKey; id: string; label: string };

/** The home sections that render, in page order. Built from the same flags as numberSections. */
export function visibleSections(flags: SectionFlags): RailSection[] {
  return ORDER.filter((key) => flags[key]).map((key) => ({ key, ...SECTION_META[key] }));
}
