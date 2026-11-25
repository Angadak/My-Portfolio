import { describe, expect, it } from 'vitest';
import { NextRequest } from 'next/server';
import {
  SESSION_COOKIE,
  checkPassword,
  clearFailures,
  createSessionToken,
  isLockedOut,
  passwordConfigured,
  recordFailure,
  safeNext,
  sessionCookieOptions,
  verifySessionToken,
} from '@/lib/admin-session';

const env = { ADMIN_PASSWORD: 'correct horse battery', NODE_ENV: 'development' };
const now = Date.UTC(2026, 10, 25);

describe('admin password', () => {
  it('needs 12+ characters before the admin can be unlocked', () => {
    expect(passwordConfigured({})).toBe(false);
    expect(passwordConfigured({ ADMIN_PASSWORD: 'short' })).toBe(false);
    expect(passwordConfigured(env)).toBe(true);
  });

  it('accepts only the exact password', () => {
    expect(checkPassword('correct horse battery', env)).toBe(true);
    expect(checkPassword('correct horse batter', env)).toBe(false);
    expect(checkPassword('', env)).toBe(false);
    expect(checkPassword('anything', {})).toBe(false);
  });
});

describe('admin session token', () => {
  it('is valid until it expires', () => {
    const token = createSessionToken(now, env);
    expect(verifySessionToken(token, now + 1000, env)).toBe(true);
    expect(verifySessionToken(token, now + 13 * 60 * 60 * 1000, env)).toBe(false);
  });

  it('rejects tampering, junk and tokens signed before a password change', () => {
    const token = createSessionToken(now, env);
    const [exp, sig] = token.split('.');
    expect(verifySessionToken(`${Number(exp) + 999999}.${sig}`, now, env)).toBe(false);
    expect(verifySessionToken('junk', now, env)).toBe(false);
    expect(verifySessionToken(undefined, now, env)).toBe(false);
    expect(verifySessionToken(token, now, { ...env, ADMIN_PASSWORD: 'a different long password' })).toBe(false);
    expect(verifySessionToken(token, now, {})).toBe(false);
  });

  it('cookie is httpOnly, lax, and secure in production', () => {
    expect(sessionCookieOptions(env)).toMatchObject({ httpOnly: true, sameSite: 'lax', secure: false, path: '/' });
    expect(sessionCookieOptions({ NODE_ENV: 'production' }).secure).toBe(true);
  });
});

describe('after login redirect', () => {
  it('only returns to admin pages', () => {
    expect(safeNext('/keystatic/singleton/skills')).toBe('/keystatic/singleton/skills');
    expect(safeNext('https://evil.example')).toBe('/keystatic');
    expect(safeNext('//evil.example')).toBe('/keystatic');
    expect(safeNext('/keystatic/../../x?y')).toBe('/keystatic');
    expect(safeNext(undefined)).toBe('/keystatic');
  });
});

describe('wrong-password limit', () => {
  it('locks an IP after 5 failures for 15 minutes', () => {
    const ip = '203.0.113.9';
    for (let i = 0; i < 5; i++) recordFailure(ip, now);
    expect(isLockedOut(ip, now + 1000)).toBe(true);
    expect(isLockedOut(ip, now + 16 * 60 * 1000)).toBe(false);
    clearFailures(ip);
    expect(isLockedOut(ip, now)).toBe(false);
  });
});

describe('proxy gate', () => {
  async function run(path: string, cookie?: string, extraEnv: Record<string, string> = {}) {
    const saved = { ...process.env };
    Object.assign(process.env, { NODE_ENV: 'development', ADMIN_PASSWORD: env.ADMIN_PASSWORD }, extraEnv);
    try {
      const { proxy } = await import('@/proxy');
      const req = new NextRequest(new URL(path, 'http://localhost:3000'), cookie ? { headers: { cookie } } : undefined);
      return proxy(req);
    } finally {
      process.env = saved;
    }
  }

  it('sends visitors without a login to the sign-in page', async () => {
    const res = await run('/keystatic/singleton/skills');
    expect(res.status).toBe(307);
    expect(res.headers.get('location')).toBe('http://localhost:3000/admin-login?next=%2Fkeystatic%2Fsingleton%2Fskills');
  });

  it('refuses admin API calls without a login', async () => {
    const res = await run('/api/keystatic/update');
    expect(res.status).toBe(401);
  });

  it('lets a signed-in session through', async () => {
    const token = createSessionToken(Date.now(), env);
    const res = await run('/api/keystatic/update', `${SESSION_COOKIE}=${token}`);
    expect(res.headers.get('x-middleware-next')).toBe('1');
  });
});
