'use client';

import { copyText } from '@/lib/clipboard';
import { toast } from '@/lib/events';
import { buttonClass } from '@/components/ui/button';

export function CopyEmailButton({ email }: { email: string }) {
  async function onClick() {
    if (await copyText(email)) toast('Email copied');
    else toast("Couldn't copy. Select the address instead.", 'error');
  }
  return (
    <button type="button" onClick={onClick} className={buttonClass('secondary', 'h-9 px-4 text-xs')}>
      Copy email
    </button>
  );
}
