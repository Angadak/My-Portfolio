import { expect, test, type Page } from '@playwright/test';

async function fill(page: Page, email: string) {
  await page.getByRole('textbox', { name: 'Name' }).fill('Test Recruiter');
  await page.getByRole('textbox', { name: 'Email' }).fill(email);
  await page.getByRole('textbox', { name: 'Message' }).fill('We would like to talk about a full-stack role.');
  await page.clock.fastForward(3500);
  await page.getByRole('button', { name: 'Send message' }).click();
}

test('validates before sending', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send message' }).click();
  await expect(page.getByText('Enter your name')).toBeVisible();
});

test('sends a message and clears the form', async ({ page }) => {
  await page.clock.install();
  await page.goto('/contact');
  await fill(page, 'recruiter@example.com');
  // the sentence also appears in the toast, so look inside the form
  await expect(page.locator('form').getByText('Thanks, your message is on its way.')).toBeVisible();
  await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('');
});

test('shows an error with a mailto fallback when sending fails', async ({ page }) => {
  await page.clock.install();
  await page.goto('/contact');
  await fill(page, 'recruiter@fail.test');
  const alert = page.getByRole('alert').filter({ hasText: "couldn't be sent" });
  await expect(alert).toContainText("couldn't be sent");
  await expect(alert.getByRole('link')).toHaveAttribute('href', /^mailto:/);
});
