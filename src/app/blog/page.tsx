import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Notes',
  description: 'Technical notes on .NET, TypeScript and building production software.',
  alternates: { canonical: '/blog', types: { 'application/rss+xml': '/blog/rss.xml' } },
};

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'long', timeZone: 'UTC' });

export default function BlogPage() {
  const posts = getPosts();
  if (posts.length === 0) notFound();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-8">
      <p className="label text-accent">Writing</p>
      <h1 className="word-heading mt-3 text-[clamp(2.75rem,8vw,5.5rem)] font-black leading-none tracking-[-0.03em]">Notes</h1>
      <ul className="mt-12 divide-y divide-line border-y border-line">
        {posts.map((post) => (
          <li key={post.slug} className="py-6">
            <time dateTime={post.date.toISOString()} className="label text-muted">
              {dateFormat.format(post.date)}
            </time>
            <h2 className="mt-1 text-xl font-bold">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent">
                {post.title}
              </Link>
            </h2>
            <p className="mt-1 text-muted">{post.summary}</p>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-muted">
        <a href="/blog/rss.xml" className="underline underline-offset-4 hover:text-accent">
          RSS feed
        </a>
      </p>
    </div>
  );
}
