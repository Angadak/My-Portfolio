import Link from 'next/link';
import type { NavItem } from '@/lib/site';
import { NavLinks } from './nav-links';
import { MobileMenu } from './mobile-menu';
import { InteractiveButtons } from './interactive-buttons';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export function Header({ nav }: { nav: NavItem[] }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95">
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-8">
        <Link href="/" className="text-sm font-black tracking-[0.08em]">
          ANGAD KUMAR
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <NavLinks items={nav} />
        </nav>
        <div className="flex items-center gap-2">
          <InteractiveButtons />
          <ThemeToggle className="ml-1" />
          <MobileMenu items={nav} />
        </div>
      </div>
    </header>
  );
}
