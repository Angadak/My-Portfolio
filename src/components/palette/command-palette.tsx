'use client';

import { Command } from 'cmdk';
import { useRouter } from 'next/navigation';
import type { SiteIndex } from '@/lib/site';
import { openTerminal, toast } from '@/lib/events';
import { toggleDocumentTheme } from '@/lib/theme';
import { copyText } from '@/lib/clipboard';

const itemClass =
  'cursor-pointer rounded-lg px-3 py-2 text-sm text-fg data-[selected=true]:bg-accent data-[selected=true]:text-bg';
const groupClass = '[&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.1em] [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-muted';

export function CommandPalette({ index, onClose }: { index: SiteIndex; onClose: () => void }) {
  const router = useRouter();

  function go(href: string) {
    onClose();
    router.push(href);
  }

  function run(action: () => void) {
    onClose();
    action();
  }

  return (
    <div
      className="fixed inset-0 z-50 grid items-start justify-items-center bg-black/50 p-4 pt-[15vh]"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" aria-label="Command palette" className="w-full max-w-xl">
        <Command
          label="Command palette"
          className="overflow-hidden rounded-xl border border-line bg-surface text-fg shadow-2xl"
          onKeyDown={(event) => {
            if (event.key === 'Escape') {
              event.preventDefault();
              onClose();
            }
          }}
        >
          <Command.Input
            autoFocus
            placeholder="Search pages, case studies and actions"
            className="w-full border-b border-line bg-transparent px-4 py-3 text-fg outline-none placeholder:text-muted"
          />
          <Command.List className="max-h-[50vh] overflow-y-auto p-2">
            <Command.Empty className="px-3 py-6 text-center text-sm text-muted">No results.</Command.Empty>
            <Command.Group heading="Pages" className={groupClass}>
              <Command.Item value="Home" onSelect={() => go('/')} className={itemClass}>
                Home
              </Command.Item>
              {index.nav.map((item) => (
                <Command.Item key={item.href} value={item.label} onSelect={() => go(item.href)} className={itemClass}>
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
            {index.caseStudies.length > 0 && (
              <Command.Group heading="Case studies" className={groupClass}>
                {index.caseStudies.map((study) => (
                  <Command.Item
                    key={study.slug}
                    value={`${study.title} ${study.slug}`}
                    onSelect={() => go(`/work/${study.slug}`)}
                    className={itemClass}
                  >
                    {study.title}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            {index.posts.length > 0 && (
              <Command.Group heading="Notes" className={groupClass}>
                {index.posts.map((post) => (
                  <Command.Item key={post.slug} value={`${post.title} ${post.slug}`} onSelect={() => go(`/blog/${post.slug}`)} className={itemClass}>
                    {post.title}
                  </Command.Item>
                ))}
              </Command.Group>
            )}
            <Command.Group heading="Actions" className={groupClass}>
              <Command.Item value="Open terminal" onSelect={() => run(openTerminal)} className={itemClass}>
                Open terminal
              </Command.Item>
              <Command.Item
                value="Toggle theme dark light"
                onSelect={() => run(() => toast(`Switched to ${toggleDocumentTheme()} theme`))}
                className={itemClass}
              >
                Toggle theme
              </Command.Item>
              <Command.Item
                value="Copy email"
                onSelect={() =>
                  run(() => {
                    void copyText(index.email).then((ok) => toast(ok ? 'Email copied' : "Couldn't copy email", ok ? 'info' : 'error'));
                  })
                }
                className={itemClass}
              >
                Copy email
              </Command.Item>
              <Command.Item value="Download CV" onSelect={() => run(() => window.location.assign(index.cvHref))} className={itemClass}>
                Download CV
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
