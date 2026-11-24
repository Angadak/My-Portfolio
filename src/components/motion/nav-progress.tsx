'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/** Thin accent bar shown from an internal link click until the pathname changes. */
export function NavProgress() {
  const pathname = usePathname();
  const [from, setFrom] = useState<string | null>(null);
  const [seen, setSeen] = useState(pathname);
  if (seen !== pathname) {
    setSeen(pathname);
    setFrom(null);
  }

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement).closest('a');
      if (!link || link.target === '_blank' || link.hasAttribute('download')) return;
      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (/\.(pdf|xml)$/.test(url.pathname)) return;
      setFrom(window.location.pathname);
    }
    function onPopState() {
      setFrom(null);
    }
    document.addEventListener('click', onClick, true);
    window.addEventListener('popstate', onPopState);
    return () => {
      document.removeEventListener('click', onClick, true);
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  if (from === null) return null;
  return (
    <div
      aria-hidden
      data-nav-progress
      className="fixed inset-x-0 top-0 z-[70] h-0.5 origin-left bg-accent animate-[nav-load_8s_cubic-bezier(0.1,0.7,0.2,1)_forwards]"
    />
  );
}
