import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { BackLink, parentOf } from '@/components/layout/back-link';
import { TerminalLauncher } from '@/components/layout/terminal-launcher';
import { OPEN_TERMINAL } from '@/lib/events';

const nav = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));

afterEach(() => {
  vi.useRealTimers();
  window.localStorage.clear();
});

describe('parentOf', () => {
  it('goes one level up the site', () => {
    expect(parentOf('/')).toBeNull();
    expect(parentOf('/work')).toEqual({ href: '/', label: 'Home' });
    expect(parentOf('/work/tris')).toEqual({ href: '/work', label: 'Case studies' });
    expect(parentOf('/blog/some-post/')).toEqual({ href: '/blog', label: 'Blog' });
    expect(parentOf('/does/not/exist')).toEqual({ href: '/', label: 'Home' });
  });
});

describe('BackLink', () => {
  it('is hidden on the home page', () => {
    nav.pathname = '/';
    const { container } = render(<BackLink />);
    expect(container).toBeEmptyDOMElement();
  });

  it('links a case study back to the case studies list', () => {
    nav.pathname = '/work/tris';
    render(<BackLink />);
    expect(screen.getByRole('link', { name: 'Back to Case studies' })).toHaveAttribute('href', '/work');
  });
});

describe('TerminalLauncher', () => {
  it('opens the terminal from the edge tab', () => {
    const listener = vi.fn();
    window.addEventListener(OPEN_TERMINAL, listener);
    render(<TerminalLauncher />);
    fireEvent.click(screen.getByRole('button', { name: 'Open terminal (backtick key)' }));
    expect(listener).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_TERMINAL, listener);
  });

  it('shows a one-time tip for first visits and remembers the dismissal', () => {
    vi.useFakeTimers();
    const { unmount } = render(<TerminalLauncher />);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss tip' }));
    expect(screen.queryByRole('dialog', { name: 'Terminal tip' })).toBeNull();
    unmount();
    render(<TerminalLauncher />);
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    expect(screen.queryByRole('dialog', { name: 'Terminal tip' })).toBeNull();
  });
});
