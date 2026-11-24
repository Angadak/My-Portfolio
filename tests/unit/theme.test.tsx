import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { resolveTheme, toggleTheme, toggleDocumentTheme, THEME_KEY } from '@/lib/theme';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { setMedia } from '../helpers/media';

describe('resolveTheme', () => {
  it('uses a stored choice when valid', () => {
    expect(resolveTheme('dark', false)).toBe('dark');
    expect(resolveTheme('light', true)).toBe('light');
  });
  it('falls back to the system setting', () => {
    expect(resolveTheme(null, true)).toBe('dark');
    expect(resolveTheme(undefined, false)).toBe('light');
    expect(resolveTheme('purple', false)).toBe('light');
  });
});

describe('toggleTheme', () => {
  it('flips between light and dark', () => {
    expect(toggleTheme('light')).toBe('dark');
    expect(toggleTheme('dark')).toBe('light');
  });
});

describe('toggleDocumentTheme', () => {
  it('switches from system dark to light and stores it', () => {
    setMedia('(prefers-color-scheme: dark)', true);
    expect(toggleDocumentTheme()).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(window.localStorage.getItem(THEME_KEY)).toBe('light');
  });
});

describe('ThemeToggle', () => {
  it('sets data-theme on click', () => {
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button', { name: /toggle colour theme/i }));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
