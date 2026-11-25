import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';

vi.mock('@/app/admin-login/actions', () => ({ logout: vi.fn(), login: vi.fn() }));
const { AdminToolbar } = await import('@/app/keystatic/admin-toolbar');

describe('AdminToolbar', () => {
  it('says what Save does in each mode', () => {
    const { rerender } = render(<AdminToolbar mode="local" />);
    expect(screen.getByText(/commit and push to publish/)).toBeInTheDocument();
    rerender(<AdminToolbar mode="github" />);
    expect(screen.getByText(/Save publishes to the live site/)).toBeInTheDocument();
  });

  it('links to the site and offers sign out', () => {
    render(<AdminToolbar mode="local" />);
    expect(screen.getByRole('link', { name: /View site/ })).toHaveAttribute('href', '/');
    expect(screen.getByRole('button', { name: 'Sign out' })).toBeInTheDocument();
  });

  it('opens the help guide, focuses Close, and closes on Escape', () => {
    render(<AdminToolbar mode="local" />);
    const help = screen.getByRole('button', { name: /Help/ });
    fireEvent.click(help);
    const dialog = screen.getByRole('dialog', { name: 'How to update your site' });
    expect(dialog).toHaveTextContent('Jobs and education');
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(help).toHaveFocus();
  });
});
