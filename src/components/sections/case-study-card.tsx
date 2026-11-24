import Link from 'next/link';
import type { CaseStudy } from '@/lib/content';
import { TiltCard } from '@/components/motion/tilt-card';
import { Chip } from '@/components/ui/chip';
import { ArrowRightIcon } from '@/components/ui/icons';

export function CaseStudyCard({ study }: { study: CaseStudy }) {
  return (
    <TiltCard className="h-full">
      <article className="group relative flex h-full flex-col rounded-xl border border-line bg-surface p-6 transition-colors hover:border-accent">
        <p className="label text-accent">
          {String(study.order).padStart(2, '0')} / {study.domain}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight">{study.title}</h3>
        <p className="mt-2 text-muted">{study.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {study.stack.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
        {study.metrics.length > 0 && (
          <dl className="mt-auto grid grid-cols-3 gap-2 pt-6">
            {study.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="flex flex-col-reverse rounded-lg border border-line p-3">
                <dt className="text-xs text-muted">{m.label}</dt>
                <dd className="text-lg font-black">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <Link
          href={`/work/${study.slug}`}
          aria-label={`Read case study: ${study.title}`}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent after:absolute after:inset-0"
        >
          Read case study <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
        </Link>
      </article>
    </TiltCard>
  );
}
