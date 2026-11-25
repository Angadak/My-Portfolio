import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { buildNav } from '@/lib/site';
import { SiteTopBar } from '@/components/layout/site-top-bar';

describe('buildNav', () => {
  it('hides Projects and Blog until they have content', () => {
    expect(buildNav({ hasProjects: false, hasPosts: false }).map((i) => i.label)).toEqual(['Work', 'Experience', 'Contact']);
    expect(buildNav({ hasProjects: true, hasPosts: true }).map((i) => i.label)).toEqual([
      'Work',
      'Projects',
      'Experience',
      'Blog',
      'Contact',
    ]);
  });
});

describe('SiteTopBar', () => {
  it('shows the name as a home link inside the banner', () => {
    render(<SiteTopBar name="Angad Kumar" />);
    const link = screen.getByRole('link', { name: 'Angad Kumar, home' });
    expect(link).toHaveAttribute('href', '/');
    expect(screen.getByRole('banner')).toContainElement(link);
  });
});
