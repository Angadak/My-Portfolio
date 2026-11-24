export const OPEN_TERMINAL = 'portfolio:open-terminal';
export const OPEN_PALETTE = 'portfolio:open-palette';
export const TOAST = 'portfolio:toast';

export type ToastTone = 'info' | 'error';
export type ToastDetail = { message: string; tone: ToastTone };

export function openTerminal(): void {
  window.dispatchEvent(new Event(OPEN_TERMINAL));
}

export function openPalette(): void {
  window.dispatchEvent(new Event(OPEN_PALETTE));
}

export function toast(message: string, tone: ToastTone = 'info'): void {
  window.dispatchEvent(new CustomEvent<ToastDetail>(TOAST, { detail: { message, tone } }));
}
