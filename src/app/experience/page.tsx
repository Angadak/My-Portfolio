import type { Metadata } from 'next';
import { alsoBuilt, certifications, education, experience } from '@/data/experience';
import { skills } from '@/data/skills';
import { profile } from '@/data/profile';
import { formatPeriod, formatYears, yearsOfExperience } from '@/lib/experience';
import { groupSkills } from '@/lib/skills';
import { ButtonLink } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Experience and skills',
  description: 'Roles, skills with years of use, education and certification.',
  alternates: { canonical: '/experience' },
};

export default function ExperiencePage() {
  const years = formatYears(yearsOfExperience(profile.careerStart));
  const groups = groupSkills(skills);
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-8">
      <p className="label text-accent">{years}</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">
        Experience
      </h1>
      <div className="mt-6">
        <ButtonLink href="/cv.pdf" variant="secondary" download>
          Download CV (PDF)
        </ButtonLink>
      </div>

      <ol aria-label="Roles" className="mt-14 space-y-12 border-l border-line pl-6">
        {experience.map((role) => (
          <li key={`${role.company}-${role.start}`} className="relative">
            <span aria-hidden className="absolute -left-[31px] top-1.5 size-3 rounded-full bg-accent" />
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
        <h2 id="skills-heading" className="text-3xl font-black tracking-tight">
          Skills
        </h2>
        <p className="mt-2 text-muted">Years of hands-on use and where each skill was applied.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {groups.map((group) => (
            <div key={group.group} className="rounded-xl border border-line bg-surface p-5">
              <h3 className="label text-accent">{group.label}</h3>
              <ul className="mt-3 divide-y divide-line">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="py-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{skill.name}</span>
                      <span className="font-mono text-xs text-muted">
                        {skill.years} {skill.years === 1 ? 'yr' : 'yrs'}
                      </span>
                    </div>
                    <p className="text-xs text-muted">{skill.usedIn.join(' · ')}</p>
                  </li>
                ))}
              </ul>
            </div>
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
