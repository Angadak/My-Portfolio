import Link from 'next/link';
import type { Project } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Chip } from '@/components/ui/chip';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';

export function ProjectCard({ project }: { project: Project }) {
  return (
    <TiltCard className="h-full">
      <article className="flex h-full flex-col rounded-xl border border-line bg-surface p-6">
        <h3 className="text-xl font-semibold tracking-tight">
          <Link href={`/projects/${project.slug}`} className="hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mt-2 text-muted">{project.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <li key={tech}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
        <div className="mt-auto flex gap-4 pt-6 text-sm font-medium">
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
              Live demo
            </a>
          )}
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
            Source code
          </a>
        </div>
      </article>
    </TiltCard>
  );
}

export function ProjectsSection({ projects, index }: { projects: Project[]; index: string }) {
  if (projects.length === 0) return null;
  return (
    <section aria-labelledby="projects" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="projects" index={index} label="Open-source demos" word="BUILDS" prop="api" />
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Reveal key={project.slug} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
