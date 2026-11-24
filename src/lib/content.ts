import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { z } from 'zod';
import { caseStudySchema, postSchema, projectSchema } from './schemas';
import { guardFillIns } from './fill-in';

export const CONTENT_DIR = path.join(process.cwd(), 'src', 'content');

export type Entry<T> = T & { slug: string; body: string };
export type CaseStudy = Entry<z.output<typeof caseStudySchema>>;
export type Project = Entry<z.output<typeof projectSchema>>;
export type Post = Entry<z.output<typeof postSchema>>;

export function loadCollection<S extends z.ZodType>(dir: string, schema: S): Entry<z.output<S>>[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const fullPath = path.join(dir, file);
      const { data, content } = matter(fs.readFileSync(fullPath, 'utf8'));
      const parsed = schema.safeParse(data);
      if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        throw new Error(`Invalid frontmatter in ${fullPath}: ${issues}`);
      }
      const entry = {
        ...(parsed.data as object),
        slug: file.replace(/\.mdx$/, ''),
        body: content,
      } as Entry<z.output<S>>;
      return guardFillIns(entry, fullPath);
    });
}

export function getCaseStudies(dir = path.join(CONTENT_DIR, 'case-studies')): CaseStudy[] {
  return loadCollection(dir, caseStudySchema).sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
}

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return getCaseStudies().find((s) => s.slug === slug);
}

export function getProjects(
  dir = path.join(CONTENT_DIR, 'projects'),
  { liveOnly = true }: { liveOnly?: boolean } = {},
): Project[] {
  const all = loadCollection(dir, projectSchema).sort(
    (a, b) => a.order - b.order || a.slug.localeCompare(b.slug),
  );
  return liveOnly ? all.filter((p) => p.status === 'live') : all;
}

export function getProject(slug: string): Project | undefined {
  return getProjects().find((p) => p.slug === slug);
}

export function getPosts(
  dir = path.join(CONTENT_DIR, 'blog'),
  { includeDrafts = process.env.NODE_ENV !== 'production' }: { includeDrafts?: boolean } = {},
): Post[] {
  return loadCollection(dir, postSchema)
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => b.date.getTime() - a.date.getTime() || a.slug.localeCompare(b.slug));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}
