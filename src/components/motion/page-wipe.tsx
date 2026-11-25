'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

/** On route change an ink panel with a blue edge slashes across the screen, like turning a manga page. Not on first load. */
export function PageWipe() {
  const pathname = usePathname();
  const [seen, setSeen] = useState(pathname);
  const [count, setCount] = useState(0);
  if (seen !== pathname) {
    setSeen(pathname);
    setCount((c) => c + 1);
  }
  // never inside the admin panel: every click there changes the URL
  if (count === 0 || pathname.startsWith('/keystatic')) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[75] overflow-hidden">
      <div key={count} className="page-wipe absolute -inset-x-[20%] inset-y-0 border-x-[10px] border-accent bg-[#05060b]" />
    </div>
  );
}
