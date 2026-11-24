import { PropIcon, type PropName } from '@/components/props/props';

type Props = { id: string; index: string; label: string; word: string; prop?: PropName };

export function SectionHeading({ id, index, label, word, prop }: Props) {
  return (
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        <p className="label text-accent">
          {index} / {label}
        </p>
        <h2 id={id} className="word-heading mt-2 text-[clamp(2.5rem,7vw,5rem)] font-black leading-none tracking-[-0.03em]">
          {word}
        </h2>
      </div>
      {prop && (
        <div className="hidden w-20 shrink-0 sm:block">
          <PropIcon name={prop} />
        </div>
      )}
    </div>
  );
}
