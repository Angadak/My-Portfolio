import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { testimonials } from '@/data/testimonials';
import { getCaseStudies, getPosts, getProjects } from '@/lib/content';
import { formatYears, yearsOfExperience } from '@/lib/experience';
import { heroWords } from '@/lib/hero';
import { numberSections, visibleSections, type SectionFlags } from '@/lib/sections';
import { jsonLd, personJsonLd } from '@/lib/seo';
import { HeroStage } from '@/components/hero/hero-stage';
import { FeaturedWork } from '@/components/sections/featured-work';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ExperienceSnapshot } from '@/components/sections/experience-snapshot';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { LatestPosts } from '@/components/sections/latest-posts';
import { ContactCta } from '@/components/sections/contact-cta';
import { BallRail } from '@/components/football/ball-rail';
import { BallLayer } from '@/components/football/ball-layer';
import { SkillRibbon } from '@/components/sections/skill-ribbon';
import { skills } from '@/data/skills';
import { siteCopy } from '@/data/site';

export default function HomePage() {
  const studies = getCaseStudies();
  const projects = getProjects();
  const posts = getPosts();
  const flags: SectionFlags = {
    work: studies.some((s) => s.featured),
    projects: projects.length > 0,
    experience: experience.length > 0,
    testimonials: testimonials.length >= 2,
    posts: posts.length > 0,
    contact: true,
  };
  const n = numberSections(flags);
  const years = formatYears(yearsOfExperience(profile.careerStart));
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(personJsonLd()) }} />
      <HeroStage
        words={heroWords(years)}
        name={profile.name}
        headline={profile.headline}
        availability={profile.availability}
        location={profile.location}
        github={profile.github}
        linkedin={profile.linkedin}
        email={profile.email}
        cvHref={profile.cv}
      />
      <SkillRibbon items={skills.filter((s) => s.group !== 'tools').map((s) => s.name)} />
      <FeaturedWork studies={studies} index={n.work} title={siteCopy.workTitle} />
      <ProjectsSection projects={projects} index={n.projects} title={siteCopy.projectsTitle} />
      <ExperienceSnapshot items={experience} index={n.experience} title={siteCopy.experienceTitle} />
      <TestimonialsSection items={testimonials} index={n.testimonials} title={siteCopy.testimonialsTitle} />
      <LatestPosts posts={posts} index={n.posts} title={siteCopy.postsTitle} />
      <ContactCta email={profile.email} index={n.contact} title={siteCopy.contactTitle} text={siteCopy.contactText} />
      <BallRail sections={visibleSections(flags)} />
      <BallLayer />
    </>
  );
}
