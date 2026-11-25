import type { Metadata } from 'next';
import { alsoBuilt, certifications, education, experience } from '@/data/experience';
import { skills } from '@/data/skills';
import { profile } from '@/data/profile';
import { formatPeriod, formatYears, yearsOfExperience } from '@/lib/experience';
import { groupSkills } from '@/lib/skills';
import { ButtonLink } from '@/components/ui/button';
import { PageHeading } from '@/components/ui/page-heading';
import { Reveal } from '@/components/motion/reveal';
import { TiltCard } from '@/components/motion/tilt-card';

export const metadata: Metadata = {
  title: 'Experience and skills',
  description: 'Roles, skills with years of use, education and certification.',
  alternates: { canonical: '/experience' },
};

export default function ExperiencePage() {
  const years = formatYears(yearsOfExperience(profile.careerStart));
  const groups = groupSkills(skills);
  const maxYears = Math.max(1, ...groups.flatMap((g) => g.skills.map((s) => s.years)));
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <PageHeading kicker={years} title="Experience" />
      <div className="mt-6">
        <ButtonLink href={profile.cv} variant="secondary" download>
          Download CV (PDF)
        </ButtonLink>
      </div>

      <ol aria-label="Roles" className="mt-14 space-y-12 border-l-2 border-ink/50 pl-6">
        {experience.map((role) => (
          <li key={`${role.company}-${role.start}`} className="relative">
            <span aria-hidden className="absolute -left-[32px] top-1.5 size-3 rotate-45 border-2 border-ink bg-accent" />
            <p className="label text-muted">{formatPeriod(role.start, role.end)}</p>
            <h2 className="mt-1 text-xl font-bold">
              {role.role} · {role.company}
            </h2>
            <p className="text-sm text-muted">{role.location}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              {role.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section aria-labelledby="skills-heading" id="skills" className="mt-20">
        <h2 id="skills-heading" className="offset-accent -skew-x-3 font-display text-[clamp(2rem,5vw,3rem)] leading-none">
          Skills
        </h2>
        <p className="mt-3 text-muted">Years of hands-on use and where each skill was applied.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {groups.map((group, g) => (
            <Reveal key={group.group} delay={g * 70} className="h-full">
              <TiltCard className="h-full" max={3}>
                <div className="panel panel-hit group/card relative isolate h-full overflow-hidden p-5">
                  <div
                    aria-hidden
                    className="speed-lines-accent pointer-events-none absolute -right-1/2 -top-1/2 -z-10 size-full scale-75 opacity-0 transition duration-500 group-hover/card:scale-100 group-hover/card:opacity-20"
                  />
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="label font-bold text-accent">{group.label}</h3>
                    <span aria-hidden className="font-display text-2xl leading-none text-muted transition group-hover/card:text-accent">
                      {String(group.skills.length).padStart(2, '0')}
                    </span>
                  </div>
                  <ul className="mt-3 divide-y divide-line">
                    {group.skills.map((skill) => (
                      <li key={skill.name} className="group/skill -mx-2 px-2 py-2.5 transition-colors duration-200 hover:bg-accent/10">
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="font-medium transition-[color,transform] duration-200 group-hover/skill:translate-x-1 group-hover/skill:text-accent">
                            {skill.name}
                          </span>
                          <span className="font-mono text-xs text-muted">
                            {skill.years} {skill.years === 1 ? 'yr' : 'yrs'}
                          </span>
                        </div>
                        {/* experience bar: fills as the card scrolls in, lights up on hover */}
                        <span aria-hidden className="mt-1.5 block h-1 bg-line">
                          <span
                            className="skill-bar block h-full w-[var(--level)] bg-accent/60 transition-[width,background-color,box-shadow] duration-700 ease-out group-hover/card:bg-accent group-hover/skill:shadow-[0_0_10px_var(--accent)]"
                            style={{ '--level': `${Math.round((skill.years / maxYears) * 100)}%` } as React.CSSProperties}
                          />
                        </span>
                        <p className="mt-1 text-xs text-muted">{skill.usedIn.join(' · ')}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section aria-labelledby="education" className="mt-20 grid gap-10 sm:grid-cols-2">
        <div>
          <h2 id="education" className="text-2xl font-black tracking-tight">
            Education
          </h2>
          {education.map((e) => (
            <p key={e.school} className="mt-3">
              <span className="font-medium">{e.degree}</span>
              <br />
              <span className="text-sm text-muted">
                {e.school} · {e.period}
              </span>
            </p>
          ))}
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight">Certification</h2>
          {certifications.map((c) => (
            <p key={c.name} className="mt-3">
              <span className="font-medium">{c.name}</span>
              <br />
              <span className="text-sm text-muted">
                {c.issuer} · {c.date}
              </span>
            </p>
          ))}
        </div>
      </section>

      <section aria-labelledby="also-built" className="mt-16">
        <h2 id="also-built" className="text-2xl font-black tracking-tight">
          Also built
        </h2>
        <ul className="mt-3 space-y-2">
          {alsoBuilt.map((item) => (
            <li key={item.name}>
              <span className="font-medium">{item.name}</span> — <span className="text-muted">{item.detail}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
