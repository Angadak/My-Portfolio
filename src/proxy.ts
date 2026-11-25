import { NextResponse, type NextRequest } from 'next/server';
import { adminEnabled } from '@/lib/admin';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session';

/**
 * Gate for the content admin. Every /keystatic page and /api/keystatic request needs a valid
 * login cookie. The admin layout and API route check the session again (defence in depth).
 */
export function proxy(request: NextRequest) {
  if (!adminEnabled()) return new NextResponse('Not found', { status: 404 });
  if (verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value)) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Sign in to the admin first.' }, { status: 401 });
  }
  const login = new URL('/admin-login', request.url);
  login.searchParams.set('next', pathname + search);
  return NextResponse.redirect(login);
}

export const config = {
  matcher: ['/keystatic', '/keystatic/:path*', '/api/keystatic/:path*'],
};
