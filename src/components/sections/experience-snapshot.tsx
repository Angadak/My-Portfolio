import type { Experience } from '@/lib/schemas';
import { formatPeriod } from '@/lib/experience';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';

export function ExperienceSnapshot({ items, index }: { items: Experience[]; index: string }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="experience-snapshot" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="experience-snapshot" index={index} label="Experience" word="JOURNEY" prop="mug" />
      <ol className="divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={`${item.company}-${item.start}`} className="grid gap-1 py-5 sm:grid-cols-[1fr_auto] sm:items-baseline">
            <div>
              <p className="font-semibold">
                {item.role} · {item.company}
              </p>
              <p className="text-sm text-muted">{item.location}</p>
            </div>
            <p className="label text-muted">{formatPeriod(item.start, item.end)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <ButtonLink href="/experience" variant="secondary">
          Full experience and skills
        </ButtonLink>
      </div>
    </section>
  );
}
