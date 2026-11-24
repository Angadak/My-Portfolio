import { Resend } from 'resend';
import type { Sender } from './contact';

type Env = Record<string, string | undefined>;

export function getSender(env: Env = process.env): Sender {
  if (env.CONTACT_TRANSPORT === 'log') {
    return async (message) => {
      if (message.email.endsWith('@fail.test')) throw new Error('Forced failure for tests');
      console.info('[contact] message received from', message.email);
    };
  }

  const apiKey = env.RESEND_API_KEY;
  const to = env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    return async () => {
      throw new Error('Contact email is not configured');
    };
  }

  const resend = new Resend(apiKey);
  return async (message) => {
    const { error } = await resend.emails.send({
      from: env.CONTACT_FROM_EMAIL ?? 'Portfolio <onboarding@resend.dev>',
      to,
      replyTo: message.email,
      subject: `Portfolio message from ${message.name}`,
      text: `${message.message}\n\n— ${message.name} <${message.email}>`,
    });
    if (error) throw new Error(error.message);
  };
}
