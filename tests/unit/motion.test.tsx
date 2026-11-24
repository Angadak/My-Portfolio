import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';
import { MockIntersectionObserver, setMedia } from '../helpers/media';

const rect = { left: 0, top: 0, width: 100, height: 100, right: 100, bottom: 100, x: 0, y: 0, toJSON: () => ({}) } as DOMRect;

describe('Reveal', () => {
  it('marks content as shown once it scrolls into view', () => {
    render(<Reveal><p>Hello</p></Reveal>);
    const wrapper = screen.getByText('Hello').parentElement!;
    expect(wrapper).not.toHaveAttribute('data-shown');
    MockIntersectionObserver.instances[0].trigger(true, wrapper);
    expect(wrapper).toHaveAttribute('data-shown');
  });
});

describe('TiltCard', () => {
  it('tilts with a fine pointer', () => {
    setMedia('(pointer: fine)', true);
    render(<TiltCard><p>Card</p></TiltCard>);
    const el = screen.getByText('Card').parentElement!;
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect);
    fireEvent.mouseMove(el, { clientX: 100, clientY: 50 });
    expect(el.style.transform).toContain('rotateY(4.00deg)');
    fireEvent.mouseLeave(el);
    expect(el.style.transform).toBe('');
  });

  it('stays still with reduced motion', () => {
    setMedia('(pointer: fine)', true);
    setMedia('(prefers-reduced-motion: reduce)', true);
    render(<TiltCard><p>Card</p></TiltCard>);
    const el = screen.getByText('Card').parentElement!;
    vi.spyOn(el, 'getBoundingClientRect').mockReturnValue(rect);
    fireEvent.mouseMove(el, { clientX: 100, clientY: 50 });
    expect(el.style.transform).toBe('');
  });
});
