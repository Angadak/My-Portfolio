import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ButtonLink } from '@/components/ui/button';
import { SectionHeading } from '@/components/ui/section-heading';
import { PageHeading } from '@/components/ui/page-heading';
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
  it('renders the kicker and a focusable h2 marked as a ball stop', () => {
    render(<SectionHeading id="x" index="01" label="Work" title="Things I've built" />);
    expect(screen.getByText('01 — Work')).toBeInTheDocument();
    const heading = screen.getByRole('heading', { level: 2, name: "Things I've built" });
    expect(heading).toHaveAttribute('id', 'x');
    expect(heading).toHaveAttribute('data-ball-stop');
    expect(heading).toHaveAttribute('tabindex', '-1');
  });
});

describe('PageHeading', () => {
  it('renders the kicker and the page h1', () => {
    render(<PageHeading kicker="Work" title="Case studies" />);
    expect(screen.getByText('Work')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Case studies' })).toBeInTheDocument();
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
