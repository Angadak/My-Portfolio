import type { Testimonial } from '@/lib/schemas';
import { SectionHeading } from '@/components/ui/section-heading';

export function TestimonialsSection({ items, index }: { items: Testimonial[]; index: string }) {
  if (items.length < 2) return null;
  return (
    <section aria-labelledby="testimonials" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="testimonials" index={index} label="Testimonials" word="KIND WORDS" />
      <div className="grid gap-6 md:grid-cols-2">
        {items.map((t) => (
          <figure key={t.name} className="rounded-xl border border-line bg-surface p-6">
            <blockquote className="text-lg">“{t.quote}”</blockquote>
            <figcaption className="mt-4 text-sm">
              <a href={t.linkedinUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:text-accent">
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
