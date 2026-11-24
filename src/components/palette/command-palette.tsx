'use client';

import type { SiteIndex } from '@/lib/site';

export function CommandPalette({ onClose }: { index: SiteIndex; onClose: () => void }) {
  return (
    <div role="dialog" aria-modal="true" aria-label="Command palette" className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <button type="button" onClick={onClose} className="rounded-full bg-surface px-4 py-2">
        Close
      </button>
    </div>
  );
}
