import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

export function renderOg({ kicker, title }: { kicker: string; title: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#0d0d10',
          color: '#ededf0',
          padding: 72,
        }}
      >
        <div style={{ display: 'flex', fontSize: 28, color: '#a78bfa', letterSpacing: 4, textTransform: 'uppercase' }}>{kicker}</div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 800, lineHeight: 1.05, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#8a8a93' }}>
          <span>Angad Kumar</span>
          <span>Full-stack engineer · .NET + TypeScript</span>
        </div>
      </div>
    ),
    OG_SIZE,
  );
}
