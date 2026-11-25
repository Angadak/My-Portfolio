import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { FeaturedWork } from '@/components/sections/featured-work';
import { ProjectsSection } from '@/components/sections/projects-section';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { LatestPosts } from '@/components/sections/latest-posts';
import type { CaseStudy, Post, Project } from '@/lib/content';
import { ExperienceSnapshot } from '@/components/sections/experience-snapshot';
import { ContactCta } from '@/components/sections/contact-cta';
import type { Experience, Testimonial } from '@/lib/schemas';

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
    expect(screen.getByText(/02 —/)).toBeInTheDocument();
  });

  it('testimonials appear from two quotes', () => {
    render(<TestimonialsSection items={[testimonial, { ...testimonial, name: 'Ana Ruiz' }]} index="02" />);
    expect(screen.getByText('Ana Ruiz')).toBeInTheDocument();
  });

  it('FeaturedWork shows the first featured study big with a sketch and the rest compact', () => {
    const studies = [study('practice-manager', true, 1), study('tris', true, 2), study('cwecs', true, 3)];
    const { container } = render(<FeaturedWork studies={studies} index="01" />);
    const big = container.querySelector('[data-featured="primary"]')!;
    expect(big).toHaveTextContent('Title practice-manager');
    expect(big.querySelector('[data-sketch="practice-manager"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-featured="compact"]')).toHaveLength(2);
    expect(container.querySelector('[data-featured="compact"] [data-sketch="tris"]')).not.toBeNull();
  });

  it('ExperienceSnapshot opens on the current role as a player card', () => {
    const items: Experience[] = [
      { company: 'Now Co', role: 'Engineer', location: 'Remote, Australia', start: '2026-04', highlights: ['Shipped x'] },
      { company: 'Past Co', role: 'Developer', location: 'Delhi, India', start: '2023-01', end: '2026-03', highlights: ['Built y'] },
    ];
    const { container } = render(<ExperienceSnapshot items={items} index="02" />);
    const panel = screen.getByRole('tabpanel');
    expect(panel).toHaveAttribute('data-current');
    expect(panel).toHaveTextContent('Now Co');
    expect(within(panel).getByText('Now')).toBeInTheDocument();
    expect(within(panel).getByText('Shipped x')).toBeInTheDocument();
    expect(within(panel).queryByText(/Past Co/)).toBeNull();
    expect(screen.getAllByRole('tab')).toHaveLength(2);
    expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('Now Co');
    // stats strip: two clubs, two countries
    expect(container.querySelector('dl')).toHaveTextContent('Clubs2');
    expect(container.querySelector('dl')).toHaveTextContent('Countries2');
  });

  it('ExperienceSnapshot switches roles by click and by arrow keys', () => {
    const items: Experience[] = [
      { company: 'A Co', role: 'Dev', location: 'X, India', start: '2024-01', end: '2025-01', highlights: ['a-play'] },
      { company: 'B Co', role: 'Dev', location: 'Y, India', start: '2022-01', end: '2023-12', highlights: ['b-play'] },
    ];
    const { container } = render(<ExperienceSnapshot items={items} index="02" />);
    expect(container.querySelector('[data-current]')).toBeNull();
    fireEvent.click(screen.getByRole('tab', { name: /B Co/ }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('b-play');
    fireEvent.keyDown(screen.getByRole('tablist'), { key: 'ArrowDown' });
    expect(screen.getByRole('tabpanel')).toHaveTextContent('a-play');
    expect(screen.getByRole('tab', { name: /A Co/ })).toHaveFocus();
  });

  it('ContactCta has its heading and the goal net', () => {
    const { container } = render(<ContactCta email="a@b.co" index="03" />);
    expect(screen.getByRole('heading', { level: 2, name: "Let's work together" })).toBeInTheDocument();
    expect(container.querySelector('[data-ball-goal]')).not.toBeNull();
  });
});
