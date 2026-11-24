import { OG_SIZE, renderOg } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'Angad Kumar — Full-stack engineer (.NET + TypeScript)';

export default function Image() {
  return renderOg({ kicker: 'Portfolio', title: 'Building secure .NET APIs and TypeScript apps' });
}
