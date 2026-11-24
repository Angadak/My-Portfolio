import Link from 'next/link';

type Variant = 'primary' | 'secondary';

const base =
  'inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition active:scale-95';
const variants: Record<Variant, string> = {
  primary: 'bg-fg text-bg hover:bg-accent hover:text-bg',
  secondary: 'border border-line bg-surface text-fg hover:border-accent hover:text-accent',
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
