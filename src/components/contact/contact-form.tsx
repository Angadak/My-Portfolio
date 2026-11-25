'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { sendContact } from '@/app/contact/actions';
import { contactSchema, validateContact, type ContactField, type ContactState, type FieldErrors } from '@/lib/contact';
import { toast } from '@/lib/events';
import { buttonClass } from '@/components/ui/button';
import { FootballIcon } from '@/components/football/football-icon';
import profileData from '@/content/settings/profile.json';

type Values = Record<ContactField, string>;

const EMPTY: Values = { name: '', email: '', message: '' };
const FIELDS: ContactField[] = ['name', 'email', 'message'];
const MESSAGE_MAX = 5000;

/** One-click openers for the message box. They only fill an empty box (or replace another opener). */
const FIRST_NAME = profileData.name.split(' ')[0];

export const TOPICS = [
  { label: 'Full-time role', text: `Hi ${FIRST_NAME}, we're hiring for a full-time role and I'd like to talk to you about it.` },
  { label: 'Contract work', text: `Hi ${FIRST_NAME}, I have a contract project and would like your help with it.` },
  { label: 'Project idea', text: `Hi ${FIRST_NAME}, I have a project idea and I'd like to know if you can build it.` },
  { label: 'Just saying hi', text: `Hi ${FIRST_NAME}, just wanted to say hello.` },
] as const;

function isValid(field: ContactField, value: string): boolean {
  return contactSchema.shape[field].safeParse(value).success;
}

export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<ContactState>({ status: 'idle' });
  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [pending, startTransition] = useTransition();
  const mountedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (state.fieldErrors) formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state.fieldErrors]);

  const valid = FIELDS.filter((f) => isValid(f, values[f]));
  const ready = valid.length === FIELDS.length;
  const errors: FieldErrors = state.fieldErrors ?? {};
  const topic = TOPICS.find((t) => t.text === values.message);

  function update(field: ContactField, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    // the field is being fixed: drop its old error so the red goes away as you type
    if (state.fieldErrors?.[field]) {
      setState((s) => ({ ...s, fieldErrors: { ...s.fieldErrors, [field]: undefined } }));
    }
    if (state.status === 'success') setState({ status: 'idle' });
  }

  function pickTopic(text: string) {
    const current = values.message.trim();
    if (current !== '' && !TOPICS.some((t) => t.text === current)) {
      toast('Your message is kept. Clear it to use an opener.');
      return;
    }
    update('message', text);
    const box = formRef.current?.querySelector<HTMLTextAreaElement>('#contact-message');
    box?.focus();
    box?.setSelectionRange(text.length, text.length);
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const local = validateContact({ name: values.name, email: values.email, message: values.message });
    if ('errors' in local) {
      setTouched({ name: true, email: true, message: true });
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
        setValues(EMPTY);
        setTouched({});
        mountedAt.current = Date.now();
        toast(result.message ?? 'Message sent');
      }
    });
  }

  return (
    <form ref={formRef} method="post" onSubmit={onSubmit} noValidate className="relative grid gap-6">
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <PassBar done={state.status === 'success' ? FIELDS.length : valid.length} total={FIELDS.length} scored={state.status === 'success'} />

      {state.status === 'success' && (
        <div role="status" className="relative overflow-hidden border-2 border-ink bg-accent/10 px-5 py-4">
          <p aria-hidden className="impact text-3xl [-webkit-text-stroke-width:5px]">
            GOAL!!
          </p>
          <p className="mt-1 font-semibold">{state.message ?? 'Message sent.'}</p>
          <p className="text-sm text-muted">I usually reply within a day or two.</p>
        </div>
      )}

      <Field
        step="01"
        name="name"
        label="Name"
        autoComplete="name"
        placeholder="Your name"
        value={values.name}
        onChange={(v) => update('name', v)}
        onBlur={() => setTouched((t) => ({ ...t, name: true }))}
        ok={!!touched.name && isValid('name', values.name)}
        error={errors.name}
      />
      <Field
        step="02"
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@company.com"
        value={values.email}
        onChange={(v) => update('email', v)}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        ok={!!touched.email && isValid('email', values.email)}
        error={errors.email}
      />

      <div>
        <p id="contact-topics" className="label mb-2 text-muted">
          Quick start
        </p>
        <div role="group" aria-labelledby="contact-topics" className="flex flex-wrap gap-2">
          {TOPICS.map((t) => {
            const on = topic?.label === t.label;
            return (
              <button
                key={t.label}
                type="button"
                aria-pressed={on}
                onClick={() => pickTopic(t.text)}
                className={`border-[1.5px] px-3 py-1.5 text-xs font-semibold transition hover:-translate-y-0.5 active:scale-95 ${
                  on ? 'border-ink bg-accent text-on-accent shadow-[2px_2px_0_0_var(--ink)]' : 'border-ink/40 bg-bg hover:border-ink hover:text-accent'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <Field
        step="03"
        name="message"
        label="Message"
        multiline
        placeholder="What are you working on, and how can I help?"
        value={values.message}
        onChange={(v) => update('message', v)}
        onBlur={() => setTouched((t) => ({ ...t, message: true }))}
        ok={!!touched.message && isValid('message', values.message)}
        error={errors.message}
        meta={
          <span className={values.message.length > MESSAGE_MAX ? 'text-danger' : ''}>
            {values.message.trim().length < 10 && values.message.length > 0
              ? `${10 - values.message.trim().length} more to go`
              : `${values.message.length.toLocaleString('en')} / ${MESSAGE_MAX.toLocaleString('en')}`}
          </span>
        }
      />

      {state.status === 'error' && state.message && (
        <p role="alert" className="border-l-4 border-danger pl-3 text-sm text-danger">
          {state.message} You can also email{' '}
          <a href={`mailto:${email}`} className="font-medium underline underline-offset-4">
            {email}
          </a>
          .
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={pending}
          data-ready={ready ? '' : undefined}
          className={buttonClass('primary', 'group disabled:opacity-70 data-[ready]:shadow-[5px_5px_0_0_var(--ink)]')}
        >
          <span className={`size-5 transition-transform duration-500 ${pending ? 'animate-spin' : 'group-hover:rotate-180'}`}>
            <FootballIcon className="size-full" />
          </span>
          {pending ? 'Sending…' : 'Send message'}
        </button>
        <p aria-hidden className="label text-muted">
          {ready ? 'Ready to shoot' : `${valid.length} / ${FIELDS.length} ready`}
        </p>
      </div>
    </form>
  );
}

/** Decorative progress: the ball moves toward the goal as each field becomes valid. */
function PassBar({ done, total, scored }: { done: number; total: number; scored: boolean }) {
  const pct = (done / total) * 100;
  return (
    <div aria-hidden className="relative pr-8">
      <div className="flex items-center justify-between">
        <span className="label font-bold text-accent">Pass request</span>
        <span className="label text-muted">
          {done}/{total}
        </span>
      </div>
      <div className="relative mt-3 h-2 border-[1.5px] border-ink bg-bg">
        <div className="h-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${pct}%` }} />
        {[1, 2].map((i) => (
          <span key={i} className="absolute top-1/2 h-3 w-[1.5px] -translate-y-1/2 bg-ink/50" style={{ left: `${(i / total) * 100}%` }} />
        ))}
        <span
          className="absolute top-1/2 size-7 -translate-x-1/2 -translate-y-1/2 transition-[left,transform] duration-500 ease-out"
          style={{ left: `${pct}%`, transform: `translate(-50%, -50%) rotate(${done * 240}deg)` }}
        >
          <FootballIcon className="size-full" />
        </span>
      </div>
      {/* goal mouth at the end of the bar */}
      <svg viewBox="0 0 24 28" className={`absolute -right-1 bottom-[-9px] w-6 transition ${scored ? 'text-accent' : 'text-ink'}`}>
        <path d="M2 27V2h20v25" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M7 2v25M12 2v25M17 2v25M2 9h20M2 16h20M2 23h20" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
      </svg>
    </div>
  );
}

type FieldProps = {
  step: string;
  name: ContactField;
  label: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  ok: boolean;
  error?: string;
  meta?: React.ReactNode;
};

function Field({ step, name, label, type = 'text', autoComplete, placeholder, multiline = false, value, onChange, onBlur, ok, error, meta }: FieldProps) {
  const id = `contact-${name}`;
  const errorId = `${id}-error`;
  const shared = {
    id,
    name,
    value,
    placeholder,
    onBlur,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    className:
      'peer w-full border-2 border-ink/40 bg-bg px-4 py-3 text-fg outline-none transition-[border-color,box-shadow,transform] duration-200 placeholder:text-muted/60 hover:border-ink focus:-translate-x-0.5 focus:-translate-y-0.5 focus:border-ink focus:shadow-[4px_4px_0_0_var(--accent)] aria-[invalid=true]:border-danger aria-[invalid=true]:shadow-[4px_4px_0_0_var(--danger)]',
  };
  return (
    <div className="group/field">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="flex items-baseline gap-2 text-sm font-semibold transition-colors group-focus-within/field:text-accent">
          <span aria-hidden className="font-mono text-[0.7rem] text-muted">
            {step}
          </span>
          {label}
        </label>
        <span className="flex items-center gap-2 font-mono text-[0.7rem] text-muted">
          {meta}
          <span
            aria-hidden
            className={`grid size-4 rotate-45 place-items-center border-[1.5px] transition duration-300 ${
              ok ? 'scale-100 border-ink bg-success' : 'scale-75 border-ink/30 bg-transparent'
            }`}
          >
            {ok && <span className="-rotate-45 text-[9px] font-bold leading-none text-white">✓</span>}
          </span>
        </span>
      </div>
      {multiline ? (
        <textarea {...shared} rows={6} onChange={(e) => onChange(e.target.value)} className={`${shared.className} min-h-36 resize-y`} />
      ) : (
        <input {...shared} type={type} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
