'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { OPEN_PALETTE, OPEN_TERMINAL } from '@/lib/events';
import type { SiteIndex } from '@/lib/site';

const Terminal = dynamic(() => import('@/components/terminal/terminal').then((m) => m.Terminal), { ssr: false });
const CommandPalette = dynamic(() => import('@/components/palette/command-palette').then((m) => m.CommandPalette), { ssr: false });

type Panel = 'terminal' | 'palette' | null;

function isTyping(target: EventTarget | null): boolean {
  return target instanceof HTMLElement && (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName));
}

export function InteractiveLayer({ index }: { index: SiteIndex }) {
  const [panel, setPanel] = useState<Panel>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  const show = useCallback((next: Exclude<Panel, null>) => {
    if (document.activeElement instanceof HTMLElement) lastFocus.current = document.activeElement;
    setPanel(next);
  }, []);

  const close = useCallback(() => {
    setPanel(null);
    window.requestAnimationFrame(() => lastFocus.current?.focus());
  }, []);

  useEffect(() => {
    const onTerminal = () => show('terminal');
    const onPalette = () => show('palette');
    function onKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        show('palette');
      } else if (event.key === '`' && !isTyping(event.target)) {
        event.preventDefault();
        show('terminal');
      }
    }
    window.addEventListener(OPEN_TERMINAL, onTerminal);
    window.addEventListener(OPEN_PALETTE, onPalette);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener(OPEN_TERMINAL, onTerminal);
      window.removeEventListener(OPEN_PALETTE, onPalette);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [show]);

  if (panel === 'terminal') return <Terminal ctx={index} onClose={close} />;
  if (panel === 'palette') return <CommandPalette index={index} onClose={close} />;
  return null;
}
