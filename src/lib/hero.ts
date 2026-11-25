import type { PropName } from '@/components/props/props';
import { siteCopy } from '@/data/site';

export type HeroWord = { word: string; prop: PropName; caption: string };

export const AUTO_ADVANCE_MS = 4000;

/** Hero words come from the admin panel (site copy). `{years}` in a caption becomes e.g. "4.5+ years". */
export function heroWords(years: string, words: HeroWord[] = siteCopy.heroWords): HeroWord[] {
  return words.map((w) => ({ ...w, caption: w.caption.replaceAll('{years}', years) }));
}

export function cycle(index: number, length: number, step: 1 | -1): number {
  if (length <= 0) return 0;
  return (index + step + length) % length;
}
