import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, getProjects } from '@/lib/content';
import { Mdx } from '@/components/mdx/mdx';
import { ButtonLink } from '@/components/ui/button';
import { Chip } from '@/components/ui/chip';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.summary, alternates: { canonical: `/projects/${slug}` } };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <p className="label text-accent">Demo project</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">{project.title}</h1>
      <p className="mt-4 text-lg text-muted">{project.summary}</p>
      <ul className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((tech) => (
          <li key={tech}>
            <Chip>{tech}</Chip>
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap gap-3">
        {project.liveUrl && <ButtonLink href={project.liveUrl}>Live demo</ButtonLink>}
        <ButtonLink href={project.repoUrl} variant="secondary">
          Source code
        </ButtonLink>
      </div>
      <div className="prose-body mt-12">
        <Mdx source={project.body} />
      </div>
    </article>
  );
}
