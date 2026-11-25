import Link from 'next/link';
import type { Post } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';

const dateFormat = new Intl.DateTimeFormat('en', { dateStyle: 'medium', timeZone: 'UTC' });

export function LatestPosts({ posts, index, title = 'Notes from the work' }: { posts: Post[]; index: string; title?: string }) {
  if (posts.length === 0) return null;
  return (
    <section aria-labelledby="latest-posts" className="mx-auto max-w-6xl px-4 py-24 sm:px-8">
      <SectionHeading id="latest-posts" index={index} label="Writing" title={title} />
      <ul className="divide-y-2 divide-line border-y-2 border-ink/60">
        {posts.slice(0, 3).map((post) => (
          <li key={post.slug} className="group/post relative py-5 transition hover:bg-surface">
            <Link href={`/blog/${post.slug}`} className="group grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline">
              <span className="font-display text-lg transition group-hover:translate-x-2 group-hover:text-accent">{post.title}</span>
              <time dateTime={post.date.toISOString()} className="label text-muted">
                {dateFormat.format(post.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
