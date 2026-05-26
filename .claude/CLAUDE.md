
## First-Time Project Setup

If the user is setting up this project for the first time, or if `#{ProjectName}#` placeholders are still present in any file, suggest running the `/setup` skill — it walks through prerequisites, Firebase project creation, placeholder replacement, and optional GitHub Actions configuration.

If the user's message is exactly `install` or `setup` (case-insensitive), immediately invoke the `/setup` skill without asking for confirmation.

If the user's message is exactly `add environment` or `add env` (case-insensitive), immediately invoke the `/add-environment` skill without asking for confirmation.

---

You are an expert in TypeScript, Angular, and scalable web application develop. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators — it's the default in Angular v21+
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use `@HostBinding` and `@HostListener` decorators — put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images (`NgOptimizedImage` does not work for inline base64 images)

## Accessibility Requirements

- MUST pass all AXE checks
- MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes

## Models

All TypeScript interfaces and types MUST be placed in `src/app/data/models/`. Never define models inside a feature's `data/` folder or inside `core/`.

- File pattern: `src/app/data/models/<name>.model.ts`
- Import via path alias: `import { Foo } from '@data/models/foo.model'`
- The `@data/*` alias maps to `src/app/data/*` (configured in `tsconfig.json`)

## File Naming Prefixes

Every file MUST carry the prefix of the directory scope it lives in. This applies to all file types: components, services, guards, pipes, directives, utils, etc.

| Location | Required prefix | Example file | Example class |
|---|---|---|---|
| `src/app/shared/**` | `shared-` | `shared-step-dots.ts` | `SharedStepDotsComponent` |
| `src/app/core/**` | `core-` | `core-auth.service.ts` | `CoreAuthService` |
| `src/app/features/<feature>/**` | `<feature>-` | `auth-locale-bar.ts` | `AuthLocaleBarComponent` |
| `src/app/data/models/**` | descriptive name | `core-user.model.ts` | — (interfaces only) |

Rules:
- The prefix covers the **file name**, **class name**, and (for components/directives) the **selector** (`<prefix>-<name>`, no `app-` prefix).
- Folders follow the same prefix: `features/auth/shared/components/auth-locale-bar/`.
- Pages are **not exempt** — page components inside `features/<feature>/pages/` follow the same rule.
  - Example: `features/auth/pages/login/` → file `auth-login.ts`, class `AuthLoginComponent`, selector `auth-login`.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Do NOT set `changeDetection` — `ChangeDetectionStrategy.OnPush` is the default in Angular v22+
- Every new component MUST have three separate files: `component-name.ts`, `component-name.html`, `component-name.scss` — never use inline `template` or `styles` in the `@Component` decorator
- Use **Signal Forms** (`@angular/forms/signals`) for all forms — never use `ReactiveFormsModule`, `FormGroup`, `FormControl`, or `FormBuilder`
- Do NOT use `ngClass` — use `class` bindings instead
- Do NOT use `ngStyle` — use `style` bindings instead
- Use paths relative to the component TS file for external templates and styles

For implementation patterns (Standalone Components, Signal inputs/outputs, content projection, host directives) load `frontend/.claude/skills/angular/SKILL.md`.

## Styling & Utility Classes

When working on styles or templates, load `frontend/.claude/skills/angular-styling/SKILL.md` for the full utility class catalogue, global UI component style rules, and instructions for adding new style partials.

## Refactoring Rules

When modifying or reviewing any component, always apply these transformations:

- **Remove unused CSS classes** — delete every class from a component `.scss` that has no matching reference in that component's `.html` template
- **Replace with utilities** — remove any class from an HTML element whose only purpose is to apply styles that an existing utility class already covers; add the utility class directly on the element instead

## Icons

- Icons MUST be created as physical `.svg` files inside `public/icons/`
- Never embed SVG markup inline in templates or components — reference via CSS `mask-image` / `background-image`, or `<img>` with `NgOptimizedImage`

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals — use `update` or `set` instead

For implementation patterns (Signal-based state service, component store pattern) load `frontend/.claude/skills/angular/SKILL.md`.

## Localization (i18n)

This project uses `@jsverse/transloco` for runtime i18n. **Never write static user-visible text directly in templates.**

- All user-visible strings MUST go into `public/i18n/sr.json` and `public/i18n/en.json`
- In templates, apply the transloco directive on the root element and use the `t()` function:
  ```html
  <div *transloco="let t; read: 'feature.section'">
    {{ t('key') }}
  </div>
  ```
- For dynamic attributes (e.g. `aria-label`, `placeholder`) use binding: `[attr.aria-label]="t('key')"` / `[placeholder]="t('key')"`
- For HTML content (e.g. text with `<strong>`) use `[innerHTML]="t('key')"` — keep HTML minimal in translation values
- Every component that uses `*transloco` MUST import `TranslocoDirective` in its `imports` array
- Translation keys follow the structure: `feature.page.key` — e.g. `auth.login.signInAsAthlete`
- Both `sr.json` and `en.json` MUST always be kept in sync — adding a key to one requires adding it to the other

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like `new Date()` are available

For implementation patterns (defer blocks, lazy loading, performance optimization) load `frontend/.claude/skills/angular/SKILL.md`.

## Services

- Design services around a single responsibility
- Use `providedIn: 'root'` for singleton services
- Use the `inject()` function instead of constructor injection
- Every new service MUST have a JSDoc comment directly above the `@Injectable` decorator that covers: how to bootstrap/inject it, the key public methods with example calls, and any non-obvious side effects (localStorage, DOM mutations, etc.)

For implementation patterns (injection tokens, functional guards, resolvers) load `frontend/.claude/skills/angular/SKILL.md`.

## Skills

Always load the relevant skill before starting the task:

- **New feature module** → load `frontend/.claude/skills/angular-feature/SKILL.md`
- **New shared component, pipe, directive, or shared group** → load `frontend/.claude/skills/angular-shared/SKILL.md`
- **Project structure / scaffolding** → load `frontend/.claude/skills/angular-architecture/SKILL.md`
- **SSR, hydration, zoneless setup, defer blocks, advanced Signals patterns, or Angular unit testing (TestBed, ComponentFixture, isolated service tests)** → load `frontend/.claude/skills/angular/SKILL.md`
- **Styling, utility classes, global UI component styles** → load `frontend/.claude/skills/angular-styling/SKILL.md`
- **Adding a new deployment environment (staging, preview, uat, etc.)** → load `frontend/.claude/skills/add-environment/SKILL.md`
- **E2E testing, Playwright specs, Page Object Models, or test fixtures** → load `.claude/skills/e2e-testing/SKILL.md`

## Testing — Unit vs E2E

| Type | Tool | Location | Skill |
|---|---|---|---|
| Unit tests (components, services, pipes) | Angular TestBed / Jasmine | `frontend/src/**/*.spec.ts` | `angular` |
| End-to-end tests (user flows, full app) | Playwright + Gherkin (BDD) | `testing/e2e/features/**/*.feature` | `e2e-testing` |

**E2E tests MUST be written in Gherkin** (`.feature` files in `testing/e2e/features/`). Step definitions go in `testing/e2e/steps/`. Never write raw Playwright `test()` blocks for e2e — always use a `.feature` file.

**Never write Playwright tests inside `frontend/` and never write TestBed tests inside `testing/`.**
