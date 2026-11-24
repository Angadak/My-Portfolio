import { vi } from 'vitest';

const mediaState: Record<string, boolean> = {};

export function setMedia(query: string, matches: boolean): void {
  mediaState[query] = matches;
}

export function resetMedia(): void {
  for (const key of Object.keys(mediaState)) delete mediaState[key];
}

export function installMatchMedia(): void {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: mediaState[query] ?? false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  readonly root = null;
  readonly rootMargin = '';
  readonly thresholds: number[] = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];

  constructor(private readonly callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }

  trigger(isIntersecting: boolean, target: Element): void {
    this.callback(
      [{ isIntersecting, target } as unknown as IntersectionObserverEntry],
      this as unknown as IntersectionObserver,
    );
  }
}
