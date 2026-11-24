import { describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PanelBoundary } from '@/components/interactive/panel-boundary';
import { TOAST, type ToastDetail } from '@/lib/events';

function Boom(): never {
  throw new Error('chunk failed');
}

describe('PanelBoundary', () => {
  it('closes and toasts when the child throws', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const onClose = vi.fn();
    const seen: ToastDetail[] = [];
    const listener = (e: Event) => seen.push((e as CustomEvent<ToastDetail>).detail);
    window.addEventListener(TOAST, listener);
    const { container } = render(
      <PanelBoundary onClose={onClose}>
        <Boom />
      </PanelBoundary>,
    );
    window.removeEventListener(TOAST, listener);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(seen).toEqual([{ message: "Couldn't open that. Reload the page and try again.", tone: 'error' }]);
    expect(container).toBeEmptyDOMElement();
    vi.restoreAllMocks();
  });

  it('renders children when healthy', () => {
    const { getByText } = render(
      <PanelBoundary onClose={vi.fn()}>
        <p>ok</p>
      </PanelBoundary>,
    );
    expect(getByText('ok')).toBeInTheDocument();
  });
});
