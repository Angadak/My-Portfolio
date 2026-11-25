import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CaseStudySketch, SKETCH_SLUGS } from '@/components/work/case-study-sketch';

describe('CaseStudySketch', () => {
  it('renders a decorative sketch for every known slug', () => {
    for (const slug of SKETCH_SLUGS) {
      const { container, unmount } = render(<CaseStudySketch slug={slug} />);
      const svg = container.querySelector('svg')!;
      expect(svg).toHaveAttribute('aria-hidden', 'true');
      expect(svg).toHaveAttribute('data-sketch', slug);
      unmount();
    }
  });
  it('falls back to a browser frame for unknown slugs', () => {
    const { container } = render(<CaseStudySketch slug="something-new" />);
    expect(container.querySelector('svg')).toHaveAttribute('data-sketch', 'generic');
  });
});
