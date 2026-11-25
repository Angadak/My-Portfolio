import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/content';
import { ProjectCard } from '@/components/sections/projects-section';
import { PageHeading } from '@/components/ui/page-heading';

export const metadata: Metadata = {
  title: 'Demo projects',
  description: 'Open-source demo apps with live deployments, tests and CI.',
  alternates: { canonical: '/projects' },
};

export default function ProjectsPage() {
  const projects = getProjects();
  if (projects.length === 0) notFound();
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8">
      <PageHeading kicker="Builds" title="Demo projects" />
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Open-source apps you can run, read and test. Each one has a live deployment, tests and CI.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
