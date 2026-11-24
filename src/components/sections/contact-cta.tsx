import { ButtonLink } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';

export function ContactCta({ email }: { email: string }) {
  return (
    <section aria-labelledby="contact-cta" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-8">
        <p className="label text-accent">06 / Contact</p>
        <h2 id="contact-cta" className="word-heading mt-3 text-[clamp(3rem,10vw,7rem)] font-black leading-none tracking-[-0.03em]">
          HELLO
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted">
          Hiring for a .NET or TypeScript role, or need a full-stack engineer for a project? Let&apos;s talk.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <ButtonLink href="/contact">Start a conversation</ButtonLink>
          </Magnetic>
          <ButtonLink href={`mailto:${email}`} variant="secondary">
            {email}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
