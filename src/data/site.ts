// Content lives in src/content/settings/*.json and is edited in the admin panel (/keystatic). Do not hardcode it here.
import { siteCopySchema } from '@/lib/schemas';
import { guardFillIns } from '@/lib/fill-in';
import data from '@/content/settings/site.json';

/** Editable page copy: SEO text, hero words, home section titles, contact texts. */
export const siteCopy = guardFillIns(siteCopySchema.parse(data), 'src/content/settings/site.json');
