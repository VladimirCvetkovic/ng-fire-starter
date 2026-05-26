# NG Fire Starter

A production-ready Angular + Firebase starter template — everything you need to build a multi-role, multi-environment web application without writing the same boilerplate twice.

> **First-time setup:** Typing `install` or `setup` in your Claude AI Agent launches a step-by-step wizard that configures Firebase, replaces all placeholders, and optionally sets up GitHub Actions CI/CD.

---

## What's Included

### Application Shell

A fully wired layout is ready from day one — no scaffolding required:

| Component | Description |
|-----------|-------------|
| **Sidenav** | Collapsible left sidebar with role-based navigation, user avatar with initials, and persistent collapse state |
| **Drawer** | Wide slide-in panel (from right) — accepts any component or template via a signal-based service; supports keyboard dismiss |
| **Bottom Sheet** | Mobile-first overlay — drag-to-dismiss on touch, modal dialog on `md+` breakpoints, keyboard dismiss |
| **Banner** | Full-width top area for alerts or contextual messages — rendered via `NgComponentOutlet` |

### Theming

- **Light / Dark / System** mode — follows OS preference when set to System, persisted in `localStorage`
- **9 color palettes** switchable at runtime: Blue (default), Violet, Emerald, Rose, Amber, Red, Pink, Cyan, Orange
- Palette and theme are stored per user in Firestore and restored on login
- Implemented via CSS custom properties (`data-theme` + `data-palette` attributes on `<html>`)

### Localization (i18n)

- Powered by [`@jsverse/transloco`](https://github.com/jsverse/transloco) with runtime language switching (no build-time i18n splits)
- Ships with **English** and **Serbian** out of the box
- Language preference persisted in `localStorage`
- All user-visible strings are translation-keyed — no hardcoded text in templates

### SCSS Utility System

A modular utility-first SCSS layer built on CSS custom properties:

| Partial | Utilities |
|---------|-----------|
| `_typography` | Fluid font scale (`--text-xs` → `--text-4xl`), font families, weights |
| `_spacing` | Full spacing scale with `p-*`, `m-*`, `px-*`, `py-*`, `pt-*`, `pb-*` + responsive `md:` variants |
| `_flex` | `flex-row`, `flex-column`, `flex-wrap`, `justify-content-*`, `align-items-*`, `gap-*` |
| `_display` | `d-none`, `d-flex`, `d-grid` with `sm:`, `md:`, `lg:` breakpoint prefixes |
| `_sizing` | `w-100`, `h-100`, `max-w-*`, `overflow-*`, `position-*` |
| `_borders` | Border radius scale (`--radius-sm/md/lg/xl/full`), `.rounded-*`, `.border` |
| `_button` | `.btn`, `.btn-primary`, `.btn-ghost`, `.back-text-btn` |
| `_colors` | Semantic color utilities (`.text-primary`, `.bg-surface`, etc.) |
| `_grid` | Grid layout helpers |
| `_navigation` | Navigation element styles |

### Authentication (Firebase Auth + Firestore)

- Email/password login with reCAPTCHA v3 protection
- Multi-step registration (3 steps) with email verification gate
- Forgot password / reset password flow
- Role-based routing (`user` / `admin`) enforced by route guards
- Auth state managed as Angular Signals — no subscription boilerplate

### Shared Components

| Component | Purpose |
|-----------|---------|
| `shared-icon` | SVG icon renderer — references files from `public/icons/` via CSS `mask-image` |
| `shared-theme-switcher` | Light / Dark / System toggle |
| `shared-palette-switcher` | 9-palette color picker |
| `shared-language-switcher` | Runtime language selector |
| `shared-preferences-bar` | Combined theme + palette + language bar |
| `shared-step-dots` | Visual step indicators for multi-step forms |
| `shared-label-initials` (pipe) | Converts a display name to 2-letter initials |

### Developer Experience

- **Firebase Emulators** — local Auth and Firestore, no live project required during develop
- **Seed script** — populates emulators with two pre-configured users (`user@app.com` / `admin@app.com`) on first run
- **Vitest** unit testing (components, services, pipes — inside `frontend/`)
- **Playwright + Gherkin (BDD)** E2E testing — scenarios written in plain English `.feature` files, executed by Playwright via `playwright-bdd`; includes Page Object Models, fixtures, and HTML reports (inside `testing/`)
- **Prettier** code formatting
- **GitHub Actions** CI/CD pipeline with per-environment Firebase deployments

---

## Screenshots

### Authentication

| Login (Light) | Login (Dark) | Login (Mobile) |
|---|---|---|
| ![Login light](docs/screenshots/auth-login-light.png) | ![Login dark](docs/screenshots/auth-login-dark.png) | ![Login mobile](docs/screenshots/auth-login-mobile.png) |

| Register – Role selection | Register – Basic info | Register – Admin branding |
|---|---|---|
| ![Register step 0](docs/screenshots/auth-register-step0.png) | ![Register step 1](docs/screenshots/auth-register-step1.png) | ![Register step 2](docs/screenshots/auth-register-step2.png) |

### Application Shell

**Layout**

| Light | Dark | Mobile |
|---|---|---|
| ![Layout light](docs/screenshots/layout-light.png) | ![Layout dark](docs/screenshots/layout-dark.png) | ![Layout mobile](docs/screenshots/layout-mobile.png) |

**Layout (collapsed sidenav)**

| Light | Dark | Mobile |
|---|---|---|
| ![Collapsed light](docs/screenshots/layout-collapsed-light.png) | ![Collapsed dark](docs/screenshots/layout-collapsed-dark.png) | ![Collapsed mobile](docs/screenshots/layout-collapsed-mobile.png) |

**Drawer**

| Light | Dark | Mobile |
|---|---|---|
| ![Drawer light](docs/screenshots/drawer-light.png) | ![Drawer dark](docs/screenshots/drawer-dark.png) | ![Drawer mobile](docs/screenshots/drawer-mobile.png) |

**Bottom Sheet**

| Light | Dark | Mobile |
|---|---|---|
| ![Bottom sheet light](docs/screenshots/bottom-sheet-light.png) | ![Bottom sheet dark](docs/screenshots/bottom-sheet-dark.png) | ![Bottom sheet mobile](docs/screenshots/bottom-sheet-mobile.png) |

**Banner**

| Light | Dark | Mobile |
|---|---|---|
| ![Banner light](docs/screenshots/banner-light.png) | ![Banner dark](docs/screenshots/banner-dark.png) | ![Banner mobile](docs/screenshots/banner-mobile.png) |

### Theming & Palettes

| Violet | Emerald | Rose |
|---|---|---|
| ![Violet light](docs/screenshots/palette-violet.png) | ![Emerald light](docs/screenshots/palette-emerald.png) | ![Rose light](docs/screenshots/palette-rose.png) |

| Violet (dark) | Emerald (dark) | Rose (dark) |
|---|---|---|
| ![Violet dark](docs/screenshots/palette-dark-violet.png) | ![Emerald dark](docs/screenshots/palette-dark-emerald.png) | ![Rose dark](docs/screenshots/palette-dark-rose.png) |

---

## Project Structure

```
ng-fire-starter/
├── frontend/                        # Angular application
│   ├── public/
│   │   ├── i18n/
│   │   │   ├── en.json              # English translations
│   │   │   └── sr.json              # Serbian translations
│   │   └── icons/                   # SVG icon files
│   └── src/
│       ├── app/
│       │   ├── core/                # Singleton services & app-wide infrastructure
│       │   │   ├── auth/            # Auth service, auth guard, role guard
│       │   │   ├── firebase/        # Firebase SDK initialization
│       │   │   ├── i18n/            # Transloco loader, title strategy
│       │   │   ├── layout/          # App shell components
│       │   │   │   ├── core-layout/              # Root layout wrapper
│       │   │   │   ├── core-layout-sidenav/      # Collapsible sidebar nav
│       │   │   │   ├── core-layout-drawer/       # Slide-in drawer panel
│       │   │   │   ├── core-layout-bottom-sheet/ # Mobile sheet / desktop modal
│       │   │   │   └── core-layout-banner/       # Full-width top banner
│       │   │   └── services/        # Theme, palette, drawer, bottom-sheet, banner, reCAPTCHA
│       │   ├── features/            # Lazy-loaded feature modules
│       │   │   ├── auth/            # Login, register, forgot/reset password, email verify
│       │   │   │   ├── pages/
│       │   │   │   ├── guards/
│       │   │   │   ├── shared/
│       │   │   │   └── auth.routes.ts
│       │   │   └── placeholder/     # Template for new user/admin features
│       │   ├── shared/              # Reusable components and pipes
│       │   │   ├── components/      # shared-icon, theme/palette/language switchers, step-dots
│       │   │   └── pipes/           # shared-label-initials
│       │   └── data/
│       │       └── models/          # All TypeScript interfaces (*.model.ts)
│       ├── styles/                  # Global SCSS
│       │   ├── themes/
│       │   │   ├── _tokens.scss     # 9 color palettes × 10 shades
│       │   │   ├── _light.scss      # Light theme CSS custom properties
│       │   │   ├── _dark.scss       # Dark theme CSS custom properties
│       │   │   └── _palette-overrides.scss  # Runtime palette switching
│       │   ├── _typography.scss
│       │   ├── _spacing.scss
│       │   ├── _flex.scss
│       │   ├── _display.scss
│       │   ├── _sizing.scss
│       │   ├── _borders.scss
│       │   ├── _button.scss
│       │   ├── _forms.scss
│       │   ├── _colors.scss
│       │   ├── _grid.scss
│       │   ├── _navigation.scss
│       │   ├── _breakpoints.scss
│       │   ├── _mixins.scss
│       │   └── _index.scss
│       └── environments/            # Per-environment Firebase config
├── testing/                         # Playwright E2E tests
│   ├── playwright.config.ts         # Browsers, baseURL, webServer config
│   ├── package.json
│   ├── tsconfig.json
│   └── e2e/
│       ├── fixtures/                # Shared fixtures (e.g. authenticated page)
│       ├── pages/                   # Page Object Models — one per page/feature
│       └── specs/                   # Test specs — one file per user flow
├── .github/workflows/               # GitHub Actions CI/CD
├── firebase.json
└── .firebaserc
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Angular 21 (standalone components, signals, lazy-loaded features) |
| Language | TypeScript 5.9 (strict mode) |
| Styling | SCSS with utility classes and CSS custom properties |
| State | Angular Signals (`signal`, `computed`, `effect`) |
| i18n | @jsverse/transloco 8 |
| Backend | Firebase (Auth, Firestore, Hosting) |
| Reactive | RxJS 7 |
| Unit Testing | Vitest + jsdom |
| E2E Testing | Playwright + playwright-bdd (Gherkin/BDD) |
| CI/CD | GitHub Actions |

---

## Requirements

| Tool | Version | Download |
|------|---------|----------|
| Node.js | >= 20 | https://nodejs.org |
| npm | >= 11 | bundled with Node.js |
| Angular CLI | >= 21 | `npm install -g @angular/cli` |
| Firebase CLI | latest | `npm install -g firebase-tools` |

---

## Installation

```bash
# Clone the repository
git clone <repo-url>
cd <repo-name>/frontend

# Install dependencies
npm ci
```

---

## Running in Develop

The develop environment uses **Firebase Emulators** (local simulations of Firebase services), so no access to the live database is required.

Run the following commands in separate terminals, both from the `frontend` directory:

### Terminal 1 — Firebase Emulators

```bash
npm run start:emulators
```

| Service | Port |
|---------|------|
| Authentication | 9099 |
| Firestore | 8080 |
| Emulator UI | http://localhost:4000 |

### Terminal 2 — Seed Test Users (first time only)

```bash
npm run seed
```

| Role  | Email           | Password |
|-------|-----------------|----------|
| user  | user@app.com    | user1234  |
| admin | admin@app.com   | admin1234 |

> The emulators are configured with `--export-on-exit`, so after the first seed the data is saved automatically and restored on the next `npm run start:emulators`. Run `npm run seed` again any time you want a clean slate.

### Terminal 3 — Angular App

```bash
npm start
```

The app will be available at [http://localhost:4200](http://localhost:4200).

> The develop environment automatically uses emulators instead of the live Firebase project.

---

## Build

```bash
ng build --configuration production
```

Output is generated in `frontend/dist/frontend/browser/`.

---

## Tests

### Unit Tests (Vitest)

Run from `frontend/`:

```bash
# Run unit tests
npm run test

# Watch mode
npm run test:watch
```

### E2E Tests (Playwright + Gherkin)

Tests are written in plain-English **Gherkin** (`.feature` files) and executed by Playwright via `playwright-bdd`.

Run from `testing/`. First-time setup:

```bash
cd testing
npm install
npx playwright install   # downloads Chromium & Firefox (~300 MB)
```

Create `testing/.env.test` with test credentials (matches emulator seed users):

```
TEST_USER_EMAIL=user@app.com
TEST_USER_PASSWORD=user1234
TEST_ADMIN_EMAIL=admin@app.com
TEST_ADMIN_PASSWORD=admin1234
```

Then run:

```bash
npm test              # generate from .feature files + run headless
npm run test:ui       # interactive UI mode (recommended for authoring)
npm run test:debug    # step-through debug
npm run report        # open last HTML report
```

Playwright starts the Angular dev server automatically before running tests.
See [testing/README.md](testing/README.md) for the full guide.

---

## Environment Overview

| Environment | Firebase Project | Uses Emulators |
|-------------|-----------------|----------------|
| Develop | #{FirebaseProjectId}# | YES |
| Production | #{FirebaseProjectId}# | NO |

Configuration files are located in `frontend/src/environments/`.

---

## Deployment

Deployment is automated via GitHub Actions:

| Branch | Environment | Firebase Project |
|--------|-------------|-----------------|
| `main` | Production | #{FirebaseProjectId}# |

### Skipping CI/CD

To skip the CI/CD pipeline for a commit, add `[skip ci]` anywhere in the commit message:

```bash
git commit -m "update readme [skip ci]"
```

The GitHub Actions workflow will not be triggered for that push.

---

### Manual Deployment

```bash
firebase login
firebase deploy --only hosting:production --project #{FirebaseProjectId}#
```

### Required GitHub Secrets

| Secret | Description |
|--------|-------------|
| `FIREBASE_SERVICE_ACCOUNT_PROD` | Service account JSON for the production project |

#### How to Generate a Firebase Service Account

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Open your project → gear icon → **Project Settings**
3. Open the **Service accounts** tab
4. Click **Generate new private key** → **Generate key**
5. A `.json` file will be downloaded — this is your secret

#### How to Add the Secret to GitHub

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Set the name (e.g. `FIREBASE_SERVICE_ACCOUNT_PROD`) and paste the entire contents of the downloaded JSON file

#### Required IAM Roles for Service Accounts

| Role | Why it's needed |
|------|----------------|
| `Service Usage Admin` | Firebase CLI checks whether the Firestore API is enabled before deploying |
| `Firebase Rules Admin` | Allows deploying Firestore security rules |

**How to assign a role:**

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Select the appropriate project → **IAM & Admin → IAM**
3. Find the service account email
4. Click the **pencil (edit)** icon → **+ ADD ANOTHER ROLE** → search, select, and **Save**

---

## Adding a New Environment

> **Shortcut:** Typing `add environment` or `add env` in your AI Agent launches the environment wizard.

The wizard will walk you through:

1. Choosing an environment name (e.g. `staging`) and the Git branch that triggers its deployment
2. Creating a dedicated Firebase project for the environment
3. Creating `frontend/src/environments/environment.<name>.ts`
4. Updating `angular.json`, `package.json`, `.firebaserc`, `firebase.json`, and the GitHub Actions workflow
5. Adding the required GitHub secret and IAM roles

```bash
# Build
cd frontend && npm run build:<name>

# Deploy manually
cd frontend && npm run deploy:<name>

# Serve locally against the new environment's Firebase
cd frontend && ng serve --configuration <name>
```

---

## reCAPTCHA v3

Login and register forms are protected with Google reCAPTCHA v3.

### Setup

1. Go to [https://www.google.com/recaptcha/admin](https://www.google.com/recaptcha/admin)
2. Create a new site — select **reCAPTCHA v3**
3. Add your domains (e.g. `localhost`, `#{FirebaseProjectId}#.web.app`)
4. Copy the **Site key** into the appropriate environment file:

| Environment file | Used when |
|------------------|-----------|
| `environment.develop.ts` | `ng serve` (local dev) |
| `environment.prod.ts` | production build |

```typescript
recaptchaSiteKey: 'your-site-key-here',
```

5. Copy the **Secret key** — store it only on the backend (Firebase Cloud Function). **Never put the secret key in Angular code.**
