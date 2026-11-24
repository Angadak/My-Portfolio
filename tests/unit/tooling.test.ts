import { describe, expect, it } from 'vitest';
import { setMedia } from '../helpers/media';

describe('test tooling', () => {
  it('fakes matchMedia per query', () => {
    expect(window.matchMedia('(pointer: fine)').matches).toBe(false);
    setMedia('(pointer: fine)', true);
    expect(window.matchMedia('(pointer: fine)').matches).toBe(true);
  });
});
