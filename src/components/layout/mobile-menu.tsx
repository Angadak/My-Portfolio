'use client';

import { useState } from 'react';
import type { NavItem } from '@/lib/site';
import { NavLinks } from './nav-links';
import { CloseIcon, MenuIcon } from '@/components/ui/icons';

export function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
        className="grid size-9 place-items-center rounded-full border border-line active:scale-90"
      >
        {open ? <CloseIcon className="size-4" /> : <MenuIcon className="size-4" />}
      </button>
      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="absolute inset-x-0 top-16 border-b border-line bg-bg px-4 pb-6">
          <NavLinks items={items} vertical onNavigate={() => setOpen(false)} />
        </nav>
      )}
    </div>
  );
}
