# E2E Testing — Playwright + Gherkin (BDD)

End-to-end tests that validate user flows against the running application.

> **All tests MUST be written in Gherkin.** Create a `.feature` file in `e2e/features/` and implement the steps in `e2e/steps/`. Do not write raw Playwright `test()` blocks directly.

Tests are written in **Gherkin** (`.feature` files) and executed by **Playwright** via `playwright-bdd`.

## Prerequisites

- Node.js 18+
- Angular app must be installable (`cd ../frontend && npm install`)

## Setup

```bash
cd testing
npm install
npx playwright install   # downloads Chromium & Firefox (~300 MB)
```

## Environment Variables

Create `testing/.env.test` (git-ignored):

```
TEST_USER_EMAIL=user@app.com
TEST_USER_PASSWORD=user1234
TEST_ADMIN_EMAIL=admin@app.com
TEST_ADMIN_PASSWORD=admin1234
```

These match the users created by the Firebase Emulator seed script (`npm run seed` in `frontend/`).

## Running Tests

```bash
# Generate Playwright tests from .feature files, then run (headless)
npm test

# Interactive UI mode — recommended when writing new tests
npm run test:ui

# Step-through debug mode
npm run test:debug

# Open the last HTML report
npm run report

# Re-generate Playwright files from .feature files only (no test run)
npm run bddgen
```

> Playwright starts the Angular dev server automatically before tests.
> If Angular is already running on `localhost:4200` it will not be started again.

## Structure

```
testing/
├── playwright.config.ts          # Playwright + playwright-bdd configuration
├── package.json
├── tsconfig.json
├── .env.test                     # Local credentials (git-ignored)
├── .features-gen/                # Auto-generated test files from .feature files (git-ignored)
└── e2e/
    ├── features/                 # Gherkin .feature files — one per feature area
    │   ├── auth/
    │   │   ├── auth-login.feature
    │   │   ├── auth-register.feature
    │   │   ├── auth-forgot-password.feature
    │   │   └── auth-navigation.feature
    │   └── dashboard/
    │       └── dashboard.feature
    ├── steps/                    # Step definitions — implement the Gherkin steps
    │   ├── shared.steps.ts       # Reusable steps (navigation, form fill, assertions)
    │   ├── auth.steps.ts         # Auth-specific steps (role selection, register fields)
    │   └── dashboard.steps.ts    # Dashboard-specific steps (logged-in fixtures)
    ├── pages/                    # Page Object Models — selectors and actions per page
    │   ├── auth-login.page.ts
    │   ├── auth-register.page.ts
    │   ├── auth-forgot-password.page.ts
    │   └── dashboard.page.ts
    └── fixtures/
        └── app.fixture.ts        # userPage and adminPage fixtures (pre-authenticated)
```

## How It Works

1. `.feature` files contain human-readable **Gherkin** scenarios
2. `npm run bddgen` (or `npm test`) reads the feature files and generates Playwright test files in `.features-gen/`
3. Playwright runs those generated files exactly like normal tests

## Writing New Tests

Load `.claude/skills/e2e-testing/SKILL.md` before writing tests.

**Quick guide:**

1. Add or edit a `.feature` file in `e2e/features/`
2. Implement any missing steps in `e2e/steps/` (reuse steps from `shared.steps.ts` where possible)
3. Run `npm run test:ui` to see results

**Key rules:**
- One `.feature` file per feature area
- Reuse steps from `shared.steps.ts` — do not duplicate step definitions
- Step definitions use POM classes from `e2e/pages/` — no raw CSS selectors in steps
- Tests are independent — no shared mutable state between `Scenario` blocks
- `Background:` sets up state that applies to every scenario in a feature
