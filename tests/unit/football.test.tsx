import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { FootballIcon } from '@/components/football/football-icon';
import { GoalNet } from '@/components/football/goal-net';

describe('football decorations', () => {
  it('ball is a decorative svg', () => {
    const { container } = render(<FootballIcon className="size-9" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('goal net is hidden from assistive tech and marked as the goal', () => {
    const { container } = render(<GoalNet />);
    const net = container.firstElementChild as HTMLElement;
    expect(net).toHaveAttribute('data-ball-goal');
    expect(net).toHaveAttribute('aria-hidden', 'true');
  });
});
