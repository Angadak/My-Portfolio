import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { NavProgress } from '@/components/motion/nav-progress';

const nav = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));

function setup() {
  nav.pathname = '/';
  const ui = () => (
    <>
      <NavProgress />
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a href="/work" onClick={(e) => e.preventDefault()}>
        work
      </a>
      <a href="/cv.pdf">cv</a>
    </>
  );
  const view = render(ui());
  return { ...view, ui };
}

describe('NavProgress', () => {
  it('shows on a link click even when the link prevents default', () => {
    setup();
    fireEvent.click(screen.getByText('work'));
    expect(document.querySelector('[data-nav-progress]')).not.toBeNull();
  });

  it('ignores modifier clicks and file links', () => {
    setup();
    fireEvent.click(screen.getByText('work'), { ctrlKey: true });
    fireEvent.click(screen.getByText('cv'));
    expect(document.querySelector('[data-nav-progress]')).toBeNull();
  });

  it('clears on pathname change and does not reappear when returning', () => {
    const { rerender, ui } = setup();
    fireEvent.click(screen.getByText('work'));
    nav.pathname = '/work';
    rerender(ui());
    expect(document.querySelector('[data-nav-progress]')).toBeNull();
    nav.pathname = '/';
    rerender(ui());
    expect(document.querySelector('[data-nav-progress]')).toBeNull();
  });
});
