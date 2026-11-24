'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { sendContact } from '@/app/contact/actions';
import { validateContact, type ContactState, type FieldErrors } from '@/lib/contact';
import { toast } from '@/lib/events';
import { buttonClass } from '@/components/ui/button';

export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<ContactState>({ status: 'idle' });
  const [pending, startTransition] = useTransition();
  const mountedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (state.fieldErrors) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state.fieldErrors]);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const local = validateContact({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });
    if ('errors' in local) {
      setState({ status: 'error', message: 'Check the highlighted fields.', fieldErrors: local.errors });
      return;
    }
    data.set('elapsedMs', String(Date.now() - mountedAt.current));
    startTransition(async () => {
      let result: ContactState;
      try {
        result = await sendContact(data);
      } catch {
        result = { status: 'error', message: "Your message couldn't be sent." };
      }
      setState(result);
      if (result.status === 'success') {
        form.reset();
        mountedAt.current = Date.now();
        toast(result.message ?? 'Message sent');
      }
    });
  }

  const errors: FieldErrors = state.fieldErrors ?? {};

  return (
    <form ref={formRef} method="post" onSubmit={onSubmit} noValidate className="relative grid gap-5">
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <Field name="name" label="Name" autoComplete="name" error={errors.name} />
      <Field name="email" label="Email" type="email" autoComplete="email" error={errors.email} />
      <Field name="message" label="Message" multiline error={errors.message} />
      {state.status === 'error' && state.message && (
        <p role="alert" className="text-sm text-danger">
          {state.message} You can also email{' '}
          <a href={`mailto:${email}`} className="font-medium underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      )}
      <div>
        <button type="submit" disabled={pending} className={buttonClass('primary', 'disabled:opacity-60')}>
          {pending ? 'Sending…' : 'Send message'}
        </button>
      </div>
    </form>
  );
}

type FieldProps = {
  name: string;
  label: string;
  type?: string;
  autoComplete?: string;
  multiline?: boolean;
  error?: string;
};

function Field({ name, label, type = 'text', autoComplete, multiline = false, error }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className:
      'w-full rounded-xl border border-line bg-bg px-4 py-3 text-fg outline-none transition focus:border-accent aria-[invalid=true]:border-danger',
  };
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {multiline ? <textarea {...shared} rows={6} /> : <input {...shared} type={type} autoComplete={autoComplete} />}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
