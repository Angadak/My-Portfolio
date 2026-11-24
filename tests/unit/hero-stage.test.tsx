import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { HeroStage } from '@/components/hero/hero-stage';
import { heroWords } from '@/lib/hero';
import { OPEN_TERMINAL } from '@/lib/events';
import { setMedia } from '../helpers/media';

const props = {
  words: heroWords('4.5+ years'),
  name: 'Angad Kumar',
  headline: 'Full-stack engineer (.NET + TypeScript)',
  availability: 'Open to remote roles worldwide',
  location: 'India',
  github: 'https://github.com/x',
  linkedin: 'https://linkedin.com/in/x',
  email: 'a@b.co',
};

const stage = () => screen.getByRole('region', { name: /skills showcase/i });

afterEach(() => {
  vi.useRealTimers();
});

describe('HeroStage', () => {
  it('shows the name as h1 and the first caption', () => {
    render(<HeroStage {...props} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Angad Kumar');
    expect(screen.getByText(/^01 \/ C#/)).toBeInTheDocument();
  });

  it('advances on click and moves with arrow keys', () => {
    render(<HeroStage {...props} />);
    fireEvent.click(stage());
    expect(screen.getByText(/^02 \/ TypeScript/)).toBeInTheDocument();
    fireEvent.keyDown(stage(), { key: 'ArrowLeft' });
    fireEvent.keyDown(stage(), { key: 'ArrowLeft' });
    expect(screen.getByText(/^05 \/ 4\.5\+ years/)).toBeInTheDocument();
  });

  it('auto-advances after 4 seconds', () => {
    vi.useFakeTimers();
    render(<HeroStage {...props} />);
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(/^02 \//)).toBeInTheDocument();
  });

  it('does not auto-advance with reduced motion', () => {
    setMedia('(prefers-reduced-motion: reduce)', true);
    vi.useFakeTimers();
    render(<HeroStage {...props} />);
    act(() => {
      vi.advanceTimersByTime(9000);
    });
    expect(screen.getByText(/^01 \//)).toBeInTheDocument();
  });

  it('opens the terminal from the API prop', () => {
    const listener = vi.fn();
    window.addEventListener(OPEN_TERMINAL, listener);
    render(<HeroStage {...props} />);
    fireEvent.click(stage());
    fireEvent.click(stage());
    fireEvent.click(screen.getByRole('button', { name: 'Open terminal' }));
    expect(listener).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/^03 \//)).toBeInTheDocument();
    window.removeEventListener(OPEN_TERMINAL, listener);
  });

  it('announces the current word politely', () => {
    render(<HeroStage {...props} />);
    expect(screen.getByText('BACKEND: C# · ASP.NET Core · EF Core · SQL Server')).toHaveAttribute('aria-live', 'polite');
  });
});
