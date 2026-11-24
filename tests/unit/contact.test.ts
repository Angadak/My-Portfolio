import { describe, expect, it, vi } from 'vitest';
import { handleContact, MIN_FILL_MS, SUCCESS_MESSAGE, validateContact } from '@/lib/contact';
import { emailSubject, getSender } from '@/lib/senders';

function form(values: Record<string, string>): FormData {
  const data = new FormData();
  for (const [k, v] of Object.entries(values)) data.set(k, v);
  return data;
}

const valid = { name: 'Sam Lee', email: 'sam@example.com', message: 'We would like to talk about a role.', elapsedMs: String(MIN_FILL_MS + 1) };

describe('validateContact', () => {
  it('returns friendly field errors', () => {
    const result = validateContact({ name: '', email: 'nope', message: 'short' });
    expect(result).toEqual({
      errors: {
        name: 'Enter your name',
        email: 'Enter a valid email address',
        message: 'Write at least 10 characters',
      },
    });
  });
  it('trims input', () => {
    expect(validateContact({ name: '  Sam  ', email: ' sam@example.com ', message: '  long enough message  ' })).toEqual({
      data: { name: 'Sam', email: 'sam@example.com', message: 'long enough message' },
    });
  });
});

describe('handleContact', () => {
  it('silently accepts honeypot submissions without sending', async () => {
    const send = vi.fn();
    const result = await handleContact(form({ ...valid, company: 'Spam Inc' }), send);
    expect(result.status).toBe('success');
    expect(send).not.toHaveBeenCalled();
  });

  it('rejects forms submitted too fast', async () => {
    const send = vi.fn();
    const result = await handleContact(form({ ...valid, elapsedMs: '200' }), send);
    expect(result.status).toBe('error');
    expect(send).not.toHaveBeenCalled();
  });

  it('returns field errors for invalid input', async () => {
    const result = await handleContact(form({ ...valid, email: 'bad' }), vi.fn());
    expect(result.fieldErrors?.email).toBe('Enter a valid email address');
  });

  it('sends valid messages', async () => {
    const send = vi.fn().mockResolvedValue(undefined);
    const result = await handleContact(form(valid), send);
    expect(send).toHaveBeenCalledWith({ name: 'Sam Lee', email: 'sam@example.com', message: 'We would like to talk about a role.' });
    expect(result).toEqual({ status: 'success', message: SUCCESS_MESSAGE });
  });

  it('reports sender failures instead of failing silently', async () => {
    const result = await handleContact(form(valid), vi.fn().mockRejectedValue(new Error('down')));
    expect(result.status).toBe('error');
    expect(result.message).toMatch(/couldn't be sent/);
  });
});

describe('send failure logging', () => {
  it('logs only the error message, never the user input', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    await handleContact(form(valid), vi.fn().mockRejectedValue(new Error('resend down')));
    expect(spy).toHaveBeenCalledWith('[contact] send failed:', 'resend down');
    expect(JSON.stringify(spy.mock.calls)).not.toContain(valid.message);
    spy.mockRestore();
  });
});

describe('emailSubject', () => {
  it('strips control characters from the name', () => {
    expect(emailSubject('Sam\r\nBcc: x@y.z\tLee')).toBe('Portfolio message from Sam Bcc: x@y.z Lee');
  });
});

describe('getSender', () => {
  it('log transport fails for @fail.test addresses and succeeds otherwise', async () => {
    const send = getSender({ CONTACT_TRANSPORT: 'log' });
    await expect(send({ name: 'A', email: 'x@fail.test', message: 'hello there!' })).rejects.toThrow();
    await expect(send({ name: 'A', email: 'x@example.com', message: 'hello there!' })).resolves.toBeUndefined();
  });

  it('throws when Resend is not configured', async () => {
    await expect(getSender({})({ name: 'A', email: 'a@b.co', message: 'hello there!' })).rejects.toThrow(/not configured/);
  });
});
