import Link from 'next/link';

type Variant = 'primary' | 'secondary';

// Manga buttons: square ink frame, hard offset shadow, lifts toward the reader on hover.
const base =
  'inline-flex h-12 items-center gap-2 border-2 border-ink px-5 text-sm font-bold uppercase tracking-[0.1em] transition-[transform,box-shadow,background-color,color] duration-200 ease-out hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none';
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-on-accent shadow-[3px_3px_0_0_var(--ink)] hover:shadow-[5px_5px_0_0_var(--ink)]',
  secondary: 'bg-surface text-fg shadow-[3px_3px_0_0_var(--shadow)] hover:text-accent hover:shadow-[5px_5px_0_0_var(--accent)]',
};

export function buttonClass(variant: Variant = 'primary', className = ''): string {
  return `${base} ${variants[variant]} ${className}`.trim();
}

type ButtonLinkProps = {
  href: string;
  variant?: Variant;
  className?: string;
  download?: boolean;
  children: React.ReactNode;
};

export function ButtonLink({ href, variant = 'primary', className = '', download, children }: ButtonLinkProps) {
  const external = href.startsWith('http');
  const plain = external || href.startsWith('mailto:') || /\.(pdf|xml)$/.test(href);
  if (plain) {
    return (
      <a
        href={href}
        className={buttonClass(variant, className)}
        download={download || undefined}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClass(variant, className)}>
      {children}
    </Link>
  );
}
