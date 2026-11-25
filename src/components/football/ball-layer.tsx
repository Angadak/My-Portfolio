'use client';

import dynamic from 'next/dynamic';

// Loaded after hydration so the hero paints first.
const BallJourney = dynamic(() => import('./ball-journey').then((m) => m.BallJourney), { ssr: false });

export function BallLayer() {
  return <BallJourney />;
}
