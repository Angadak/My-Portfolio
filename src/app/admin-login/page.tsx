import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { adminEnabled } from '@/lib/admin';
import { passwordConfigured, safeNext } from '@/lib/admin-session';
import { PageHeading } from '@/components/ui/page-heading';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (!adminEnabled()) notFound();
  const { next } = await searchParams;
  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-8">
      <PageHeading kicker="Content admin" title="Sign in" />
      <p className="mt-4 text-muted">Edit your profile, CV, jobs, skills and case studies.</p>
      <div className="panel mt-8 p-6 sm:p-8">
        {passwordConfigured() ? (
          <LoginForm next={safeNext(next)} />
        ) : (
          <div role="alert" className="space-y-3 text-sm">
            <p className="font-bold text-danger">The admin is locked: no password is set.</p>
            <p>
              Add <code className="font-mono text-accent">ADMIN_PASSWORD=your-long-password</code> (12+ characters) to{' '}
              <code className="font-mono">.env.local</code> for your computer, or to the Vercel environment variables for the live site, then restart.
            </p>
          </div>
        )}
      </div>
      <p className="mt-6 text-center text-xs text-muted">You stay signed in for 12 hours on this browser.</p>
    </div>
  );
}
