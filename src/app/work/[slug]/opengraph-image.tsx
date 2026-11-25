import { getCaseStudies, getCaseStudy } from '@/lib/content';
import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Case study cover image';

export function generateStaticParams() {
  return getCaseStudies().map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  return renderOg({ kicker: study ? `Case study · ${study.domain}` : 'Case study', title: study?.title ?? 'Case study' });
}
