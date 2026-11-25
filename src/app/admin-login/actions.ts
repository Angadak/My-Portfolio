'use server';

import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminEnabled } from '@/lib/admin';
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
} from '@/lib/admin-session';

export type LoginState = { error?: string };

const FAIL_DELAY_MS = 800;

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'local';
}

export async function login(_prev: LoginState, form: FormData): Promise<LoginState> {
  if (!adminEnabled()) return { error: 'The admin panel is switched off on this site.' };
  if (!passwordConfigured()) {
    return { error: 'No admin password is set. Add ADMIN_PASSWORD (12+ characters) to your environment, then restart.' };
  }
  const ip = await clientIp();
  if (isLockedOut(ip)) return { error: 'Too many wrong passwords. Try again in 15 minutes.' };

  const password = String(form.get('password') ?? '');
  if (!checkPassword(password)) {
    recordFailure(ip);
    await new Promise((r) => setTimeout(r, FAIL_DELAY_MS));
    return { error: 'Wrong password.' };
  }
  clearFailures(ip);
  (await cookies()).set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions());
  redirect(safeNext(form.get('next')));
}

export async function logout(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/');
}
