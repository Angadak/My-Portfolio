import { describe, expect, it } from 'vitest';
import { AUTO_ADVANCE_MS, cycle, heroWords } from '@/lib/hero';

describe('heroWords', () => {
  it('lists the five words in order with props', () => {
    const words = heroWords('4.5+ years');
    expect(words.map((w) => [w.word, w.prop])).toEqual([
      ['BACKEND', 'database'],
      ['FRONTEND', 'browser'],
      ['APIs', 'api'],
      ['CLOUD', 'cloud'],
      ['SHIPPING', 'mug'],
    ]);
    expect(words[4].caption).toBe('4.5+ years of production work');
  });
});

describe('cycle', () => {
  it('wraps both ways', () => {
    expect(cycle(4, 5, 1)).toBe(0);
    expect(cycle(0, 5, -1)).toBe(4);
    expect(cycle(2, 5, 1)).toBe(3);
  });
  it('is safe for empty lists', () => {
    expect(cycle(0, 0, 1)).toBe(0);
  });
});

it('auto-advances every 4 seconds', () => {
  expect(AUTO_ADVANCE_MS).toBe(4000);
});
