import type { CaseStudy } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/motion/reveal';
import { CaseStudyCard } from './case-study-card';

export function FeaturedWork({ studies }: { studies: CaseStudy[] }) {
  const featured = studies.filter((s) => s.featured).slice(0, 3);
  if (featured.length === 0) return null;
  return (
    <section aria-labelledby="featured-work" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="featured-work" index="01" label="Case studies" word="WORK" prop="browser" />
      <div className="grid gap-6 md:grid-cols-3">
        {featured.map((study, i) => (
          <Reveal key={study.slug} delay={i * 80} className="h-full">
            <CaseStudyCard study={study} />
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
