export const SKETCH_SLUGS = ['practice-manager', 'edenred-benefits-portal', 'tris', 'cwecs', 'moowr-reconciliation'] as const;
type SketchSlug = (typeof SKETCH_SLUGS)[number];

const panel = 'fill-surface stroke-muted/40';
const card = 'fill-surface stroke-muted/40';

function Kanban() {
  const cols = [12, 88, 164];
  const cards: Record<number, number> = { 0: 3, 1: 2, 2: 1 };
  return (
    <>
      {cols.map((x, c) => (
        <g key={x}>
          <rect x={x} y="12" width="64" height="116" rx="6" className={panel} />
          <rect x={x + 6} y="18" width="30" height="5" rx="2.5" className="fill-muted/30" />
          {Array.from({ length: cards[c] }, (_, i) => (
            <rect key={i} x={x + 6} y={30 + i * 26} width="52" height="20" rx="4" className={c === 1 && i === 0 ? 'fill-accent' : card} />
          ))}
        </g>
      ))}
    </>
  );
}

function Toggles() {
  const on = [true, false, true, true];
  return (
    <>
      {on.map((enabled, i) => (
        <g key={i}>
          <rect x="16" y={20 + i * 28} width={110 - i * 12} height="8" rx="4" className="fill-muted/30" />
          <rect x="176" y={15 + i * 28} width="40" height="18" rx="9" className={enabled ? 'fill-accent' : 'fill-muted/30'} />
          <circle cx={enabled ? 207 : 185} cy={24 + i * 28} r="6" className="fill-surface" />
        </g>
      ))}
    </>
  );
}

function Route() {
  const pts: [number, number][] = [[20, 110], [70, 70], [120, 88], [170, 40], [220, 56]];
  return (
    <>
      <polyline points={pts.map((p) => p.join(',')).join(' ')} className="fill-none stroke-muted/40" strokeWidth="4" strokeLinejoin="round" />
      {pts.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="7" className={i === 3 ? 'fill-accent' : 'fill-surface stroke-muted/40'} strokeWidth="2" />
      ))}
    </>
  );
}

function Bars() {
  const heights = [40, 70, 55, 95, 62, 80];
  return (
    <>
      <line x1="14" y1="124" x2="226" y2="124" className="stroke-muted/40" strokeWidth="2" />
      {heights.map((h, i) => (
        <rect key={i} x={22 + i * 34} y={124 - h} width="22" height={h} rx="3" className={i === 3 ? 'fill-accent' : 'fill-muted/30'} />
      ))}
    </>
  );
}

function Ledgers() {
  return (
    <>
      {[16, 128].map((x, l) => (
        <g key={x}>
          <rect x={x} y="14" width="96" height="112" rx="6" className={card} />
          {[0, 1, 2, 3].map((r) => (
            <g key={r}>
              <rect x={x + 10} y={30 + r * 24} width="48" height="7" rx="3.5" className="fill-muted/30" />
              {l === 1 && <path d={`M${x + 70} ${33 + r * 24}l5 5 9-10`} className={`fill-none ${r === 2 ? 'stroke-accent' : 'stroke-muted/40'}`} strokeWidth="2.5" strokeLinecap="round" />}
            </g>
          ))}
        </g>
      ))}
    </>
  );
}

function Browser() {
  return (
    <>
      <rect x="14" y="14" width="212" height="112" rx="8" className={card} />
      <line x1="14" y1="34" x2="226" y2="34" className="stroke-muted/40" />
      {[26, 38, 50].map((x) => (
        <circle key={x} cx={x} cy="24" r="3.5" className="fill-muted/30" />
      ))}
      <rect x="30" y="50" width="120" height="10" rx="5" className="fill-accent" />
      <rect x="30" y="70" width="170" height="8" rx="4" className="fill-muted/30" />
      <rect x="30" y="86" width="150" height="8" rx="4" className="fill-muted/30" />
    </>
  );
}

const SKETCHES: Record<SketchSlug, () => React.ReactElement> = {
  'practice-manager': Kanban,
  'edenred-benefits-portal': Toggles,
  tris: Route,
  cwecs: Bars,
  'moowr-reconciliation': Ledgers,
};

function isKnown(slug: string): slug is SketchSlug {
  return (SKETCH_SLUGS as readonly string[]).includes(slug);
}

/** Small abstract picture of what a project does. Decorative only. */
export function CaseStudySketch({ slug, className = '' }: { slug: string; className?: string }) {
  const known = isKnown(slug);
  const Body = known ? SKETCHES[slug] : Browser;
  return (
    <svg viewBox="0 0 240 140" aria-hidden="true" data-sketch={known ? slug : 'generic'} className={className}>
      <Body />
    </svg>
  );
}
