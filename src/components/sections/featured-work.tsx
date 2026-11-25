import Link from 'next/link';
import type { CaseStudy } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';
import { ArrowRightIcon } from '@/components/ui/icons';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';
import { CaseStudySketch } from '@/components/work/case-study-sketch';

function PrimaryCard({ study }: { study: CaseStudy }) {
  return (
    <TiltCard className="h-full">
      <article data-featured="primary" className="panel panel-hit group relative flex h-full flex-col p-6">
        <div className="relative isolate overflow-hidden border-2 border-ink/60 bg-bg p-4">
          <div aria-hidden className="speed-lines-accent absolute -inset-1/4 -z-10 scale-75 opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-30" />
          <span aria-hidden className="absolute left-2 top-1.5 font-display text-xs tracking-[0.14em] text-muted">No.{String(study.order).padStart(2, '0')}</span>
          <CaseStudySketch slug={study.slug} className="mx-auto h-40 w-full max-w-sm transition duration-500 group-hover:scale-105" />
        </div>
        <p className="label mt-6 font-bold text-accent">{study.domain}</p>
        <h3 className="mt-2 font-display text-2xl tracking-[-0.01em]">{study.title}</h3>
        <p className="mt-2 text-muted">{study.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {study.stack.slice(0, 5).map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
        {study.metrics.length > 0 && (
          <dl className="mt-6 grid grid-cols-3 gap-2">
            {study.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="flex flex-col-reverse border-[1.5px] border-ink/60 bg-bg p-3">
                <dt className="text-xs font-medium text-muted">{m.label}</dt>
                <dd className="font-display text-xl text-accent">{m.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <Link
          href={`/work/${study.slug}`}
          aria-label={`Read case study: ${study.title}`}
          className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-extrabold uppercase tracking-[0.1em] text-accent after:absolute after:inset-0"
        >
          Read case study <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
        </Link>
      </article>
    </TiltCard>
  );
}

function CompactCard({ study }: { study: CaseStudy }) {
  return (
    <article data-featured="compact" className="panel panel-hit group relative flex h-full gap-4 p-5">
      <div className="grid size-14 shrink-0 place-items-center border-2 border-ink/60 bg-bg transition group-hover:-rotate-3 group-hover:bg-accent/15">
        <CaseStudySketch slug={study.slug} className="size-10" />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-lg">{study.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{study.summary}</p>
        <p className="mt-2 font-mono text-xs text-muted">{study.stack.slice(0, 3).join(' · ')}</p>
        <Link
          href={`/work/${study.slug}`}
          aria-label={`Read case study: ${study.title}`}
          className="mt-3 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-[0.1em] text-accent after:absolute after:inset-0"
        >
          Read <ArrowRightIcon className="size-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}

export function FeaturedWork({ studies, index, title = "Things I've built" }: { studies: CaseStudy[]; index: string; title?: string }) {
  const featured = studies.filter((s) => s.featured).slice(0, 3);
  if (featured.length === 0) return null;
  const [primary, ...rest] = featured;
  return (
    <section aria-labelledby="featured-work" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="featured-work" index={index} label="Work" title={title} />
      <div className="grid gap-6 md:grid-cols-2 md:grid-rows-[auto_auto]">
        <Reveal className="h-full md:row-span-2">
          <PrimaryCard study={primary} />
        </Reveal>
        {rest.map((study, i) => (
          <Reveal key={study.slug} delay={(i + 1) * 80} className="h-full">
            <CompactCard study={study} />
          </Reveal>
        ))}
      </div>
      <div className="mt-10">
        <ButtonLink href="/work" variant="secondary">
          All case studies
        </ButtonLink>
      </div>
    </section>
  );
}
