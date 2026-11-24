import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FeaturedWork } from '@/components/sections/featured-work';
import { ProjectsSection } from '@/components/sections/projects-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { LatestPosts } from '@/components/sections/latest-posts';
import type { CaseStudy, Post, Project } from '@/lib/content';
import type { Testimonial } from '@/lib/schemas';

const study = (slug: string, featured: boolean, order: number): CaseStudy => ({
  slug,
  body: '',
  title: `Title ${slug}`,
  client: 'Client',
  domain: 'Fintech',
  role: 'Engineer',
  teamSize: '4',
  period: '2025',
  stack: ['C#'],
  summary: `Summary ${slug}`,
  metrics: [{ value: '10k', label: 'users' }],
  featured,
  order,
});

const testimonial: Testimonial = {
  quote: 'Great engineer.',
  name: 'Sam Lee',
  role: 'Manager',
  company: 'Acme',
  linkedinUrl: 'https://linkedin.com/in/sam',
};

describe('home sections', () => {
  it('FeaturedWork shows up to three featured studies', () => {
    const studies = [study('a', true, 1), study('b', false, 2), study('c', true, 3), study('d', true, 4), study('e', true, 5)];
    render(<FeaturedWork studies={studies} index="01" />);
    expect(screen.getAllByRole('link', { name: /read case study/i })).toHaveLength(3);
    expect(screen.queryByText('Title b')).not.toBeInTheDocument();
  });

  it('empty sections render nothing', () => {
    const { container } = render(
      <>
        <FeaturedWork studies={[study('x', false, 1)]} index="01" />
        <ProjectsSection projects={[] as Project[]} index="02" />
        <TestimonialsSection items={[testimonial]} index="04" />
        <LatestPosts posts={[] as Post[]} index="05" />
      </>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('uses the index prop for the section label', () => {
    render(<FeaturedWork studies={[study('a', true, 1)]} index="02" />);
    expect(screen.getByText(/02 \//)).toBeInTheDocument();
  });

  it('testimonials appear from two quotes', () => {
    render(<TestimonialsSection items={[testimonial, { ...testimonial, name: 'Ana Ruiz' }]} index="02" />);
    expect(screen.getByText('Ana Ruiz')).toBeInTheDocument();
  });
});
