import { collection, config, fields, singleton } from '@keystatic/core';

/**
 * Content admin panel (open /keystatic).
 * - Local (default): edits the files on this computer while `npm run dev` runs.
 * - GitHub: set NEXT_PUBLIC_KEYSTATIC_STORAGE=github to edit the live site; saving commits to the repo
 *   and Vercel redeploys. See CONTENT.md for the one-time setup.
 */
export const githubStorage = process.env.NEXT_PUBLIC_KEYSTATIC_STORAGE === 'github';

const month = (label: string, description: string, required = true) =>
  fields.text({
    label,
    description,
    validation: {
      isRequired: required,
      pattern: { regex: required ? /^\d{4}-(0[1-9]|1[0-2])$/ : /^(\d{4}-(0[1-9]|1[0-2]))?$/, message: 'Use year-month, for example 2024-12' },
    },
  });

const required = (label: string, options: { description?: string; multiline?: boolean } = {}) =>
  fields.text({ label, ...options, validation: { length: { min: 1 } } });

const textList = (label: string, itemLabel: string, description?: string) =>
  fields.array(required(itemLabel), {
    label,
    description,
    itemLabel: (props) => props.value || itemLabel,
    // the site requires at least one; block saving an empty list here instead of failing the build later
    validation: { length: { min: 1 } },
  });
const optionalList = (label: string, itemLabel: string) =>
  fields.array(required(itemLabel), { label, itemLabel: (props) => props.value || itemLabel });

const notes = fields.text({
  label: 'Private notes',
  description: 'Reminders for yourself (for example numbers to add later). Never shown on the site.',
  multiline: true,
});

export default config({
  storage: githubStorage ? { kind: 'github', repo: { owner: 'Angadak', name: 'My-Portfolio' } } : { kind: 'local' },
  ui: {
    brand: { name: 'Portfolio content' },
    navigation: {
      'About you': ['profile', 'experience', 'skills', 'testimonials'],
      'Site text': ['site'],
      'Work and writing': ['caseStudies', 'projects', 'posts'],
    },
  },
  singletons: {
    profile: singleton({
      label: 'Profile and CV',
      path: 'src/content/settings/profile',
      format: { data: 'json' },
      schema: {
        name: required('Full name'),
        headline: required('Headline', { description: 'Shown under your name, e.g. "Full-stack engineer (.NET + TypeScript)".' }),
        location: required('Location'),
        availability: required('Availability', { description: 'e.g. "Open to remote roles worldwide".' }),
        email: required('Email'),
        github: fields.url({ label: 'GitHub URL', validation: { isRequired: true } }),
        linkedin: required('LinkedIn URL'),
        careerStart: month('Career start', 'First professional month. Years of experience are counted from here automatically.'),
        cv: fields.file({
          label: 'CV (PDF)',
          description: 'Upload a new PDF to replace your CV everywhere on the site (hero, contact page, terminal, palette).',
          directory: 'public',
          publicPath: '/',
        }),
      },
    }),
    experience: singleton({
      label: 'Jobs and education',
      path: 'src/content/settings/experience',
      format: { data: 'json' },
      schema: {
        roles: fields.array(
          fields.object({
            role: required('Job title'),
            company: required('Company'),
            location: required('Location', { description: 'City, Country. The last part counts as the country in the stats.' }),
            start: month('Start', 'Year-month, e.g. 2024-12'),
            end: month('End', 'Leave empty if you still work here. Durations are worked out automatically.', false),
            highlights: textList('Highlights', 'Highlight', 'Shown as "Key plays". Start with what you built and the result.'),
          }),
          {
            label: 'Jobs (newest first)',
            itemLabel: (props) => `${props.fields.role.value} · ${props.fields.company.value}`,
            validation: { length: { min: 1 } },
          },
        ),
        education: fields.array(
          fields.object({ degree: required('Degree'), school: required('School'), period: required('Period', { description: 'e.g. 2018 – 2021' }) }),
          { label: 'Education', itemLabel: (props) => props.fields.degree.value },
        ),
        certifications: fields.array(
          fields.object({ name: required('Name'), issuer: required('Issuer'), date: required('Date', { description: 'e.g. Oct 2025' }) }),
          { label: 'Certifications', itemLabel: (props) => props.fields.name.value },
        ),
        alsoBuilt: fields.array(fields.object({ name: required('Name'), detail: required('Detail', { multiline: true }) }), {
          label: 'Also built (small projects)',
          itemLabel: (props) => props.fields.name.value,
        }),
      },
    }),
    skills: singleton({
      label: 'Skills',
      path: 'src/content/settings/skills',
      format: { data: 'json' },
      schema: {
        skills: fields.array(
          fields.object({
            name: required('Skill'),
            group: fields.select({
              label: 'Group',
              options: [
                { label: 'Backend', value: 'backend' },
                { label: 'Frontend', value: 'frontend' },
                { label: 'Cloud & DevOps', value: 'cloud' },
                { label: 'Data', value: 'data' },
                { label: 'Tools', value: 'tools' },
              ],
              defaultValue: 'backend',
            }),
            since: fields.integer({
              label: 'Using since (year)',
              description: 'Years of use and the bars are worked out from this.',
              defaultValue: new Date().getFullYear(),
              validation: { isRequired: true, min: 2015 },
            }),
            usedIn: textList('Used in', 'Project or company'),
          }),
          { label: 'Skills', itemLabel: (props) => `${props.fields.name.value} (${props.fields.group.value})` },
        ),
      },
    }),
    testimonials: singleton({
      label: 'Testimonials',
      path: 'src/content/settings/testimonials',
      format: { data: 'json' },
      schema: {
        testimonials: fields.array(
          fields.object({
            quote: required('Quote', { multiline: true }),
            name: required('Name'),
            role: required('Role'),
            company: required('Company'),
            linkedinUrl: fields.url({ label: 'LinkedIn URL', validation: { isRequired: true } }),
          }),
          {
            label: 'Testimonials',
            description: 'Only real, attributed quotes. The section appears on the home page once there are 2 or more.',
            itemLabel: (props) => props.fields.name.value,
          },
        ),
      },
    }),
    site: singleton({
      label: 'Hero and page text',
      path: 'src/content/settings/site',
      format: { data: 'json' },
      schema: {
        seoDescription: required('Search and social description', { multiline: true }),
        heroWords: fields.array(
          fields.object({
            word: required('Big word'),
            prop: fields.select({
              label: 'Picture',
              options: [
                { label: 'Database', value: 'database' },
                { label: 'Browser window', value: 'browser' },
                { label: 'API (opens the terminal)', value: 'api' },
                { label: 'Cloud', value: 'cloud' },
                { label: 'Coffee mug', value: 'mug' },
              ],
              defaultValue: 'database',
            }),
            caption: required('Caption', { description: 'Write {years} to insert your years of experience automatically.' }),
          }),
          { label: 'Hero words', itemLabel: (props) => props.fields.word.value, validation: { length: { min: 1 } } },
        ),
        workTitle: required('Home: work section title'),
        projectsTitle: required('Home: projects section title'),
        experienceTitle: required('Home: experience section title'),
        testimonialsTitle: required('Home: testimonials section title'),
        postsTitle: required('Home: writing section title'),
        contactTitle: required('Home: contact section title'),
        contactText: required('Home: contact section text', { multiline: true }),
        contactPageTitle: required('Contact page title'),
        contactPageIntro: required('Contact page intro', { multiline: true }),
      },
    }),
  },
  collections: {
    caseStudies: collection({
      label: 'Case studies',
      slugField: 'title',
      path: 'src/content/case-studies/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'order'],
      schema: {
        title: fields.slug({ name: { label: 'Title' }, slug: { label: 'URL name', description: 'Part of the page address: /work/<url name>' } }),
        summary: required('Summary', { multiline: true }),
        client: required('Client'),
        domain: required('Domain', { description: 'e.g. Fintech · Accounting' }),
        role: required('Your role'),
        teamSize: fields.text({ label: 'Team size', description: 'Optional, e.g. 4 engineers' }),
        period: required('Period', { description: 'e.g. Aug 2023 – May 2024' }),
        stack: textList('Tech stack', 'Technology'),
        metrics: fields.array(
          fields.object({
            value: required('Value', { description: 'e.g. 40%, 3x, 12k' }),
            label: required('Label', { description: 'e.g. faster month-end close' }),
          }),
          { label: 'Metrics (results)', description: 'Real numbers only. The first 3 show on cards.', itemLabel: (p) => `${p.fields.value.value} ${p.fields.label.value}` },
        ),
        featured: fields.checkbox({ label: 'Show on the home page', defaultValue: false }),
        order: fields.integer({ label: 'Order', description: '1 shows first.', defaultValue: 1, validation: { isRequired: true } }),
        notes,
        content: fields.mdx({ label: 'Story', extension: 'mdx' }),
      },
    }),
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: required('Summary', { multiline: true }),
        status: fields.select({
          label: 'Status',
          options: [
            { label: 'Live', value: 'live' },
            { label: 'Building', value: 'building' },
          ],
          defaultValue: 'building',
        }),
        repoUrl: fields.url({ label: 'Source code URL', validation: { isRequired: true } }),
        liveUrl: fields.url({ label: 'Live demo URL' }),
        stack: textList('Tech stack', 'Technology'),
        order: fields.integer({ label: 'Order', defaultValue: 0 }),
        content: fields.mdx({ label: 'Details', extension: 'mdx' }),
      },
    }),
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date'],
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        date: fields.date({ label: 'Date', defaultValue: { kind: 'today' }, validation: { isRequired: true } }),
        summary: required('Summary', { multiline: true }),
        tags: optionalList('Tags', 'Tag'),
        draft: fields.checkbox({ label: 'Draft (hidden on the live site)', defaultValue: true }),
        content: fields.mdx({ label: 'Post', extension: 'mdx' }),
      },
    }),
  },
});
