import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost, getPosts } from '@/lib/content';
import { jsonLd, articleJsonLd } from '@/lib/seo';
import { Mdx } from '@/components/mdx/mdx';
import { Chip } from '@/components/ui/chip';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { type: 'article', title: post.title, description: post.summary, publishedTime: post.date.toISOString() },
  };
}

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(articleJsonLd(post)) }} />
      <time dateTime={post.date.toISOString()} className="label text-accent">
        {dateFormat.format(post.date)}
      </time>
      <h1 className="mt-3 font-display text-4xl font-extrabold tracking-[-0.02em] sm:text-5xl">{post.title}</h1>
      <p className="mt-4 text-lg text-muted">{post.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <li key={tag}>
            <Chip>{tag}</Chip>
          </li>
        ))}
      </ul>
      <div className="prose-body mt-12">
        <Mdx source={post.body} />
      </div>
    </article>
  );
}
