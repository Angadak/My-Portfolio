import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CommandPalette } from '@/components/palette/command-palette';
import { OPEN_TERMINAL } from '@/lib/events';
import type { SiteIndex } from '@/lib/site';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const index: SiteIndex = {
  nav: [
    { href: '/work', label: 'Work' },
    { href: '/experience', label: 'Experience' },
  ],
  caseStudies: [{ slug: 'tris', title: 'TRIS — train operations APIs and dashboard' }],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'me',
  status: 'open',
  skills: [],
};

describe('CommandPalette', () => {
  it('filters and navigates to a case study', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CommandPalette index={index} onClose={onClose} />);
    const input = screen.getByRole('combobox');
    expect(input).toHaveFocus();
    await user.type(input, 'train');
    expect(screen.queryByRole('option', { name: 'Experience' })).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onClose).toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith('/work/tris');
  });

  it('runs actions', async () => {
    const user = userEvent.setup();
    const listener = vi.fn();
    window.addEventListener(OPEN_TERMINAL, listener);
    render(<CommandPalette index={index} onClose={vi.fn()} />);
    await user.click(screen.getByRole('option', { name: /open terminal/i }));
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_TERMINAL, listener);
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CommandPalette index={index} onClose={onClose} />);
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});
