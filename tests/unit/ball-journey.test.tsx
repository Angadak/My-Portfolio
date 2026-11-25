import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { BallJourney, PITCH_QUERY } from '@/components/football/ball-journey';
import { setMedia } from '../helpers/media';

describe('BallJourney', () => {
  it('renders one decorative ball', () => {
    const { container } = render(<BallJourney />);
    const ball = container.querySelector('[data-ball]') as HTMLElement;
    expect(ball).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('[data-ball]')).toHaveLength(1);
  });

  it('uses rail mode by default (small screens, coarse pointers)', () => {
    const { container } = render(<BallJourney />);
    expect(container.querySelector('[data-ball]')).toHaveAttribute('data-mode', 'rail');
  });

  it('uses pitch mode when the pitch query matches and the gutter is wide enough', () => {
    setMedia(PITCH_QUERY, true);
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1440 });
    try {
      const { container } = render(<BallJourney />);
      expect(container.querySelector('[data-ball]')).toHaveAttribute('data-mode', 'pitch');
    } finally {
      // Drop the instance override so jsdom's prototype getter (0) applies again.
      delete (document.documentElement as unknown as Record<string, unknown>).clientWidth;
    }
  });
});
