/**
 * Slanted ink ribbon of skills scrolling under the hero, like a stadium LED board.
 * Decorative (the same skills are listed on /experience), so it is hidden from assistive tech.
 */
export function SkillRibbon({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const row = items.flatMap((name) => [name, '◆']);
  return (
    <div aria-hidden className="relative z-10 -my-2 -rotate-1 overflow-hidden border-y-2 border-accent bg-[#05060b] py-3 text-[#eef1ff]">
      <div className="marquee flex w-max">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center gap-6 pr-6 font-display text-base tracking-[0.06em] sm:text-lg">
            {row.map((text, i) => (
              <span key={i} className={text === '◆' ? 'text-sm text-[#3d7bff]' : 'whitespace-nowrap uppercase'}>
                {text}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
