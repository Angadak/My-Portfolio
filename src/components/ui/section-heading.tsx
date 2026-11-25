type Props = { id: string; index: string; label: string; title: string };

/**
 * Home section heading styled as a manga chapter title: chapter tag, then a big slanted title with a blue
 * offset copy behind it. The h2 is a ball stop and a focus target for the rail.
 */
export function SectionHeading({ id, index, label, title }: Props) {
  return (
    <div className="relative mb-12">
      <div className="flex items-center gap-3">
        <span aria-hidden className="bg-ink px-2 py-0.5 font-display text-xs tracking-[0.18em] text-bg">
          CH.{index}
        </span>
        <p className="label font-bold text-accent">
          {index} — {label}
        </p>
        <span aria-hidden className="h-0.5 max-w-32 flex-1 bg-ink/40" />
      </div>
      <h2
        id={id}
        tabIndex={-1}
        data-ball-stop
        className="offset-accent mt-4 -skew-x-3 font-display text-[clamp(2.25rem,5.5vw,3.75rem)] leading-[1.05] tracking-[-0.01em] focus:outline-none"
      >
        {title}
      </h2>
    </div>
  );
}
