import { describe, expect, it } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { BallRail } from '@/components/football/ball-rail';
import { renderToString } from 'react-dom/server';
import { MockIntersectionObserver, setMedia } from '../helpers/media';
import type { RailSection } from '@/lib/sections';

const sections: RailSection[] = [
  { key: 'work', id: 'featured-work', label: 'Work' },
  { key: 'experience', id: 'experience-snapshot', label: 'Experience' },
  { key: 'contact', id: 'contact-cta', label: 'Contact' },
];

function page() {
  return (
    <main>
      {sections.map((s) => (
        <section key={s.id} aria-labelledby={s.id}>
          <h2 id={s.id} tabIndex={-1}>
            {s.label}
          </h2>
        </section>
      ))}
    </main>
  );
}

describe('BallRail', () => {
  it('renders one labelled link per section, contact as the goal', () => {
    render(<BallRail sections={sections} />);
    const nav = screen.getByRole('navigation', { name: 'Sections' });
    expect(nav).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Go to Work' })).toHaveAttribute('href', '#featured-work');
    expect(screen.getByRole('link', { name: 'Go to Experience' })).toHaveAttribute('href', '#experience-snapshot');
    expect(screen.getByRole('link', { name: 'Go to Contact' })).toHaveAttribute('href', '#contact-cta');
  });

  it('scrolls the section into view and focuses its heading', () => {
    render(
      <>
        {page()}
        <BallRail sections={sections} />
      </>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Go to Experience' }));
    const heading = screen.getByRole('heading', { name: 'Experience' });
    expect(heading.closest('section')!.scrollIntoView).toHaveBeenCalled();
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(heading).toHaveFocus();
  });

  it('marks the section in view', () => {
    render(
      <>
        {page()}
        <BallRail sections={sections} />
      </>,
    );
    const observer = MockIntersectionObserver.instances.at(-1)!;
    const section = screen.getByRole('heading', { name: 'Work' }).closest('section')!;
    act(() => observer.trigger(true, section));
    expect(screen.getByRole('link', { name: 'Go to Work' })).toHaveAttribute('aria-current', 'true');
    expect(screen.getByRole('link', { name: 'Go to Experience' })).not.toHaveAttribute('aria-current');
  });

  it('scrolls instantly when reduced motion is preferred', () => {
    setMedia('(prefers-reduced-motion: reduce)', true);
    render(
      <>
        {page()}
        <BallRail sections={sections} />
      </>,
    );
    fireEvent.click(screen.getByRole('link', { name: 'Go to Experience' }));
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' });
  });

  it('server HTML leaves the rail usable without JS', () => {
    expect(renderToString(<BallRail sections={sections} />)).not.toContain('inert');
  });

  it('is inert until half a screen has scrolled', () => {
    const { unmount } = render(<BallRail sections={sections} />);
    expect(screen.getByRole('navigation', { hidden: true })).toHaveAttribute('inert');
    unmount();
    const original = Object.getOwnPropertyDescriptor(window, 'scrollY')!;
    Object.defineProperty(window, 'scrollY', { configurable: true, value: window.innerHeight });
    try {
      render(<BallRail sections={sections} />);
      const nav = screen.getByRole('navigation', { name: 'Sections' });
      expect(nav).toHaveAttribute('data-visible');
      expect(nav).not.toHaveAttribute('inert');
    } finally {
      Object.defineProperty(window, 'scrollY', original);
    }
  });
});
