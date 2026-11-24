'use client';

import { Component, type ReactNode } from 'react';
import { toast } from '@/lib/events';

type Props = { onClose: () => void; children: ReactNode };

/** Closes the panel and shows a toast if a lazy chunk fails to load or the panel throws. */
export class PanelBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    toast("Couldn't open that. Reload the page and try again.", 'error');
    this.props.onClose();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
