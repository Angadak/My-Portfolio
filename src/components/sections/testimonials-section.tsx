import type { Testimonial } from '@/lib/schemas';
import { SectionHeading } from '@/components/ui/section-heading';

export function TestimonialsSection({ items, index, title = 'What people say' }: { items: Testimonial[]; index: string; title?: string }) {
  if (items.length < 2) return null;
  return (
    <section aria-labelledby="testimonials" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="testimonials" index={index} label="Testimonials" title={title} />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t.name} className="panel panel-hit relative p-6 pt-10">
            <span aria-hidden className="absolute -top-6 left-4 font-display text-6xl leading-none text-accent [paint-order:stroke_fill] [-webkit-text-stroke:4px_var(--ink)]">“</span>
            <blockquote className="text-lg font-medium">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <a href={t.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-extrabold underline decoration-accent decoration-2 underline-offset-4 hover:text-accent">
                {t.name}
              </a>
              <span className="text-muted">
                {' '}
                · {t.role}, {t.company}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
