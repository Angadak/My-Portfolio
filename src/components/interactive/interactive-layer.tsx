'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { OPEN_PALETTE, OPEN_TERMINAL } from '@/lib/events';
import { PanelBoundary } from './panel-boundary';
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
  const panelRef = useRef<Panel>(null);

  const show = useCallback((next: Exclude<Panel, null>) => {
    if (panelRef.current === null && document.activeElement instanceof HTMLElement) lastFocus.current = document.activeElement;
    panelRef.current = next;
    setPanel(next);
  }, []);

  const close = useCallback(() => {
    panelRef.current = null;
    setPanel(null);
    window.requestAnimationFrame(() => {
      if (lastFocus.current?.isConnected) lastFocus.current.focus();
    });
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

  useEffect(() => {
    if (panel === null) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = previous;
    };
  }, [panel]);

  if (panel === 'terminal') {
    return (
      <PanelBoundary key="terminal" onClose={close}>
        <Terminal ctx={index} onClose={close} />
      </PanelBoundary>
    );
  }
  if (panel === 'palette') {
    return (
      <PanelBoundary key="palette" onClose={close}>
        <CommandPalette index={index} onClose={close} />
      </PanelBoundary>
    );
  }
  return null;
}
