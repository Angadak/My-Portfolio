import type { Metadata } from 'next';
import { profile } from '@/data/profile';
import { ContactForm } from '@/components/contact/contact-form';
import { CopyEmailButton } from '@/components/contact/copy-email-button';
import { ButtonLink } from '@/components/ui/button';
import { Socials } from '@/components/ui/socials';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Angad Kumar about full-stack .NET and TypeScript roles or projects.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-16 px-4 py-16 sm:px-8 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <p className="label text-accent">Contact</p>
        <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
          Let&apos;s talk
        </h1>
        <p className="mt-6 max-w-md text-lg text-muted">
          Hiring for a full-stack .NET or TypeScript role, or have a project in mind? Send a message or reach me directly.
        </p>
        <dl className="mt-10 space-y-6">
          <div>
            <dt className="label text-muted">Email</dt>
            <dd className="mt-1 flex flex-wrap items-center gap-3">
              <a href={`mailto:${profile.email}`} className="font-medium underline underline-offset-4 hover:text-accent">
                {profile.email}
              </a>
              <CopyEmailButton email={profile.email} />
            </dd>
          </div>
          <div>
            <dt className="label text-muted">Location</dt>
            <dd className="mt-1">{profile.location}</dd>
          </div>
          <div>
            <dt className="label text-muted">Elsewhere</dt>
            <dd className="mt-2">
              <Socials github={profile.github} linkedin={profile.linkedin} email={profile.email} />
            </dd>
          </div>
        </dl>
        <div className="mt-10">
          <ButtonLink href="/cv.pdf" variant="secondary" download>
            Download CV
          </ButtonLink>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-6 sm:p-8">
        <ContactForm email={profile.email} />
      </div>
    </div>
  );
}
