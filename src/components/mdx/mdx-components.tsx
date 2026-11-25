import Image from 'next/image';

export function Callout({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="my-8 panel border-l-[10px] border-l-accent p-5">
      {title && <p className="label mb-2 text-accent">{title}</p>}
      <div className="text-fg">{children}</div>
    </aside>
  );
}

export function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}) {
  return (
    <figure className="my-10">
      <Image src={src} alt={alt} width={width} height={height} className="h-auto w-full rounded-xl border border-line" />
      {caption && <figcaption className="mt-3 text-center text-sm text-muted">{caption}</figcaption>}
    </figure>
  );
}

export const mdxComponents = { Callout, Figure };
