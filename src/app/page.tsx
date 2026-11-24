import { profile } from '@/data/profile';
import { experience } from '@/data/experience';
import { testimonials } from '@/data/testimonials';
import { getCaseStudies, getPosts, getProjects } from '@/lib/content';
import { formatYears, yearsOfExperience } from '@/lib/experience';
import { heroWords } from '@/lib/hero';
import { numberSections } from '@/lib/sections';
import { jsonLd, personJsonLd } from '@/lib/seo';
import { HeroStage } from '@/components/hero/hero-stage';
import { FeaturedWork } from '@/components/sections/featured-work';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ExperienceSnapshot } from '@/components/sections/experience-snapshot';
import { TestimonialsSection } from '@/components/sections/testimonials-section';
import { LatestPosts } from '@/components/sections/latest-posts';
import { ContactCta } from '@/components/sections/contact-cta';

export default function HomePage() {
  const studies = getCaseStudies();
  const projects = getProjects();
  const posts = getPosts();
  const n = numberSections({
    work: studies.some((s) => s.featured),
    projects: projects.length > 0,
    experience: experience.length > 0,
    testimonials: testimonials.length >= 2,
    posts: posts.length > 0,
    contact: true,
  });
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
      />
      <FeaturedWork studies={studies} index={n.work} />
      <ProjectsSection projects={projects} index={n.projects} />
      <ExperienceSnapshot items={experience} index={n.experience} />
      <TestimonialsSection items={testimonials} index={n.testimonials} />
      <LatestPosts posts={posts} index={n.posts} />
      <ContactCta email={profile.email} index={n.contact} />
    </>
  );
}
