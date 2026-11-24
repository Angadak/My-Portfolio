import { Chip } from '@/components/ui/chip';

type Props = { client: string; role: string; teamSize: string; period: string; stack: string[] };

export function SummaryBar({ client, role, teamSize, period, stack }: Props) {
  const rows: [string, string][] = [
    ['Client', client],
    ['Role', role],
    ['Team', teamSize],
    ['Period', period],
  ];
  return (
    <dl className="mt-10 grid gap-6 rounded-xl border border-line bg-surface p-6 sm:grid-cols-2">
      {rows.map(([label, value]) => (
        <div key={label}>
          <dt className="label text-muted">{label}</dt>
          <dd className="mt-1 font-medium">{value}</dd>
        </div>
      ))}
      <div className="sm:col-span-2">
        <dt className="label text-muted">Stack</dt>
        <dd className="mt-2">
          <ul className="flex flex-wrap gap-2">
            {stack.map((tech) => (
              <li key={tech}>
                <Chip>{tech}</Chip>
              </li>
            ))}
          </ul>
        </dd>
      </div>
    </dl>
  );
}
