type Props = { kicker: string; title: string };

export function PageHeading({ kicker, title }: Props) {
  return (
    <>
      <p className="flex items-center gap-3">
        <span aria-hidden className="h-[3px] w-10 bg-accent" />
        <span className="label font-bold text-accent">{kicker}</span>
      </p>
      <h1 className="offset-accent mt-4 -skew-x-3 font-display text-[clamp(2.75rem,7vw,4.75rem)] leading-[1.02] tracking-[-0.01em]">
        {title}
      </h1>
    </>
  );
}
