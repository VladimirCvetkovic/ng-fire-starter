import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/app.fixture';

const { When, Then } = createBdd(test);

// ─── Register — step 0 ───────────────────────────────────────────────────────

When('I select the {string} role', async ({ page }, role: string) => {
  if (role === 'user') {
    await page.getByRole('button', { name: /user/i }).first().click();
  } else {
    await page.getByRole('button', { name: /administrator/i }).click();
  }
});

// ─── Register — step 1 ───────────────────────────────────────────────────────

When('I fill in the name field with {string}', async ({ page }, value: string) => {
  await page.locator('#name').fill(value);
});

When('I fill in the registration email field with {string}', async ({ page }, value: string) => {
  await page.locator('#reg-email').fill(value);
});

When('I fill in the phone field with {string}', async ({ page }, value: string) => {
  await page.locator('#phone').fill(value);
});

When('I fill in the registration password field with {string}', async ({ page }, value: string) => {
  await page.locator('#reg-pwd').fill(value);
});

When('I fill in the confirm password field with {string}', async ({ page }, value: string) => {
  await page.locator('#reg-confirm-pwd').fill(value);
});

Then('the phone number input is visible', async ({ page }) => {
  await expect(page.locator('#phone')).toBeVisible();
});

// ─── Dashboard ───────────────────────────────────────────────────────────────

Then('I see a welcome message', async ({ page }) => {
  await expect(page.getByText(/welcome/i)).toBeVisible();
});

Then('the drawer is visible', async ({ page }) => {
  await expect(
    page.getByRole('dialog').or(page.locator('[data-testid="drawer"]'))
  ).toBeVisible({ timeout: 5_000 });
});

Then('the bottom sheet is visible', async ({ page }) => {
  await expect(
    page.getByRole('dialog').or(page.locator('[data-testid="bottom-sheet"]'))
  ).toBeVisible({ timeout: 5_000 });
});

Then('the banner is visible', async ({ page }) => {
  await expect(page.locator('placeholder-banner')).toBeVisible({ timeout: 5_000 });
});
