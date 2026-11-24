import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryBar } from '@/components/work/summary-bar';
import { Results } from '@/components/work/results';

describe('SummaryBar', () => {
  it('lists client, role, team, period and stack', () => {
    render(
      <SummaryBar client="Acme" role="Engineer" teamSize="5" period="2025 – 2026" stack={['C#', 'Svelte 5']} />,
    );
    expect(screen.getByText('Acme')).toBeInTheDocument();
    expect(screen.getByText('Engineer')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('Svelte 5')).toBeInTheDocument();
  });
});

describe('Results', () => {
  it('renders nothing without metrics', () => {
    const { container } = render(<Results metrics={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
  it('renders a heading and each metric', () => {
    render(<Results metrics={[{ value: '40%', label: 'faster month-end' }]} />);
    expect(screen.getByRole('heading', { name: 'Results' })).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
  });
});
