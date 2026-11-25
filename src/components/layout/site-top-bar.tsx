import Link from 'next/link';

/** Not sticky: the name scrolls away; the fixed menu button stays. Right padding keeps clear of that button. */
export function SiteTopBar({ name }: { name: string }) {
  return (
    <header className="mx-auto flex h-20 w-full max-w-6xl items-center px-4 pr-20 sm:px-8 sm:pr-24">
      <Link
        href="/"
        aria-label={`${name}, home`}
        className="group inline-flex items-center gap-2 font-display text-[clamp(1.4rem,3vw,1.9rem)] leading-none tracking-[-0.01em] transition hover:text-accent"
      >
        <span aria-hidden className="h-6 w-1.5 bg-accent transition-[height] group-hover:h-8" />
        {name}
        <span className="text-accent">.</span>
      </Link>
    </header>
  );
}
