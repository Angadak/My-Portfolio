// Content lives in src/content/settings/*.json and is edited in the admin panel (/keystatic). Do not hardcode it here.
import { z } from 'zod';
import { testimonialSchema, type Testimonial } from '@/lib/schemas';
import data from '@/content/settings/testimonials.json';

/** Add only real, attributed quotes (e.g. from LinkedIn recommendations). Section shows at 2+. */
export const testimonials: Testimonial[] = z.array(testimonialSchema).parse(data.testimonials);
