'use client';

import { useId, useRef, useState } from 'react';
import { ArrowRightIcon } from '@/components/ui/icons';

export type CareerRole = {
  key: string;
  role: string;
  company: string;
  location: string;
  period: string;
  from: string;
  to: string;
  duration: string;
  /** Share of the whole career, 0..1, for the season bar. */
  share: number;
  current: boolean;
  highlights: string[];
};

/**
 * "Career mode": clubs on the left (a tab list), the selected role as a big player card,
 * and a season bar showing how long each spell lasted. Roles arrive newest first.
 */
export function CareerMode({ roles }: { roles: CareerRole[] }) {
  const [selected, setSelected] = useState(0);
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const role = roles[selected];
  const panelId = `${id}-panel`;
  const tabId = (i: number) => `${id}-tab-${i}`;
  const matchNo = String(roles.length - selected).padStart(2, '0');

  function select(i: number, focus = false) {
    const next = (i + roles.length) % roles.length;
    setSelected(next);
    if (focus) tabs.current[next]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = {
      ArrowDown: selected + 1,
      ArrowRight: selected + 1,
      ArrowUp: selected - 1,
      ArrowLeft: selected - 1,
      Home: 0,
      End: roles.length - 1,
    };
    if (!(event.key in moves)) return;
    event.preventDefault();
    select(moves[event.key], true);
  }

  // season bar runs oldest -> newest, left to right
  const season = roles.map((r, i) => ({ ...r, i })).reverse();

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-[minmax(0,17rem)_1fr]">
        <div
          role="tablist"
          aria-label="Roles"
          aria-orientation="vertical"
          onKeyDown={onKeyDown}
          className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0"
        >
          {roles.map((r, i) => {
            const active = i === selected;
            return (
              <button
                key={r.key}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={tabId(i)}
                aria-selected={active}
                aria-controls={panelId}
                tabIndex={active ? 0 : -1}
                onClick={() => select(i)}
                className={`group relative min-w-[13rem] shrink-0 snap-start border-2 px-4 py-3 text-left transition-[transform,box-shadow,background-color,border-color] duration-200 md:min-w-0 ${
                  active
                    ? 'border-ink bg-accent text-on-accent shadow-[3px_3px_0_0_var(--ink)] md:translate-x-2'
                    : 'border-ink/30 bg-surface hover:-translate-y-0.5 hover:border-ink hover:shadow-[3px_3px_0_0_var(--accent)] md:hover:translate-x-1 md:hover:translate-y-0'
                }`}
              >
                <span className={`label block text-[0.65rem] ${active ? 'text-on-accent' : 'text-muted'}`}>
                  {r.from} — {r.to}
                </span>
                <span className="mt-1 block font-display text-lg leading-tight">{r.company}</span>
                <span className={`block text-sm ${active ? 'text-on-accent' : 'text-muted'}`}>{r.role}</span>
                {r.current && (
                  <span
                    className={`label absolute right-3 top-3 px-1.5 py-0.5 text-[0.6rem] font-bold ${
                      active ? 'bg-on-accent text-accent' : 'bg-accent text-on-accent'
                    }`}
                  >
                    Now
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={panelId}
          aria-labelledby={tabId(selected)}
          tabIndex={0}
          data-current={role.current ? '' : undefined}
          className="panel relative isolate overflow-hidden"
        >
          <div aria-hidden className="speed-lines-accent pointer-events-none absolute -right-1/3 -top-1/2 -z-10 size-[120%] opacity-10" />
          <span
            aria-hidden
            className="text-outline pointer-events-none absolute -right-2 -top-4 -z-10 select-none font-display text-[7rem] leading-none opacity-25 sm:text-[9rem]"
          >
            {matchNo}
          </span>
          <div key={role.key} className="career-swap p-6 sm:p-8">
            <p className="flex flex-wrap items-center gap-3">
              <span className="label font-bold text-accent">{role.current ? 'Current club' : `Spell ${matchNo}`}</span>
              {role.current && <span className="label bg-accent px-2 py-0.5 font-bold text-on-accent">Now</span>}
            </p>
            <h3 className="mt-3 font-display text-[clamp(1.6rem,3.5vw,2.4rem)] leading-tight">{role.role}</h3>
            <p className="mt-1 font-semibold">
              {role.company} <span className="font-normal text-muted">· {role.location}</span>
            </p>
            <p className="mt-3 flex flex-wrap items-center gap-2">
              <span className="label text-muted">{role.period}</span>
              <span className="label border-[1.5px] border-ink/60 px-1.5 py-0.5 font-bold">{role.duration}</span>
            </p>

            <p className="label mt-7 font-bold text-muted">Key plays</p>
            <ol className="mt-3 space-y-3">
              {role.highlights.map((h, i) => (
                <li key={h} className="career-play flex gap-3" style={{ animationDelay: `${120 + i * 70}ms` }}>
                  <span aria-hidden className="mt-0.5 grid size-6 shrink-0 rotate-45 place-items-center border-2 border-ink bg-bg">
                    <span className="-rotate-45 font-mono text-[0.65rem] font-bold">{i + 1}</span>
                  </span>
                  <span>{h}</span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex items-center gap-3">
              <button
                type="button"
                onClick={() => select(selected + 1)}
                aria-label="Previous role (older)"
                className="grid size-10 rotate-180 place-items-center border-2 border-ink bg-surface shadow-[2px_2px_0_0_var(--shadow)] transition hover:text-accent active:scale-90"
              >
                <ArrowRightIcon className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => select(selected - 1)}
                aria-label="Next role (newer)"
                className="grid size-10 place-items-center border-2 border-ink bg-surface shadow-[2px_2px_0_0_var(--shadow)] transition hover:text-accent active:scale-90"
              >
                <ArrowRightIcon className="size-4" />
              </button>
              <span className="label ml-1 text-muted">
                {selected + 1} / {roles.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Season bar: decorative mirror of the tabs, sized by time spent at each club */}
      <div aria-hidden className="mt-8">
        <div className="flex h-4 border-2 border-ink bg-surface">
          {season.map((r) => (
            <div
              key={r.key}
              onClick={() => select(r.i)}
              style={{ width: `${(r.share * 100).toFixed(2)}%` }}
              className={`h-full cursor-pointer border-r-2 border-ink transition-colors last:border-r-0 ${
                r.i === selected ? 'bg-accent' : 'tone hover:bg-accent/30'
              }`}
            />
          ))}
        </div>
        <div className="mt-1.5 flex">
          {season.map((r) => (
            <span key={r.key} style={{ width: `${(r.share * 100).toFixed(2)}%` }} className="label truncate pr-1 text-[0.6rem] text-muted">
              {r.from}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
