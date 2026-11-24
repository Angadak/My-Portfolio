import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { Socials } from '@/components/ui/socials';
import { PropIcon, PROP_NAMES } from '@/components/props/props';

describe('ButtonLink', () => {
  it('uses a plain anchor for files and external links', () => {
    render(<ButtonLink href="/cv.pdf" download>CV</ButtonLink>);
    const link = screen.getByRole('link', { name: 'CV' });
    expect(link).toHaveAttribute('href', '/cv.pdf');
    expect(link).toHaveAttribute('download');
  });
  it('opens external links in a new tab safely', () => {
    render(<ButtonLink href="https://github.com/x">Code</ButtonLink>);
    expect(screen.getByRole('link', { name: 'Code' })).toHaveAttribute('rel', 'noopener noreferrer');
  });
});

describe('SectionHeading', () => {
  it('renders the label and an h2', () => {
    render(<SectionHeading id="x" index="01" label="Case studies" word="WORK" prop="browser" />);
    expect(screen.getByText('01 / Case studies')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'WORK' })).toHaveAttribute('id', 'x');
  });
});

describe('Socials', () => {
  it('renders labelled links', () => {
    render(<Socials github="https://github.com/a" linkedin="https://linkedin.com/in/a" email="a@b.co" />);
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/a');
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:a@b.co');
  });
});

describe('PropIcon', () => {
  it('renders every prop as decorative svg', () => {
    for (const name of PROP_NAMES) {
      const { container, unmount } = render(<PropIcon name={name} />);
      const svg = container.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      unmount();
    }
  });
});
