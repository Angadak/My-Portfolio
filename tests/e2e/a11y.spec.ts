import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = ['/', '/work', '/work/practice-manager', '/experience', '/contact', '/does-not-exist'];

for (const colorScheme of ['light', 'dark'] as const) {
  for (const route of routes) {
    test(`${route} has no axe violations (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme, reducedMotion: 'reduce' });
      await page.goto(route);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        // the giant hero word is decorative and aria-hidden
        .exclude('[data-decorative]')
        .analyze();
      expect(results.violations).toEqual([]);
    });
  }
}
