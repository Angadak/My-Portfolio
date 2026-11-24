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

/** jsdom cannot tell keyboard from pointer focus, so stub :focus-visible. */
function keyboardFocus(visible: boolean) {
  const original = Element.prototype.matches;
  vi.spyOn(Element.prototype, 'matches').mockImplementation(function (this: Element, selector: string) {
    return selector === ':focus-visible' ? visible : original.call(this, selector);
  });
  fireEvent.focus(stage());
}

afterEach(() => {
  vi.restoreAllMocks();
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

  it('announces the current word only when paused or focused', () => {
    render(<HeroStage {...props} />);
    const live = screen.getByText('BACKEND: C# · ASP.NET Core · EF Core · SQL Server');
    expect(live).toHaveAttribute('aria-live', 'off');
    keyboardFocus(true);
    expect(live).toHaveAttribute('aria-live', 'polite');
  });

  it('does not pause for pointer focus', () => {
    render(<HeroStage {...props} />);
    const live = screen.getByText('BACKEND: C# · ASP.NET Core · EF Core · SQL Server');
    keyboardFocus(false);
    expect(live).toHaveAttribute('aria-live', 'off');
  });

  it('keeps focus pause when the mouse leaves', () => {
    setMedia('(pointer: fine)', true);
    vi.useFakeTimers();
    render(<HeroStage {...props} />);
    keyboardFocus(true);
    fireEvent.mouseEnter(stage());
    fireEvent.mouseLeave(stage());
    act(() => {
      vi.advanceTimersByTime(4000);
    });
    expect(screen.getByText(/^01 \//)).toBeInTheDocument();
  });

  it('pauses auto-advance with the pause button', () => {
    vi.useFakeTimers();
    render(<HeroStage {...props} />);
    const button = screen.getByRole('button', { name: 'Pause word animation' });
    fireEvent.click(button);
    expect(screen.getByRole('button', { name: 'Play word animation' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Pause word animation' })).not.toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(9000);
    });
    expect(screen.getByText(/^01 \//)).toBeInTheDocument();
  });

  it('hides the pause button under reduced motion', () => {
    setMedia('(prefers-reduced-motion: reduce)', true);
    render(<HeroStage {...props} />);
    expect(screen.queryByRole('button', { name: /word animation/i })).not.toBeInTheDocument();
  });

  it('renders nothing without words', () => {
    const { container } = render(<HeroStage {...props} words={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
