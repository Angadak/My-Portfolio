import { expect, test } from '@playwright/test';

test('cycles words by click and keyboard', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByRole('region', { name: /skills showcase/i });
  await expect(stage.getByText(/^01 \//)).toBeVisible();
  await stage.click({ position: { x: 40, y: 140 } });
  await expect(stage.getByText(/^02 \//)).toBeVisible();
  await stage.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(stage.getByText(/^01 \//)).toBeVisible();
});

test('auto-advances when idle', async ({ page }) => {
  await page.goto('/');
  const stage = page.getByRole('region', { name: /skills showcase/i });
  await expect(stage.getByText(/^02 \//)).toBeVisible({ timeout: 6000 });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('does not auto-advance', async ({ page }) => {
    await page.goto('/');
    const stage = page.getByRole('region', { name: /skills showcase/i });
    await page.waitForTimeout(5000);
    await expect(stage.getByText(/^01 \//)).toBeVisible();
  });
});
