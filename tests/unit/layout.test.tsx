import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { buildNav } from '@/lib/site';
import { NavLinks } from '@/components/layout/nav-links';
import { MobileMenu } from '@/components/layout/mobile-menu';
import { InteractiveButtons } from '@/components/layout/interactive-buttons';
import { OPEN_PALETTE, OPEN_TERMINAL } from '@/lib/events';

vi.mock('next/navigation', () => ({ usePathname: () => '/work/tris' }));

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

describe('NavLinks', () => {
  it('marks the current section', () => {
    render(<NavLinks items={buildNav({ hasProjects: false, hasPosts: false })} />);
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current');
  });
});

describe('MobileMenu', () => {
  it('opens and closes', () => {
    render(<MobileMenu items={buildNav({ hasProjects: false, hasPosts: false })} />);
    const toggle = screen.getByRole('button', { name: /menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(screen.getAllByRole('link', { name: 'Experience' })[0]);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('InteractiveButtons', () => {
  it('dispatches open events', () => {
    const terminal = vi.fn();
    const palette = vi.fn();
    window.addEventListener(OPEN_TERMINAL, terminal);
    window.addEventListener(OPEN_PALETTE, palette);
    render(<InteractiveButtons />);
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }));
    fireEvent.click(screen.getByRole('button', { name: /command palette/i }));
    expect(terminal).toHaveBeenCalledTimes(1);
    expect(palette).toHaveBeenCalledTimes(1);
  });
});
