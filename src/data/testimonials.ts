import { z } from 'zod';
import { testimonialSchema, type Testimonial } from '@/lib/schemas';

/** Add only real, attributed quotes (e.g. from LinkedIn recommendations). Section shows at 2+. */
export const testimonials: Testimonial[] = z.array(testimonialSchema).parse([]);
