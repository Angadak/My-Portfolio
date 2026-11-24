export const PROP_NAMES = ['database', 'browser', 'api', 'cloud', 'mug'] as const;
export type PropName = (typeof PROP_NAMES)[number];

const svgProps = {
  viewBox: '0 0 150 150',
  'aria-hidden': true as const,
  focusable: false as const,
  className: 'h-auto w-full',
};

function DatabaseProp() {
  return (
    <svg {...svgProps}>
      <path d="M29 36v78c0 8 20 14 46 14s46-6 46-14V36" className="fill-surface stroke-fg" strokeWidth={3} />
      <path d="M29 62c0 8 20 14 46 14s46-6 46-14M29 88c0 8 20 14 46 14s46-6 46-14" fill="none" className="stroke-fg" strokeWidth={3} />
      <ellipse cx="75" cy="36" rx="46" ry="14" className="fill-surface stroke-fg" strokeWidth={3} />
      <circle cx="104" cy="72" r="4" className="fill-accent" />
      <circle cx="104" cy="98" r="4" className="fill-accent" />
    </svg>
  );
}

function BrowserProp() {
  return (
    <svg {...svgProps}>
      <rect x="14" y="28" width="122" height="94" rx="8" className="fill-surface stroke-fg" strokeWidth={3} />
      <path d="M14 46h122" className="stroke-fg" strokeWidth={3} />
      <circle cx="26" cy="37" r="3" className="fill-accent" />
      <circle cx="36" cy="37" r="3" className="fill-fg" />
      <rect x="26" y="58" width="44" height="52" rx="4" className="fill-accent" />
      <rect x="78" y="58" width="46" height="8" rx="3" className="fill-fg" />
      <rect x="78" y="74" width="36" height="8" rx="3" className="fill-muted" />
      <rect x="78" y="90" width="42" height="20" rx="10" fill="none" className="stroke-fg" strokeWidth={3} />
    </svg>
  );
}

function ApiProp() {
  return (
    <svg {...svgProps}>
      <rect x="12" y="30" width="126" height="90" rx="8" className="fill-fg" />
      <text x="26" y="62" className="fill-accent font-mono" style={{ fontSize: 15, fontWeight: 700 }}>GET</text>
      <text x="62" y="62" className="fill-bg font-mono" style={{ fontSize: 15 }}>/me</text>
      <text x="26" y="88" className="fill-success font-mono" style={{ fontSize: 14 }}>200 OK</text>
      <rect x="26" y="98" width="10" height="14" className="fill-accent" />
    </svg>
  );
}

function CloudProp() {
  return (
    <svg {...svgProps}>
      <path
        d="M44 108c-17 0-28-11-28-25s11-25 26-25c4-17 18-28 35-28 20 0 35 14 37 33 13 1 22 11 22 22 0 13-10 23-24 23z"
        className="fill-surface stroke-fg"
        strokeWidth={3}
      />
      <path d="M60 84l14 12 22-26" fill="none" className="stroke-accent" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MugProp() {
  return (
    <svg {...svgProps}>
      <path d="M58 30q-8-12 2-22M76 30q-8-12 2-22M94 30q-8-12 2-22" fill="none" className="stroke-muted" strokeWidth={3} strokeLinecap="round" />
      <path d="M108 58q26 0 26 22t-26 22" fill="none" className="stroke-fg" strokeWidth={8} />
      <rect x="34" y="40" width="74" height="86" rx="10" className="fill-surface stroke-fg" strokeWidth={3} />
      <text x="46" y="92" className="fill-accent" style={{ fontSize: 22, fontWeight: 900 }}>C#</text>
    </svg>
  );
}

const PROPS: Record<PropName, () => React.JSX.Element> = {
  database: DatabaseProp,
  browser: BrowserProp,
  api: ApiProp,
  cloud: CloudProp,
  mug: MugProp,
};

export function PropIcon({ name }: { name: PropName }) {
  const Prop = PROPS[name];
  return <Prop />;
}
