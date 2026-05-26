import { test as base } from 'playwright-bdd';
import { Page } from '@playwright/test';
import { AuthLoginPage } from '../pages/auth-login.page';

type AppFixtures = {
  userPage: Page;
  adminPage: Page;
};

export const test = base.extend<AppFixtures>({
  userPage: async ({ page }, use) => {
    const loginPage = new AuthLoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env['TEST_USER_EMAIL']!,
      process.env['TEST_USER_PASSWORD']!,
    );
    await page.waitForURL(/\/home/);
    await use(page);
  },

  adminPage: async ({ page }, use) => {
    const loginPage = new AuthLoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      process.env['TEST_ADMIN_EMAIL']!,
      process.env['TEST_ADMIN_PASSWORD']!,
    );
    await page.waitForURL(/\/home/);
    await use(page);
  },
});

export { expect } from '@playwright/test';
