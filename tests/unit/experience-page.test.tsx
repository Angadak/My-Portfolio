import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import ExperiencePage from '@/app/experience/page';

describe('Experience page', () => {
  it('shows every role with highlights, grouped skills and ClaimsToExcel', () => {
    render(<ExperiencePage />);
    expect(screen.getByRole('heading', { level: 1, name: /experience/i })).toBeInTheDocument();
    const timeline = screen.getByRole('list', { name: 'Roles' });
    expect(within(timeline).getAllByRole('listitem').length).toBeGreaterThanOrEqual(4);
    expect(screen.getByRole('heading', { level: 3, name: 'Backend' })).toBeInTheDocument();
    expect(screen.getAllByText(/ClaimsToExcel/).length).toBeGreaterThan(0);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});
