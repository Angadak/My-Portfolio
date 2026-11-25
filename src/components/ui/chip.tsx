export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex border-[1.5px] border-ink/70 bg-surface px-2 py-0.5 font-mono text-xs font-medium text-fg">
      {children}
    </span>
  );
}
