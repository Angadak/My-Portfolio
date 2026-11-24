export type Theme = 'light' | 'dark';

export const THEME_KEY = 'theme';

export function resolveTheme(stored: string | null | undefined, systemDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored;
  return systemDark ? 'dark' : 'light';
}

export function toggleTheme(current: Theme): Theme {
  return current === 'dark' ? 'light' : 'dark';
}

/** Flips the theme on <html>, persists it, and returns the new theme. Browser only. */
export function toggleDocumentTheme(): Theme {
  const root = document.documentElement;
  let stored: string | null = null;
  try {
    stored = window.localStorage.getItem(THEME_KEY);
  } catch {
    // storage blocked: fall back to the system setting
  }
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const next = toggleTheme(resolveTheme(root.dataset.theme ?? stored, systemDark));
  root.dataset.theme = next;
  try {
    window.localStorage.setItem(THEME_KEY, next);
  } catch {
    // storage blocked: the choice lasts for this page view only
  }
  return next;
}

/** Inline <head> script: marks JS as available and applies a stored theme before first paint. */
export const themeInitScript = `(function(){try{var d=document.documentElement;d.classList.add('js');var t=localStorage.getItem('${THEME_KEY}');if(t==='light'||t==='dark')d.dataset.theme=t;}catch(e){}})();`;
