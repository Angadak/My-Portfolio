// Content lives in src/content/settings/*.json and is edited in the admin panel (/keystatic). Do not hardcode it here.
import { profileSchema } from '@/lib/schemas';
import { guardFillIns } from '@/lib/fill-in';
import data from '@/content/settings/profile.json';

export const profile = guardFillIns(profileSchema.parse(data), 'src/content/settings/profile.json');
