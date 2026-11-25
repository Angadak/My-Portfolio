'use client';

import { useActionState, useState } from 'react';
import { login, type LoginState } from './actions';

const svg = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

function LockIcon({ className }: { className?: string }) {
  return (
    <svg {...svg} aria-hidden className={className}>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}
function EyeIcon({ off, className }: { off: boolean; className?: string }) {
  return (
    <svg {...svg} aria-hidden className={className}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
      {off && <path d="M3 3l18 18" />}
    </svg>
  );
}

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  const [show, setShow] = useState(false);
  const [capsLock, setCapsLock] = useState(false);

  function onKey(event: React.KeyboardEvent<HTMLInputElement>) {
    setCapsLock(event.getModifierState?.('CapsLock') ?? false);
  }

  const invalid = !!state.error;
  return (
    <form action={action} className="grid gap-6">
      <input type="hidden" name="next" value={next} />

      <div>
        <label htmlFor="admin-password" className="mb-2 block text-sm font-semibold">
          Password
        </label>
        {/* one box: lock icon, input and show/hide toggle; the whole box takes the focus style */}
        <div
          data-invalid={invalid ? '' : undefined}
          className="flex items-center border-2 border-ink/40 bg-bg transition-[border-color,box-shadow] duration-200 focus-within:border-ink focus-within:shadow-[4px_4px_0_0_var(--accent)] data-[invalid]:border-danger data-[invalid]:shadow-[4px_4px_0_0_var(--danger)]"
        >
          <LockIcon className="ml-3.5 size-4 shrink-0 text-muted" />
          <input
            id="admin-password"
            name="password"
            type={show ? 'text' : 'password'}
            autoComplete="current-password"
            required
            autoFocus
            onKeyUp={onKey}
            onKeyDown={onKey}
            aria-invalid={invalid || undefined}
            aria-describedby={invalid ? 'admin-login-error' : 'admin-login-hint'}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-fg outline-none placeholder:text-muted/60 focus-visible:outline-none"
            placeholder="Your admin password"
          />
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
            className="mr-1.5 grid size-9 shrink-0 place-items-center text-muted transition hover:text-accent focus-visible:text-accent focus-visible:outline-2 focus-visible:outline-offset-0"
          >
            <EyeIcon off={show} className="size-[18px]" />
          </button>
        </div>
        <p id="admin-login-hint" className="mt-2 min-h-5 text-xs text-muted">
          {capsLock ? <span className="font-semibold text-danger">Caps Lock is on.</span> : 'Set with ADMIN_PASSWORD in your environment file.'}
        </p>
      </div>

      {state.error && (
        <p id="admin-login-error" role="alert" className="-mt-3 border-l-4 border-danger bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 border-2 border-ink bg-accent text-sm font-bold uppercase tracking-[0.12em] text-on-accent shadow-[3px_3px_0_0_var(--ink)] transition-[transform,box-shadow] duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_var(--ink)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-70"
      >
        {pending && <span aria-hidden className="size-4 animate-spin rounded-full border-2 border-on-accent border-t-transparent" />}
        {pending ? 'Checking…' : 'Sign in'}
      </button>
    </form>
  );
}
