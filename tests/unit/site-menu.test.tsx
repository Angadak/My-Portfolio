import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { buildNav } from '@/lib/site';
import { SiteMenu } from '@/components/layout/site-menu';
import { OPEN_PALETTE, OPEN_TERMINAL } from '@/lib/events';

vi.mock('next/navigation', () => ({ usePathname: () => '/work/tris' }));

const nav = buildNav({ hasProjects: false, hasPosts: false });
const props = { nav, github: 'https://github.com/a', linkedin: 'https://linkedin.com/in/a', email: 'a@b.co' };

function openMenu() {
  render(<SiteMenu {...props} />);
  const button = screen.getByRole('button', { name: 'Open menu' });
  fireEvent.click(button);
  return button;
}

describe('SiteMenu', () => {
  it('opens a labelled dialog and focuses the first link', () => {
    const button = openMenu();
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('dialog', { name: 'Site menu' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Work' })).toHaveFocus();
  });

  it('marks the current route', () => {
    openMenu();
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Contact' })).not.toHaveAttribute('aria-current');
  });

  it('closes on Escape and returns focus to the button', () => {
    openMenu();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    const button = screen.getByRole('button', { name: 'Open menu' });
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes after a link click', () => {
    openMenu();
    fireEvent.click(screen.getByRole('link', { name: 'Experience' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on an outside pointer down', () => {
    openMenu();
    fireEvent.pointerDown(document.body);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('traps Tab inside the panel', () => {
    openMenu();
    const dialog = screen.getByRole('dialog');
    const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button');
    const last = focusables[focusables.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(focusables[0]).toHaveFocus();
    focusables[0].focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(last).toHaveFocus();
  });

  it('opens the terminal and palette after closing itself', () => {
    const terminal = vi.fn();
    const palette = vi.fn();
    window.addEventListener(OPEN_TERMINAL, terminal);
    window.addEventListener(OPEN_PALETTE, palette);
    openMenu();
    fireEvent.click(screen.getByRole('button', { name: /terminal/i }));
    expect(terminal).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Open menu' }));
    fireEvent.click(screen.getByRole('button', { name: /command palette/i }));
    expect(palette).toHaveBeenCalledTimes(1);
    window.removeEventListener(OPEN_TERMINAL, terminal);
    window.removeEventListener(OPEN_PALETTE, palette);
  });

  it('closes and refocuses the button when a shortcut opens the palette', () => {
    const button = openMenu();
    fireEvent.keyDown(document, { key: 'k', ctrlKey: true });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(button).toHaveFocus();
  });

  it('closes from the in-panel close button and refocuses the menu button', () => {
    openMenu();
    fireEvent.click(screen.getByRole('button', { name: 'Close site menu' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open menu' })).toHaveFocus();
  });
});
