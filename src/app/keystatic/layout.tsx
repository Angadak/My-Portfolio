import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { adminEnabled } from '@/lib/admin';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session';
import { githubStorage } from '../../../keystatic.config';
import { AdminToolbar } from './admin-toolbar';
import KeystaticApp from './keystatic';

export const metadata: Metadata = {
  title: 'Content admin',
  robots: { index: false, follow: false },
};

/**
 * Full-screen layer so the admin looks like its own app: our toolbar on top, Keystatic below.
 * No z-index on the layer on purpose: Keystatic opens dialogs and menus in popups that must paint
 * above it. The site's own fixed buttons and menus are hidden on admin pages (globals.css, [data-keystatic-admin]).
 */
export default async function KeystaticLayout() {
  if (!adminEnabled()) notFound();
  // also checked in src/proxy.ts; repeated here so the page never renders without a login
  if (!verifySessionToken((await cookies()).get(SESSION_COOKIE)?.value)) redirect('/admin-login');
  return (
    <div data-keystatic-admin className="fixed inset-0 flex flex-col bg-[#1f1f1f] [font-synthesis:initial]">
      <AdminToolbar mode={githubStorage ? 'github' : 'local'} />
      <div className="relative min-h-0 flex-1 overflow-auto">
        <KeystaticApp />
      </div>
    </div>
  );
}
