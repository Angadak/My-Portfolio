'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavItem } from '@/lib/site';

export function NavLinks({ items, onNavigate, vertical = false }: { items: NavItem[]; onNavigate?: () => void; vertical?: boolean }) {
  const pathname = usePathname();
  return (
    <ul className={vertical ? 'flex flex-col gap-1' : 'flex items-center gap-6'}>
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={`text-sm font-medium transition hover:text-accent ${active ? 'text-accent' : 'text-fg'} ${vertical ? 'block py-3 text-lg' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
