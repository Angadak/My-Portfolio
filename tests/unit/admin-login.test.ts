import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session';

const jar = vi.hoisted(() => ({ set: vi.fn(), delete: vi.fn() }));
const nav = vi.hoisted(() => ({
  redirect: vi.fn((to: string) => {
    throw new Error(`REDIRECT:${to}`);
  }),
}));
vi.mock('next/headers', () => ({
  cookies: async () => jar,
  headers: async () => new Headers({ 'x-forwarded-for': '198.51.100.7' }),
}));
vi.mock('next/navigation', () => ({ redirect: nav.redirect }));

const saved = { ...process.env };
beforeEach(() => {
  Object.assign(process.env, { NODE_ENV: 'development', ADMIN_PASSWORD: 'correct horse battery' });
  jar.set.mockClear();
  nav.redirect.mockClear();
});
afterEach(() => {
  process.env = { ...saved };
});

function form(password: string, next = '/keystatic/singleton/skills') {
  const f = new FormData();
  f.set('password', password);
  f.set('next', next);
  return f;
}

describe('admin login action', () => {
  it('signs in with the right password: sets a valid cookie and returns to the admin page', async () => {
    const { login } = await import('@/app/admin-login/actions');
    await expect(login({}, form('correct horse battery'))).rejects.toThrow('REDIRECT:/keystatic/singleton/skills');
    const [name, token, options] = jar.set.mock.calls[0];
    expect(name).toBe(SESSION_COOKIE);
    expect(verifySessionToken(token)).toBe(true);
    expect(options).toMatchObject({ httpOnly: true });
  });

  it('refuses a wrong password without setting a cookie', async () => {
    const { login } = await import('@/app/admin-login/actions');
    expect(await login({}, form('wrong'))).toEqual({ error: 'Wrong password.' });
    expect(jar.set).not.toHaveBeenCalled();
  });

  it('stays locked when no password is configured', async () => {
    delete process.env.ADMIN_PASSWORD;
    const { login } = await import('@/app/admin-login/actions');
    const result = await login({}, form(''));
    expect(result.error).toMatch(/No admin password is set/);
    expect(jar.set).not.toHaveBeenCalled();
  });

  it('never redirects off-site after login', async () => {
    const { login } = await import('@/app/admin-login/actions');
    await expect(login({}, form('correct horse battery', 'https://evil.example'))).rejects.toThrow('REDIRECT:/keystatic');
  });
});
