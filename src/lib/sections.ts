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
