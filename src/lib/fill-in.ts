export const FILL_IN = /\[fill-in[^\]]*\]/i;

type Env = Record<string, string | undefined>;

export function isStrictContent(env: Env = process.env): boolean {
  return env.CONTENT_STRICT === '1' || env.VERCEL_ENV === 'production';
}

export function findFillIns(value: unknown, path = ''): string[] {
  if (typeof value === 'string') return FILL_IN.test(value) ? [path || '(root)'] : [];
  if (Array.isArray(value)) {
    return value.flatMap((item, i) => findFillIns(item, path ? `${path}.${i}` : String(i)));
  }
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.entries(value).flatMap(([key, item]) => findFillIns(item, path ? `${path}.${key}` : key));
  }
  return [];
}

/** Throws in strict mode (production) if any `[fill-in…]` marker is left in the value. */
export function guardFillIns<T>(value: T, where: string, strict: boolean = isStrictContent()): T {
  const hits = findFillIns(value);
  if (strict && hits.length > 0) {
    throw new Error(`Unfinished content in ${where}: ${hits.join(', ')}`);
  }
  return value;
}
