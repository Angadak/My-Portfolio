import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SkillRibbon } from '@/components/sections/skill-ribbon';
import { PageWipe } from '@/components/motion/page-wipe';
import { SpeedField } from '@/components/motion/speed-field';

const nav = vi.hoisted(() => ({ pathname: '/' }));
vi.mock('next/navigation', () => ({ usePathname: () => nav.pathname }));

describe('SkillRibbon', () => {
  it('is decorative and repeats the row for a seamless loop', () => {
    const { container } = render(<SkillRibbon items={['C#', 'Azure']} />);
    const ribbon = container.firstElementChild!;
    expect(ribbon).toHaveAttribute('aria-hidden');
    expect(container.textContent!.match(/Azure/g)).toHaveLength(2);
  });

  it('renders nothing without skills', () => {
    const { container } = render(<SkillRibbon items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('PageWipe', () => {
  it('stays out of the first paint and plays on a route change', () => {
    nav.pathname = '/';
    const { container, rerender } = render(<PageWipe />);
    expect(container.querySelector('.page-wipe')).toBeNull();
    nav.pathname = '/work';
    rerender(<PageWipe />);
    expect(container.querySelector('.page-wipe')).not.toBeNull();
    expect(container.firstElementChild).toHaveAttribute('aria-hidden');
  });
});

describe('SpeedField', () => {
  it('starts invisible and is hidden from assistive tech', () => {
    const { container } = render(<SpeedField />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden');
    expect(container.querySelector('[data-speed-field]')).toHaveClass('opacity-0');
  });
});
