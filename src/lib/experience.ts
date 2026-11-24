const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseMonth(value: string): { year: number; month: number } {
  const [year, month] = value.split('-').map(Number);
  return { year, month };
}

/** Whole months between `careerStart` (YYYY-MM) and `now`, rounded down to 0.5 years. */
export function yearsOfExperience(careerStart: string, now: Date = new Date()): number {
  const { year, month } = parseMonth(careerStart);
  const months = (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
  return Math.max(0, Math.floor(months / 6) / 2);
}

export function formatYears(years: number): string {
  return `${Number.isInteger(years) ? years.toFixed(0) : years.toFixed(1)}+ years`;
}

export function formatMonth(value: string): string {
  const { year, month } = parseMonth(value);
  return `${MONTHS[month - 1]} ${year}`;
}

export function formatPeriod(start: string, end?: string): string {
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'Present'}`;
}
