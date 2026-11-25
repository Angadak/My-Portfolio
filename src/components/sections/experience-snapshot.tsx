import type { Experience } from '@/lib/schemas';
import { formatDuration, formatPeriod, monthsBetween } from '@/lib/experience';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { CareerMode, type CareerRole } from './career-mode';

function country(location: string): string {
  return location.split(',').pop()!.trim();
}

/** Home experience section. Durations are worked out here (server/build time) so the client never disagrees. */
export function ExperienceSnapshot({ items, index, title = "Where I've played" }: { items: Experience[]; index: string; title?: string }) {
  if (items.length === 0) return null;
  const months = items.map((item) => monthsBetween(item.start, item.end));
  const total = months.reduce((sum, m) => sum + m, 0);
  const roles: CareerRole[] = items.map((item, i) => ({
    key: `${item.company}-${item.start}`,
    role: item.role,
    company: item.company,
    location: item.location,
    period: formatPeriod(item.start, item.end),
    from: item.start.slice(0, 4),
    to: item.end ? item.end.slice(0, 4) : 'Now',
    duration: formatDuration(months[i]),
    share: months[i] / total,
    current: !item.end,
    highlights: item.highlights,
  }));
  const countries = new Set(items.map((item) => country(item.location))).size;
  const stats = [
    { value: String(items.length), label: items.length === 1 ? 'Club' : 'Clubs' },
    { value: formatDuration(total), label: 'On the pitch' },
    { value: String(countries), label: countries === 1 ? 'Country' : 'Countries' },
  ];

  return (
    <section aria-labelledby="experience-snapshot" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="experience-snapshot" index={index} label="Experience" title={title} />
      <dl className="mb-8 grid grid-cols-3 gap-3 sm:max-w-xl">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse border-2 border-ink/60 bg-surface px-3 py-2">
            <dt className="label text-[0.65rem] text-muted">{s.label}</dt>
            <dd className="font-display text-base text-accent sm:text-xl">{s.value}</dd>
          </div>
        ))}
      </dl>
      <CareerMode roles={roles} />
      <div className="mt-10">
        <ButtonLink href="/experience" variant="secondary">
          Full experience and skills
        </ButtonLink>
      </div>
    </section>
  );
}
