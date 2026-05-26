---
name: e2e-testing
description: Playwright + Gherkin (BDD) end-to-end testing expert for Angular apps. Use for writing .feature files, step definitions, page objects, and fixtures. Do NOT use for unit tests — unit tests belong in the Angular skill.
---

# E2E Testing — Playwright + Gherkin (BDD)

End-to-end tests live in `testing/` at the project root. They test real user flows against the running app using **Gherkin** feature files and **Playwright** for browser automation via `playwright-bdd`.

## When to Use This Skill

- Writing a new `.feature` file
- Adding or updating step definitions
- Creating or updating a Page Object Model
- Adding custom fixtures
- Debugging flaky e2e tests
- Configuring Playwright or playwright-bdd

## Do NOT Use This Skill When

- Writing Angular unit tests (use `angular` skill — TestBed, ComponentFixture)
- Writing isolated service/pipe/guard tests

---

## Project Structure

```
testing/
├── playwright.config.ts          # Playwright + playwright-bdd config
├── e2e/
│   ├── features/                 # Gherkin .feature files — one per feature area
│   │   └── auth/
│   │       └── auth-login.feature
│   ├── steps/                    # Step definitions — implement the Gherkin steps
│   │   ├── shared.steps.ts       # Shared navigation, form fill, assertion steps
│   │   ├── auth.steps.ts         # Auth-specific steps
│   │   └── dashboard.steps.ts    # Dashboard steps (uses logged-in fixtures)
│   ├── pages/                    # Page Object Models — selectors per page
│   │   └── auth-login.page.ts
│   └── fixtures/
│       └── app.fixture.ts        # userPage and adminPage pre-authenticated fixtures
├── .features-gen/                # Auto-generated from .feature files (git-ignored)
└── .env.test                     # Local credentials (git-ignored)
```

---

## playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const testDir = defineBddConfig({
  features: 'e2e/features/**/*.feature',
  steps: 'e2e/steps/**/*.ts',
  outputDir: '.features-gen',
});

export default defineConfig({
  testDir,
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  ],
  webServer: {
    command: 'npm run start --prefix ../frontend',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env['CI'],
    timeout: 120_000,
  },
});
```

---

## Gherkin Feature File

```gherkin
Feature: Login

  Background:
    Given I am on the login page

  Scenario: Login form renders correctly
    Then the email input is visible
    And the "Sign in" button is enabled

  Scenario: Wrong credentials show an error
    When I fill in the email field with "wrong@email.com"
    And I fill in the password field with "wrongpassword"
    And I click the "Sign in" button
    Then I see the error "Incorrect email or password"

  Scenario: Successful login as a regular user
    When I fill in the email field with "user@app.com"
    And I fill in the password field with "user1234"
    And I click the "Sign in" button
    Then I am redirected to the user dashboard
```

**Rules:**
- One `.feature` file per feature area — `auth-login.feature`, `dashboard.feature`
- `Background:` runs before every scenario in the file
- Use `Scenario Outline:` + `Examples:` for data-driven scenarios
- Scenario titles are the living documentation — write them for a non-technical reader

---

## Step Definitions

Steps live in `e2e/steps/`. Always check `shared.steps.ts` before adding a new step — reuse where possible.

```typescript
import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import { test } from '../fixtures/app.fixture';

const { Given, When, Then } = createBdd(test);

Given('I am on the login page', async ({ page }) => {
  await page.goto('/auth/login');
});

When('I fill in the email field with {string}', async ({ page }, value: string) => {
  await page.locator('#email').fill(value);
});

Then('I see the error {string}', async ({ page }, message: string) => {
  await expect(page.getByRole('alert').filter({ hasText: message })).toBeVisible();
});

Then('I am redirected to the user dashboard', async ({ page }) => {
  await expect(page).toHaveURL(/\/user/, { timeout: 10_000 });
});
```

**Rules:**
- Import `test` from `../fixtures/app.fixture` — not from `@playwright/test` directly
- Use `{string}` for quoted parameters in step text
- Do not duplicate a step already defined in `shared.steps.ts`
- Use POM classes for complex interactions, raw `page` locators for simple ones

---

## Page Object Model

```typescript
// e2e/pages/auth-login.page.ts
import { Page, Locator } from '@playwright/test';

export class AuthLoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(private page: Page) {
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', { name: /^sign in$/i });
  }

  async goto() {
    await this.page.goto('/auth/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

---

## Fixtures

Use fixtures to share authenticated state across scenarios.

```typescript
// e2e/fixtures/app.fixture.ts
import { test as base, Page } from '@playwright/test';
import { AuthLoginPage } from '../pages/auth-login.page';

type AppFixtures = { userPage: Page; adminPage: Page };

export const test = base.extend<AppFixtures>({
  userPage: async ({ page }, use) => {
    const login = new AuthLoginPage(page);
    await login.goto();
    await login.login(process.env['TEST_USER_EMAIL']!, process.env['TEST_USER_PASSWORD']!);
    await page.waitForURL(/\/user/);
    await use(page);
  },
  adminPage: async ({ page }, use) => {
    const login = new AuthLoginPage(page);
    await login.goto();
    await login.login(process.env['TEST_ADMIN_EMAIL']!, process.env['TEST_ADMIN_PASSWORD']!);
    await page.waitForURL(/\/admin/);
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

Use fixtures in step definitions via `createBdd(test)`:
```typescript
const { Given } = createBdd(test);  // test is the extended fixture

Given('I am logged in as a user', async ({ userPage: _page }) => {
  // the fixture already handled login
});
```

---

## Selector Priority

| Priority | Selector | Example |
|---|---|---|
| 1 | Role | `getByRole('button', { name: /submit/i })` |
| 2 | Label | `getByLabel('Email address')` |
| 3 | ID | `locator('#email')` |
| 4 | Placeholder | `getByPlaceholder('Search...')` |
| 5 | Text | `getByText('Sign in')` |
| 6 | Test ID | `getByTestId('submit-btn')` |
| Last resort | CSS | `locator('.submit-button')` |

---

## Running Tests

```bash
# From testing/
npm test              # bddgen + playwright test (headless)
npm run test:ui       # bddgen + playwright test --ui
npm run test:debug    # bddgen + playwright test --debug
npm run bddgen        # generate .features-gen/ only (no test run)
npm run report        # open last HTML report
```

---

## Environment Variables

`testing/.env.test` (git-ignored):

```
TEST_USER_EMAIL=user@app.com
TEST_USER_PASSWORD=user1234
TEST_ADMIN_EMAIL=admin@app.com
TEST_ADMIN_PASSWORD=admin1234
```

These match the users created by the Firebase Emulator seed script.

---

## CI Integration (GitHub Actions)

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps
  working-directory: testing

- name: Run E2E tests
  run: npm test
  working-directory: testing
  env:
    CI: true
    TEST_USER_EMAIL: ${{ secrets.TEST_USER_EMAIL }}
    TEST_USER_PASSWORD: ${{ secrets.TEST_USER_PASSWORD }}
    TEST_ADMIN_EMAIL: ${{ secrets.TEST_ADMIN_EMAIL }}
    TEST_ADMIN_PASSWORD: ${{ secrets.TEST_ADMIN_PASSWORD }}

- name: Upload Playwright report
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: playwright-report
    path: testing/playwright-report/
```
