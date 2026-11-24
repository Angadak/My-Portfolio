import { z } from 'zod';

const text = z.string().trim().min(1);
/** YAML parses bare numbers as numbers; accept them as text without turning missing values into "undefined". */
const textish = z.preprocess((v) => (typeof v === 'number' ? String(v) : v), text);
const month = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Use YYYY-MM');

export const metricSchema = z.object({ value: text, label: text });

export const caseStudySchema = z.object({
  title: text,
  client: text,
  domain: text,
  role: text,
  teamSize: textish.optional(),
  period: textish,
  stack: z.array(text).min(1),
  summary: text,
  metrics: z.array(metricSchema).default([]),
  featured: z.boolean().default(false),
  order: z.number().int(),
});

export const projectSchema = z.object({
  title: text,
  status: z.enum(['live', 'building']),
  repoUrl: z.url(),
  liveUrl: z.url().optional(),
  stack: z.array(text).min(1),
  summary: text,
  order: z.number().int().default(0),
});

export const postSchema = z.object({
  title: text,
  date: z.coerce.date(),
  summary: text,
  tags: z.array(text).default([]),
  draft: z.boolean().default(false),
});

export const testimonialSchema = z.object({
  quote: text,
  name: text,
  role: text,
  company: text,
  linkedinUrl: z.url(),
});

export const experienceSchema = z.object({
  company: text,
  role: text,
  location: text,
  start: month,
  end: month.optional(),
  highlights: z.array(text).min(1),
});

export const skillGroups = ['backend', 'frontend', 'cloud', 'data', 'tools'] as const;

export const skillSchema = z.object({
  name: text,
  group: z.enum(skillGroups),
  since: z.number().int().min(2015),
  usedIn: z.array(text).min(1),
});

export const profileSchema = z.object({
  name: text,
  headline: text,
  location: text,
  availability: text,
  email: z.email(),
  github: z.url(),
  /** plain string so a `[fill-in]` marker is allowed until the real URL is known */
  linkedin: text,
  careerStart: month,
});

export type CaseStudyData = z.output<typeof caseStudySchema>;
export type ProjectData = z.output<typeof projectSchema>;
export type PostData = z.output<typeof postSchema>;
export type Testimonial = z.output<typeof testimonialSchema>;
export type Experience = z.output<typeof experienceSchema>;
export type Skill = z.output<typeof skillSchema>;
export type SkillGroup = (typeof skillGroups)[number];
export type Profile = z.output<typeof profileSchema>;
