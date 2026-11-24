import { expect, test } from '@playwright/test';

const routes = ['/', '/work', '/work/practice-manager', '/work/edenred-benefits-portal', '/work/tris', '/experience', '/contact'];

for (const route of routes) {
  test(`${route} loads with one h1`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
  });
}

test('unknown routes show the 404 page', async ({ page }) => {
  const response = await page.goto('/does-not-exist');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { name: /coffee break/i })).toBeVisible();
});

test('empty sections stay hidden in production', async ({ page }) => {
  expect((await page.goto('/projects'))?.status()).toBe(404);
  expect((await page.goto('/blog'))?.status()).toBe(404);
});

test('CV, RSS, sitemap and robots are served', async ({ request }) => {
  const cv = await request.get('/cv.pdf');
  expect(cv.status()).toBe(200);
  expect(cv.headers()['content-type']).toContain('pdf');
  expect((await request.get('/blog/rss.xml')).headers()['content-type']).toContain('xml');
  expect(await (await request.get('/sitemap.xml')).text()).toContain('/work/practice-manager');
  expect(await (await request.get('/robots.txt')).text()).toContain('sitemap.xml');
});
