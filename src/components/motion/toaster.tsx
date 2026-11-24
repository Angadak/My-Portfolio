'use client';

import { useEffect, useState } from 'react';
import { TOAST, type ToastDetail } from '@/lib/events';

type Toast = ToastDetail & { id: number };

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    let nextId = 0;
    function onToast(event: Event) {
      const detail = (event as CustomEvent<ToastDetail>).detail;
      const item = { ...detail, id: ++nextId };
      setItems((current) => [...current, item]);
      window.setTimeout(() => setItems((current) => current.filter((t) => t.id !== item.id)), 3500);
    }
    window.addEventListener(TOAST, onToast);
    return () => window.removeEventListener(TOAST, onToast);
  }, []);

  return (
    <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-4 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-full px-4 py-2 text-sm font-medium shadow-lg ${item.tone === 'error' ? 'border border-danger bg-surface text-danger' : 'bg-fg text-bg'}`}
        >
          {item.message}
        </div>
      ))}
    </div>
  );
}
