export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex rounded-full border border-line px-2.5 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}
