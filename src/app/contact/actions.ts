'use server';

import { handleContact, type ContactState } from '@/lib/contact';
import { getSender } from '@/lib/senders';

export async function sendContact(form: FormData): Promise<ContactState> {
  if (!(form instanceof FormData)) return { status: 'error', message: "Your message couldn't be sent." };
  return handleContact(form, getSender());
}
