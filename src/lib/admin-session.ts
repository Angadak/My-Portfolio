import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Password login for the content admin (/keystatic).
 * The password comes from ADMIN_PASSWORD (12+ characters). A successful login sets a signed,
 * httpOnly cookie that expires after SESSION_HOURS. The signing key is derived from the password
 * (or ADMIN_SESSION_SECRET if set), so changing the password signs everyone out.
 */
export const SESSION_COOKIE = 'admin_session';
export const SESSION_HOURS = 12;
export const MIN_PASSWORD_LENGTH = 12;

type Env = Record<string, string | undefined>;

export function passwordConfigured(env: Env = process.env): boolean {
  return (env.ADMIN_PASSWORD ?? '').length >= MIN_PASSWORD_LENGTH;
}

function signingKey(env: Env): Buffer {
  const base = env.ADMIN_SESSION_SECRET || `portfolio-admin:${env.ADMIN_PASSWORD ?? ''}`;
  return createHash('sha256').update(base).digest();
}

function sign(payload: string, env: Env): string {
  return createHmac('sha256', signingKey(env)).update(payload).digest('base64url');
}

function sameText(a: string, b: string): boolean {
  // hash first so lengths match and the comparison takes the same time either way
  const x = createHash('sha256').update(a).digest();
  const y = createHash('sha256').update(b).digest();
  return timingSafeEqual(x, y);
}

export function checkPassword(input: string, env: Env = process.env): boolean {
  if (!passwordConfigured(env)) return false;
  return sameText(input, env.ADMIN_PASSWORD!);
}

/** Token = "<expiry ms>.<signature>". */
export function createSessionToken(now: number = Date.now(), env: Env = process.env): string {
  const expires = String(now + SESSION_HOURS * 60 * 60 * 1000);
  return `${expires}.${sign(expires, env)}`;
}

export function verifySessionToken(token: string | undefined, now: number = Date.now(), env: Env = process.env): boolean {
  if (!token || !passwordConfigured(env)) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const expires = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  if (!/^\d+$/.test(expires) || Number(expires) <= now) return false;
  return sameText(signature, sign(expires, env));
}

export function sessionCookieOptions(env: Env = process.env) {
  return {
    httpOnly: true,
    // lax (not strict) so the cookie survives the redirect back from GitHub login in GitHub mode
    sameSite: 'lax' as const,
    secure: env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_HOURS * 60 * 60,
  };
}

/** Only allow returning to admin pages after login (no open redirects). */
export function safeNext(next: unknown): string {
  return typeof next === 'string' && /^\/keystatic(\/[\w\-/.]*)?$/.test(next) ? next : '/keystatic';
}

/** Simple per-IP limit on wrong passwords: 5 tries per 15 minutes (per server instance). */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;
const failures = new Map<string, { count: number; since: number }>();

export function isLockedOut(ip: string, now: number = Date.now()): boolean {
  const entry = failures.get(ip);
  if (!entry || now - entry.since > WINDOW_MS) return false;
  return entry.count >= MAX_FAILURES;
}

export function recordFailure(ip: string, now: number = Date.now()): void {
  const entry = failures.get(ip);
  if (!entry || now - entry.since > WINDOW_MS) failures.set(ip, { count: 1, since: now });
  else entry.count += 1;
}

export function clearFailures(ip: string): void {
  failures.delete(ip);
}
