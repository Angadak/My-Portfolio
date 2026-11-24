import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { InteractiveLayer } from '@/components/interactive/interactive-layer';
import { Toaster } from '@/components/motion/toaster';
import { openTerminal, toast } from '@/lib/events';
import type { SiteIndex } from '@/lib/site';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const index: SiteIndex = {
  nav: [{ href: '/work', label: 'Work' }],
  caseStudies: [],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'me',
  status: 'open',
  skills: [],
};

describe('InteractiveLayer', () => {
  it('opens the terminal with the backtick key and closes with Escape', async () => {
    render(<InteractiveLayer index={index} />);
    fireEvent.keyDown(window, { key: '`' });
    const input = await screen.findByRole('textbox', { name: 'Terminal command' });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Terminal' })).not.toBeInTheDocument();
  });

  it('ignores the backtick while typing in a field', () => {
    render(
      <>
        <input aria-label="Other field" />
        <InteractiveLayer index={index} />
      </>,
    );
    const field = screen.getByRole('textbox', { name: 'Other field' });
    field.focus();
    fireEvent.keyDown(field, { key: '`' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens the palette with Ctrl+K and the terminal from events', async () => {
    render(<InteractiveLayer index={index} />);
    fireEvent.keyDown(window, { key: 'k', ctrlKey: true });
    expect(await screen.findByRole('dialog', { name: 'Command palette' })).toBeInTheDocument();
    act(() => openTerminal());
    expect(await screen.findByRole('dialog', { name: 'Terminal' })).toBeInTheDocument();
  });
});

describe('Toaster', () => {
  it('shows and then removes a toast', () => {
    vi.useFakeTimers();
    render(<Toaster />);
    act(() => toast('Email copied'));
    expect(screen.getByText('Email copied')).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(3600);
    });
    expect(screen.queryByText('Email copied')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
