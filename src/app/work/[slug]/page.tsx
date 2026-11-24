import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCaseStudies, getCaseStudy } from '@/lib/content';
import { Mdx } from '@/components/mdx/mdx';
import { SummaryBar } from '@/components/work/summary-bar';
import { Results } from '@/components/work/results';
import { ArrowRightIcon } from '@/components/ui/icons';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: study.title,
    description: study.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: { type: 'article', title: study.title, description: study.summary },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();
  const all = getCaseStudies();
  const next = all[(all.findIndex((s) => s.slug === slug) + 1) % all.length];

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <p className="label text-accent">
        {String(study.order).padStart(2, '0')} / Case study · {study.domain}
      </p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{study.title}</h1>
      <p className="mt-4 text-lg text-muted">{study.summary}</p>
      <SummaryBar client={study.client} role={study.role} teamSize={study.teamSize} period={study.period} stack={study.stack} />
      <div className="prose-body mt-12">
        <Mdx source={study.body} />
      </div>
      <Results metrics={study.metrics} />
      {next && next.slug !== study.slug && (
        <nav aria-label="Next case study" className="mt-20 border-t border-line pt-8">
          <p className="label text-muted">Next case study</p>
          <Link href={`/work/${next.slug}`} className="group mt-2 inline-flex items-center gap-3 text-2xl font-bold hover:text-accent">
            {next.title}
            <ArrowRightIcon className="size-6 transition group-hover:translate-x-1" />
          </Link>
        </nav>
      )}
    </article>
  );
}
