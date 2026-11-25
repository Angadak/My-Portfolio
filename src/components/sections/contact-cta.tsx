import { ButtonLink } from '@/components/ui/button';
import { Magnetic } from '@/components/motion/magnetic';
import { SectionHeading } from '@/components/ui/section-heading';
import { GoalNet } from '@/components/football/goal-net';

const DEFAULT_TEXT = "Hiring for a .NET or TypeScript role, or need a full-stack engineer for a project? Let's talk.";

export function ContactCta({
  email,
  index,
  title = "Let's work together",
  text = DEFAULT_TEXT,
}: {
  email: string;
  index: string;
  title?: string;
  text?: string;
}) {
  return (
    <section aria-labelledby="contact-cta" className="relative isolate overflow-hidden border-t-2 border-ink/50">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="speed-lines absolute -inset-[20%] opacity-30" />
        <div className="absolute inset-x-0 top-[38%] h-24 -skew-y-3 bg-accent/10" />
      </div>
      <div className="mx-auto max-w-6xl px-4 py-28 text-center sm:px-8">
        <div className="flex justify-center">
          <SectionHeading id="contact-cta" index={index} label="Contact" title={title} />
        </div>
        <p className="mx-auto -mt-4 max-w-xl text-lg text-muted">
          {text}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Magnetic>
            <ButtonLink href="/contact">Start a conversation</ButtonLink>
          </Magnetic>
          <ButtonLink href={`mailto:${email}`} variant="secondary">
            {email}
          </ButtonLink>
        </div>
        <GoalNet />
      </div>
    </section>
  );
}
