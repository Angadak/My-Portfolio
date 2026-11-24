import type { Metadata } from 'next';
import { getCaseStudies } from '@/lib/content';
import { CaseStudyCard } from '@/components/sections/case-study-card';
import { Reveal } from '@/components/motion/reveal';

export const metadata: Metadata = {
  title: 'Case studies',
  description: 'Production systems Angad Kumar has built: practice management, employee benefits, rail operations and more.',
  alternates: { canonical: '/work' },
};

export default function WorkPage() {
  const studies = getCaseStudies();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <p className="label text-accent">Work</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
        Case studies
      </h1>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Systems I&apos;ve built in production. Client code stays private, so each write-up explains the problem, my part
        and the results instead.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {studies.map((study) => (
          <Reveal key={study.slug} className="h-full">
            <CaseStudyCard study={study} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
