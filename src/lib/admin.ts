/**
 * The content admin (/keystatic) is available while developing locally, or on the live site only
 * when GitHub mode is switched on (then GitHub login protects it). Otherwise it does not exist.
 */
export function adminEnabled(env: Record<string, string | undefined> = process.env): boolean {
  return env.NODE_ENV === 'development' || env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github';
}
