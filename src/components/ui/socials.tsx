import { GitHubIcon, LinkedInIcon, MailIcon } from './icons';

type Props = { github: string; linkedin: string; email: string; vertical?: boolean };

export function Socials({ github, linkedin, email, vertical = false }: Props) {
  const items = [
    { href: github, label: 'GitHub', Icon: GitHubIcon },
    { href: linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    { href: `mailto:${email}`, label: 'Email', Icon: MailIcon },
  ];
  return (
    <ul className={`flex gap-3 ${vertical ? 'flex-col' : ''}`}>
      {items.map(({ href, label, Icon }) => {
        const external = href.startsWith('http');
        return (
          <li key={label}>
            <a
              href={href}
              aria-label={label}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="grid size-10 place-items-center border-2 border-ink bg-surface text-fg shadow-[2px_2px_0_0_var(--shadow)] transition hover:-translate-x-0.5 hover:-translate-y-0.5 hover:text-accent hover:shadow-[3px_3px_0_0_var(--accent)] active:scale-90"
            >
              <Icon className="size-4" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
