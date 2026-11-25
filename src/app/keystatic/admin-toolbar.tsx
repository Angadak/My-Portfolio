'use client';

import { useEffect, useRef, useState } from 'react';
import { logout } from '@/app/admin-login/actions';

type Mode = 'local' | 'github';

const GUIDE: { title: string; body: string }[] = [
  { title: 'Profile and CV', body: 'Your name, headline, contact links and career start month. Upload a new PDF under "CV" to replace every Download CV button.' },
  { title: 'Jobs and education', body: 'Jobs newest first. Months look like 2024-12. Leave "End" empty for your current job. Highlights show as "Key plays".' },
  { title: 'Skills', body: 'One row per skill: its group, the year you started, and where you used it. Years and the bars are worked out for you.' },
  { title: 'Testimonials', body: 'Real, attributed quotes only. The section appears on the home page once there are 2.' },
  { title: 'Hero and page text', body: 'Hero words and captions, home section titles and contact texts. Write {years} in a caption to insert your years of experience.' },
  { title: 'Case studies', body: 'Fill the details on the right, write the story on the left. Add real numbers under "Metrics" (the first 3 show on cards). Tick "Show on the home page" to feature one.' },
  { title: 'Blog posts', body: 'New posts start as drafts. Untick "Draft" when it is ready to go live.' },
];

const AUTOMATIC = ['Years of experience', 'Job durations', 'Clubs, time and countries stats', 'Skill years and bars', 'The season bar'];

const btn =
  'inline-flex h-8 items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-3 text-xs font-semibold text-white/85 transition hover:bg-white/15 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6b8cff]';

/** Thin bar above the admin: where you are, what Save does, help, view site, sign out. */
export function AdminToolbar({ mode }: { mode: Mode }) {
  const [help, setHelp] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!help) return;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setHelp(false);
        openRef.current?.focus();
      }
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [help]);

  const saveNote =
    mode === 'github'
      ? { dot: 'bg-emerald-400', text: 'Save publishes to the live site (about 1 minute)' }
      : { dot: 'bg-amber-400', text: 'Save changes files on this computer — commit and push to publish' };

  return (
    <>
      <div className="flex h-11 shrink-0 items-center gap-3 border-b border-white/10 bg-[#141414] px-3 text-white sm:px-4">
        <span className="flex items-center gap-2 text-sm font-bold">
          <span aria-hidden className="h-4 w-1 bg-[#3d7bff]" />
          Content admin
        </span>
        <span className="hidden items-center gap-2 text-xs text-white/60 md:flex">
          <span aria-hidden className={`size-2 rounded-full ${saveNote.dot}`} />
          {saveNote.text}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <button ref={openRef} type="button" onClick={() => setHelp(true)} aria-expanded={help} aria-controls="admin-help" className={btn}>
            <span aria-hidden className="grid size-4 place-items-center rounded-full border border-current text-[10px] leading-none">?</span>
            Help
          </button>
          <a href="/" target="_blank" rel="noopener" className={btn}>
            View site <span aria-hidden>↗</span>
          </a>
          <form action={logout}>
            <button type="submit" className={btn}>
              Sign out
            </button>
          </form>
        </div>
      </div>

      {help && (
        <div className="fixed inset-0 z-30 flex justify-end">
          <button type="button" aria-label="Close help" tabIndex={-1} onClick={() => setHelp(false)} className="absolute inset-0 cursor-default bg-black/50" />
          <aside
            id="admin-help"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-help-title"
            className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-[#1b1b1b] p-6 text-sm text-white/85 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 id="admin-help-title" className="text-lg font-bold text-white">
                How to update your site
              </h2>
              <button ref={closeRef} type="button" onClick={() => setHelp(false)} className={btn}>
                Close
              </button>
            </div>

            <ol className="mt-5 space-y-2 rounded-lg border border-white/10 bg-white/5 p-4">
              <li>
                <b className="text-white">1.</b> Pick a section on the left.
              </li>
              <li>
                <b className="text-white">2.</b> Change the text, or press <b className="text-white">Add</b> for a new item. Drag the dots to reorder.
              </li>
              <li>
                <b className="text-white">3.</b> Press the blue <b className="text-white">Save</b> button (top right).
              </li>
              <li>
                <b className="text-white">4.</b>{' '}
                {mode === 'github' ? 'Wait about a minute, then refresh your live site.' : 'Commit and push the changed files to publish them to the live site.'}
              </li>
            </ol>

            <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-white/50">What each section is for</h3>
            <dl className="mt-3 space-y-3">
              {GUIDE.map((g) => (
                <div key={g.title}>
                  <dt className="font-semibold text-white">{g.title}</dt>
                  <dd className="mt-0.5 text-white/70">{g.body}</dd>
                </div>
              ))}
            </dl>

            <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-white/50">Worked out for you</h3>
            <p className="mt-2 text-white/70">You never type these, they update from your dates:</p>
            <ul className="mt-2 flex flex-wrap gap-2">
              {AUTOMATIC.map((a) => (
                <li key={a} className="rounded-full border border-white/15 px-2.5 py-1 text-xs">
                  {a}
                </li>
              ))}
            </ul>

            <h3 className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-white/50">If Save is greyed out or shows red</h3>
            <p className="mt-2 text-white/70">
              A required field is empty or a month is not written like 2024-12. Fields marked with a red star must be filled. The message under the field tells you what to fix.
            </p>
          </aside>
        </div>
      )}
    </>
  );
}
