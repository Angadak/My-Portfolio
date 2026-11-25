import { expect, test, type Page } from '@playwright/test';

async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
}

async function nextFrames(page: Page) {
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test('menu opens, navigates and closes with Escape', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const button = page.getByRole('button', { name: 'Open menu' });
  await button.click();
  const dialog = page.getByRole('dialog', { name: 'Site menu' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await dialog.getByRole('link', { name: 'Work' }).click();
  await expect(page).toHaveURL(/\/work$/);
  await expect(page.getByRole('dialog', { name: 'Site menu' })).toBeHidden();
});

test('menu works by keyboard alone', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Open menu' }).focus();
  await page.keyboard.press('Enter');
  const dialog = page.getByRole('dialog', { name: 'Site menu' });
  const links = dialog.getByRole('link');
  await expect(links.nth(0)).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(links.nth(1)).toBeFocused();
});

test('rail goal jumps to contact', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 900);
  const goal = page.getByRole('link', { name: 'Go to Contact' });
  await expect(goal).toBeVisible();
  await goal.click();
  await expect(page.getByRole('heading', { name: "Let's work together" })).toBeInViewport();
});

test('reduced motion keeps the ball on the rail', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/', { waitUntil: 'networkidle' });
  await page.mouse.wheel(0, 1200);
  const ball = page.locator('[data-ball]');
  await expect(ball).toHaveAttribute('data-mode', 'rail');
  const rail = page.locator('[data-ball-rail]');
  await expect
    .poll(async () => {
      const r = await rail.boundingBox();
      const b = await ball.boundingBox();
      return r && b ? Math.abs(r.x + r.width / 2 - (b.x + b.width / 2)) : 999;
    })
    .toBeLessThan(6);
});

test('ball scores at the bottom on a wide screen', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-ball]')).toHaveAttribute('data-mode', 'pitch');
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(page.locator('[data-ball-goal]')).toHaveAttribute('data-goal', 'scored');
});

test.describe('menu follow-ups', () => {
  test('Ctrl+K from the open menu swaps to the palette and keeps focus there', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu).toBeVisible();
    await page.keyboard.press('Control+k');
    const palette = page.getByRole('dialog', { name: 'Command palette' });
    await expect(menu).toBeHidden();
    await expect(palette).toBeVisible();
    await expect(palette.getByRole('combobox')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect.poll(() => palette.evaluate((el) => el.contains(document.activeElement))).toBe(true);
  });

  test('open menu has a "Close site menu" button', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Open menu' }).click();
    const menu = page.getByRole('dialog', { name: 'Site menu' });
    await expect(menu.getByRole('button', { name: 'Close site menu', exact: true })).toHaveCount(1);
  });
});

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false });

  test('the section rail is usable and its anchors jump', async ({ page }) => {
    await page.goto('/');
    const nav = page.getByRole('navigation', { name: 'Sections' });
    await expect(nav).not.toHaveAttribute('inert');
    await expect(nav).toBeVisible();
    await nav.getByRole('link', { name: 'Go to Contact' }).click();
    await expect(page).toHaveURL(/#contact-cta$/);
  });
});

test('rail is inert at the top and becomes usable after half a screen', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  // An inert nav is left out of the accessibility tree, so find it by its attribute.
  const nav = page.locator('nav[aria-label="Sections"]');
  await expect(nav).toHaveAttribute('inert');
  await page.evaluate(() => window.scrollTo(0, window.innerHeight * 0.5 + 200));
  await expect(nav).toHaveAttribute('data-visible');
  await expect(nav).not.toHaveAttribute('inert');
});

test('ball uses rail mode on a 1100px screen', async ({ page }) => {
  await page.setViewportSize({ width: 1100, height: 800 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const ball = page.locator('[data-ball]');
  await expect(ball).toBeAttached();
  // measure() runs after mount; wait for the first paint before reading the mode.
  await expect(ball).toHaveAttribute('style', /translate3d/);
  await expect(ball).toHaveAttribute('data-mode', 'rail');
});

test.describe('goal state', () => {
  test('clears after scrolling back to the top', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('[data-ball]')).toBeAttached();
    const goal = page.locator('[data-ball-goal]');
    await scrollToBottom(page);
    await expect(goal).toHaveAttribute('data-goal', 'scored');
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(goal).not.toHaveAttribute('data-goal');
  });

  test('is never set with reduced motion and the ball does not spin', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/', { waitUntil: 'networkidle' });
    const ball = page.locator('[data-ball]');
    await expect(ball).toBeAttached();
    await scrollToBottom(page);
    // Let several scroll frames run, then confirm the goal state never appeared.
    await page.waitForTimeout(800);
    await nextFrames(page);
    await expect(page.locator('[data-ball-goal]')).not.toHaveAttribute('data-goal');
    await expect(ball.locator('[data-ball-spin]')).toHaveAttribute('style', /rotate\(0deg\)/);
  });
});

for (const size of [
  { width: 320, height: 640 },
  { width: 375, height: 812 },
]) {
  test(`no horizontal overflow at ${size.width}x${size.height}`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/', { waitUntil: 'networkidle' });
    const ball = page.locator('[data-ball]');
    await expect(ball).toBeAttached();
    await scrollToBottom(page);
    await nextFrames(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    if (size.width === 320) {
      await expect.poll(() => ball.evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
    }
  });
}

test('rail clears the menu button in a landscape phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 740, height: 360 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const nav = page.getByRole('navigation', { name: 'Sections' });
  await page.evaluate(() => window.scrollTo(0, window.innerHeight));
  await expect(nav).toHaveAttribute('data-visible');
  const railBox = await nav.boundingBox();
  const buttonBox = await page.getByRole('button', { name: 'Open menu' }).boundingBox();
  expect(railBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(railBox!.height).toBeGreaterThan(0);
  expect(railBox!.y).toBeGreaterThanOrEqual(buttonBox!.y + buttonBox!.height);
});

test('the ball never takes clicks', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const ball = page.locator('[data-ball]');
  await expect(ball).toBeAttached();
  await page.evaluate(() => window.scrollTo(0, (document.documentElement.scrollHeight - window.innerHeight) / 2));
  await expect(ball).toHaveCSS('opacity', '1');
  await nextFrames(page);
  const box = await ball.boundingBox();
  expect(box).not.toBeNull();
  const centre = { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 };
  // The centre must be on screen, otherwise elementFromPoint proves nothing.
  expect(centre.x).toBeGreaterThan(0);
  expect(centre.x).toBeLessThan(1440);
  expect(centre.y).toBeGreaterThan(0);
  expect(centre.y).toBeLessThan(900);
  const hit = await page.evaluate(({ x, y }) => {
    const el = document.elementFromPoint(x, y);
    return { found: el !== null, inBall: el?.closest('[data-ball]') != null };
  }, centre);
  expect(hit.found).toBe(true);
  expect(hit.inBall).toBe(false);
});

test('home page logs no console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('[data-ball]')).toBeAttached();
  await page.mouse.wheel(0, 600);
  await scrollToBottom(page);
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
});

test('clicking the middle of a compact work card opens its case study', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const card = page.locator('[data-featured="compact"]').first();
  const href = await card.getByRole('link').getAttribute('href');
  expect(href).toMatch(/^\/work\/[\w-]+$/);
  await card.scrollIntoViewIfNeeded();
  await card.click();
  await expect(page).toHaveURL(new RegExp(`${href}$`));
});
