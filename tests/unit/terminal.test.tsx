import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Terminal } from '@/components/terminal/terminal';
import type { SiteIndex } from '@/lib/site';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }) }));

const ctx: SiteIndex = {
  nav: [],
  caseStudies: [{ slug: 'tris', title: 'TRIS' }],
  posts: [],
  email: 'a@b.co',
  cvHref: '/cv.pdf',
  whoami: 'Angad Kumar · engineer',
  status: '● open',
  skills: ['Backend  C#'],
};

function setup() {
  const onClose = vi.fn();
  render(<Terminal ctx={ctx} onClose={onClose} />);
  const input = screen.getByRole('textbox', { name: 'Terminal command' });
  const run = (value: string) => {
    fireEvent.change(input, { target: { value } });
    fireEvent.keyDown(input, { key: 'Enter' });
  };
  return { onClose, input, run };
}

describe('Terminal', () => {
  it('focuses the prompt and runs help', () => {
    const { input, run } = setup();
    expect(input).toHaveFocus();
    run('help');
    expect(screen.getByText('Available commands:')).toBeInTheDocument();
  });

  it('navigates and closes on contact', () => {
    const { run, onClose } = setup();
    run('contact');
    expect(push).toHaveBeenCalledWith('/contact');
    expect(onClose).toHaveBeenCalled();
  });

  it('recalls history and completes with Tab', () => {
    const { input, run } = setup();
    run('whoami');
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(input).toHaveValue('whoami');
    fireEvent.change(input, { target: { value: 'sta' } });
    fireEvent.keyDown(input, { key: 'Tab' });
    expect(input).toHaveValue('status');
  });

  it('clears and closes on Escape', () => {
    const { run, onClose, input } = setup();
    run('whoami');
    run('clear');
    expect(screen.queryByText('Angad Kumar · engineer')).not.toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
