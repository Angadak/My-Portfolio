import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config';
import { adminEnabled } from '@/lib/admin';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session';

const handler = makeRouteHandler({ config });

function sessionFrom(request: Request): string | undefined {
  const cookie = request.headers.get('cookie') ?? '';
  const match = cookie.split(/;\s*/).find((part) => part.startsWith(`${SESSION_COOKIE}=`));
  return match ? decodeURIComponent(match.slice(SESSION_COOKIE.length + 1)) : undefined;
}

/** Checked here as well as in src/proxy.ts, so a matcher change can never expose saving. */
function guard(run: (request: Request) => Promise<Response>) {
  return (request: Request) => {
    if (!adminEnabled()) return Promise.resolve(new Response('Not found', { status: 404 }));
    if (!verifySessionToken(sessionFrom(request))) {
      return Promise.resolve(Response.json({ error: 'Sign in to the admin first.' }, { status: 401 }));
    }
    return run(request);
  };
}

export const GET = guard(handler.GET);
export const POST = guard(handler.POST);
