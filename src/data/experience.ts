// Content lives in src/content/settings/*.json and is edited in the admin panel (/keystatic). Do not hardcode it here.
import { z } from 'zod';
import { experienceSchema } from '@/lib/schemas';
import { guardFillIns } from '@/lib/fill-in';
import data from '@/content/settings/experience.json';

const text = z.string().trim().min(1);
const file = 'src/content/settings/experience.json';

export const experience = guardFillIns(z.array(experienceSchema).parse(data.roles), file);

export const education = z.array(z.object({ school: text, degree: text, period: text })).parse(data.education ?? []);

export const certifications = z.array(z.object({ name: text, issuer: text, date: text })).parse(data.certifications ?? []);

export const alsoBuilt = z.array(z.object({ name: text, detail: text })).parse(data.alsoBuilt ?? []);
