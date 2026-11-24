type Metric = { value: string; label: string };

export function Results({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;
  return (
    <section aria-labelledby="results" className="mt-16">
      <h2 id="results" className="text-2xl font-extrabold tracking-tight">
        Results
      </h2>
      <dl className="mt-6 grid gap-4 sm:grid-cols-3">
        {metrics.map((m) => (
          <div key={m.label} className="flex flex-col-reverse rounded-xl border border-line bg-surface p-5">
            <dt className="mt-1 text-sm text-muted">{m.label}</dt>
            <dd className="text-3xl font-black tracking-tight">{m.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
