import type { PropName } from '@/components/props/props';

export type HeroWord = { word: string; prop: PropName; caption: string };

export const AUTO_ADVANCE_MS = 4000;

export function heroWords(years: string): HeroWord[] {
  return [
    { word: 'BACKEND', prop: 'database', caption: 'C# · ASP.NET Core · EF Core · SQL Server' },
    { word: 'FRONTEND', prop: 'browser', caption: 'TypeScript · Svelte 5 · React' },
    { word: 'APIs', prop: 'api', caption: 'REST · auth · integrations' },
    { word: 'CLOUD', prop: 'cloud', caption: 'Azure · Docker · CI/CD' },
    { word: 'SHIPPING', prop: 'mug', caption: `${years} of production work` },
  ];
}

export function cycle(index: number, length: number, step: 1 | -1): number {
  if (length <= 0) return 0;
  return (index + step + length) % length;
}
