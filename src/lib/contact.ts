import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(100, 'Keep your name under 100 characters'),
  email: z.string().trim().pipe(z.email('Enter a valid email address')),
  message: z.string().trim().min(10, 'Write at least 10 characters').max(5000, 'Keep it under 5,000 characters'),
});

export type ContactInput = z.output<typeof contactSchema>;
export type ContactField = keyof ContactInput;
export type FieldErrors = Partial<Record<ContactField, string>>;
export type ContactState = { status: 'idle' | 'success' | 'error'; message?: string; fieldErrors?: FieldErrors };
export type Sender = (input: ContactInput) => Promise<void>;

export const MIN_FILL_MS = 3000;
export const SUCCESS_MESSAGE = 'Thanks, your message is on its way.';

const FIELDS: ContactField[] = ['name', 'email', 'message'];

export function validateContact(input: Record<string, unknown>): { data: ContactInput } | { errors: FieldErrors } {
  const parsed = contactSchema.safeParse(input);
  if (parsed.success) return { data: parsed.data };
  const errors: FieldErrors = {};
  for (const issue of parsed.error.issues) {
    const key = issue.path[0];
    if (FIELDS.includes(key as ContactField) && !errors[key as ContactField]) {
      errors[key as ContactField] = issue.message;
    }
  }
  return { errors };
}

function field(form: FormData, name: string): string {
  return String(form.get(name) ?? '');
}

export async function handleContact(form: FormData, send: Sender): Promise<ContactState> {
  if (field(form, 'company').trim() !== '') return { status: 'success', message: SUCCESS_MESSAGE };

  const elapsed = Number(form.get('elapsedMs'));
  if (!Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return { status: 'error', message: 'That was quick. Wait a few seconds and send again.' };
  }

  const result = validateContact({ name: field(form, 'name'), email: field(form, 'email'), message: field(form, 'message') });
  if ('errors' in result) {
    return { status: 'error', message: 'Check the highlighted fields.', fieldErrors: result.errors };
  }

  try {
    await send(result.data);
    return { status: 'success', message: SUCCESS_MESSAGE };
  } catch {
    return { status: 'error', message: "Your message couldn't be sent." };
  }
}
