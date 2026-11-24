import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Mdx } from '@/components/mdx/mdx';

describe('Mdx', () => {
  it('renders markdown, GFM tables and custom components', async () => {
    const source = [
      '## Problem',
      '',
      '| a | b |',
      '|---|---|',
      '| 1 | 2 |',
      '',
      '<Callout title="Note">Hello callout</Callout>',
    ].join('\n');
    render(await Mdx({ source }));
    expect(screen.getByRole('heading', { level: 2, name: 'Problem' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Hello callout')).toBeInTheDocument();
    expect(screen.getByText('Note')).toBeInTheDocument();
  }, 30_000);

  it('highlights code blocks', async () => {
    render(await Mdx({ source: '```ts\nconst a = 1;\n```' }));
    expect(document.querySelector('pre.shiki')).not.toBeNull();
  });
});
