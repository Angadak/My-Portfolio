import { profile } from '@/data/profile';
import { Socials } from '@/components/ui/socials';

// Computed at build time (module scope keeps render pure).
const YEAR = new Date().getFullYear();

export function Footer() {
  return (
    <footer className="border-t-2 border-ink bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-8">
        <p className="text-sm text-muted">
          © {YEAR} {profile.name}. Built with Next.js ·{' '}
          <a href="https://github.com/Angadak/My-Portfolio" className="underline decoration-accent decoration-2 underline-offset-4 hover:text-accent">
            source code
          </a>
        </p>
        <Socials github={profile.github} linkedin={profile.linkedin} email={profile.email} />
      </div>
    </footer>
  );
}
