import '@testing-library/jest-dom/vitest';
import { createElement } from 'react';
import { Blob as NodeBlob } from 'node:buffer';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { installMatchMedia, MockIntersectionObserver, resetMedia } from './helpers/media';

// next/link needs the App Router at click time; tests only need a plain anchor.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) =>
    createElement('a', { href, ...rest }, children),
}));

// jsdom's Blob lacks .stream(), which shiki's inlined wasm loader needs.
vi.stubGlobal('Blob', NodeBlob);
installMatchMedia();
vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
vi.stubGlobal(
  'ResizeObserver',
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);
Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  cleanup();
  resetMedia();
  MockIntersectionObserver.instances.length = 0;
  document.documentElement.removeAttribute('data-theme');
  window.localStorage.clear();
});
