import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProjects } from '@/lib/content';
import { ProjectCard } from '@/components/sections/projects-section';

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
      <p className="label text-accent">Builds</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
        Demo projects
      </h1>
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
