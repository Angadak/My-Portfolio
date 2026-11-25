// Content lives in src/content/settings/*.json and is edited in the admin panel (/keystatic). Do not hardcode it here.
import { z } from 'zod';
import { skillSchema } from '@/lib/schemas';
import data from '@/content/settings/skills.json';

export const skills = z.array(skillSchema).parse(data.skills);
