'use server';

import { handleContact, type ContactState } from '@/lib/contact';
import { getSender } from '@/lib/senders';

export async function sendContact(form: FormData): Promise<ContactState> {
  return handleContact(form, getSender());
}
