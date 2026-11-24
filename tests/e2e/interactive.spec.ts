import { expect, test } from '@playwright/test';

test('terminal opens with backtick and navigates', async ({ page }) => {
  await page.goto('/experience', { waitUntil: 'networkidle' });
  await page.keyboard.press('Backquote');
  const input = page.getByRole('textbox', { name: 'Terminal command' });
  await expect(input).toBeFocused();
  await input.fill('help');
  await input.press('Enter');
  await expect(page.getByText('Available commands:')).toBeVisible();
  await input.fill('contact');
  await input.press('Enter');
  await expect(page).toHaveURL(/\/contact$/);
});

test('command palette navigates with Ctrl+K', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('dialog', { name: 'Command palette' })).toBeVisible();
  await page.keyboard.type('Experience');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/experience$/);
});

test('theme choice persists across reloads', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  // header and hero both have a toggle; use the header one
  await page.getByRole('banner').getByRole('button', { name: 'Toggle colour theme' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});
