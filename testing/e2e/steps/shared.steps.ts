import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/app.fixture';

const { Given, When, Then } = createBdd(test);

// ─── Setup (Given) — navigates to the page ───────────────────────────────────

Given('I am not logged in', async ({ page }) => {
  await page.context().clearCookies();
});

Given('I am on the login page', async ({ page }) => {
  await page.goto('/auth/login');
});

Given('I am on the register page', async ({ page }) => {
  await page.goto('/auth/register');
});

Given('I am on the forgot password page', async ({ page }) => {
  await page.goto('/auth/forgot-password');
});

When('I navigate to {string}', async ({ page }, path: string) => {
  const pageUrl = page.url();
  // Skip hard reload when the fixture already navigated to this area.
  // page.goto() on a same-origin protected route causes Angular to restart
  // before the Firestore user fetch completes, making the auth guard redirect to login.
  if (path !== '/' && pageUrl.startsWith('http') && new URL(pageUrl).pathname.startsWith(path)) {
    return;
  }
  await page.goto(path);
});

// ─── Assertions — URL checks (Then) ──────────────────────────────────────────

Then('I should be on the login page', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/login/);
});

Then('I should be on the register page', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/register/);
});

Then('I should be on the forgot password page', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/forgot-password/);
});

Then('I should remain on the login page', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/login/);
});

Then('I should remain on the forgot password page', async ({ page }) => {
  await expect(page).toHaveURL(/\/auth\/forgot-password/);
});

Then('I am redirected to the user dashboard', async ({ page }) => {
  await expect(page).toHaveURL(/\/home/, { timeout: 10_000 });
});

Then('I am redirected to the admin dashboard', async ({ page }) => {
  await expect(page).toHaveURL(/\/home/, { timeout: 10_000 });
});

// ─── Form interactions ────────────────────────────────────────────────────────

When('I fill in the email field with {string}', async ({ page }, value: string) => {
  await page.locator('#email').fill(value);
});

When('I fill in the password field with {string}', async ({ page }, value: string) => {
  await page.locator('#password').fill(value);
});

When('I click the {string} button', async ({ page }, label: string) => {
  await page.getByRole('button', { name: label, exact: true }).click();
});

When('I click the {string} link', async ({ page }, label: string) => {
  await page.getByRole('link', { name: label }).click();
});

// ─── Assertions — element visibility ─────────────────────────────────────────

Then('the email input is visible', async ({ page }) => {
  await expect(page.locator('#email')).toBeVisible();
});

Then('the password input is visible', async ({ page }) => {
  await expect(page.locator('#password')).toBeVisible();
});

Then('the {string} button is enabled', async ({ page }, label: string) => {
  await expect(page.getByRole('button', { name: label, exact: true })).toBeEnabled();
});

Then('the {string} button is disabled', async ({ page }, label: string) => {
  await expect(page.getByRole('button', { name: label, exact: true })).toBeDisabled();
});

Then('the {string} button is visible', async ({ page }, label: string) => {
  await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
});

Then('a {string} link is visible', async ({ page }, label: string) => {
  await expect(page.getByRole('link', { name: label })).toBeVisible();
});

// ─── Assertions — messages ────────────────────────────────────────────────────

Then('I see the error {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('alert').filter({ hasText: message })).toBeVisible();
});

Then('I see the success message {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('status').filter({ hasText: message })).toBeVisible();
});

Then('I see at least one validation error', async ({ page }) => {
  await expect(page.getByRole('alert').first()).toBeVisible();
});

Then('I see the validation error {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('alert').filter({ hasText: message })).toBeVisible();
});
