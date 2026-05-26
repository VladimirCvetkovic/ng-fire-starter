---
name: angular-styling
description: >
  Defines which utility classes, CSS custom properties, SCSS mixins,
  and global style partials exist in this project. Consult before writing
  any SCSS or HTML classes to avoid duplicating existing utilities or
  inventing non-existent variable names.
---

# Angular Styling

## Utility classes

The project has a Bootstrap-like SCSS utility system in `src/styles/`. **Always prefer utility classes over writing new component SCSS** when utility classes cover the need.

All utilities are globally available — no import needed in component SCSS.

- **Spacing** — `.m-{0–8}`, `.mt/mb/ms/me/mx/my-{0–8}`, `.p-{0–8}`, `.pt/pb/ps/pe/px/py-{0–8}` · Responsive: `.mt-md-4`, `.px-lg-6`, etc.
- **Flexbox** — `.d-flex`, `.flex-row`, `.flex-column`, `.flex-wrap`, `.justify-content-{start|center|end|between|evenly}`, `.align-items-{start|center|end|stretch}`, `.gap-{0–8}`, `.flex-1`, `.flex-grow-1`, `.flex-shrink-0`
- **Grid** — `.container`, `.container-fluid`, `.row`, `.col`, `.col-{1–12}`, `.col-md-{1–12}`, `.col-lg-{1–12}`
- **Typography** — `.text-{start|center|end}`, `.fw-{light|normal|semibold|bold|black}`, `.fs-{xs|sm|md|lg|xl|2xl}`, `.text-{uppercase|lowercase|capitalize}`, `.text-truncate`, `.font-body`, `.font-display`, `.lh-{1|sm|base|lg}`, `.ls-{tight|normal|wide}`
- **Colors** — `.text-{primary|accent|body|secondary|muted|faint}`, `.bg-{base|surface|surface2|primary|accent|primary-subtle|accent-subtle|transparent}`
- **Display** — `.d-{none|block|inline|inline-block|flex|inline-flex|grid}` · Responsive: `.d-md-flex`, `.d-lg-none`, etc.
- **Borders** — `.border`, `.border-{top|bottom|start|end}`, `.border-0`, `.rounded`, `.rounded-{sm|md|lg|xl|circle|pill|0}`
- **Sizing & misc** — `.w-{25|50|75|100|auto}`, `.h-100`, `.min-w-0`, `.overflow-{hidden|auto}`, `.position-{relative|absolute|fixed|sticky}`, `.cursor-pointer`, `.opacity-{0|50|100}`

Spacing scale is 4px-based: `1=4px  2=8px  3=12px  4=16px  5=24px  6=32px  7=48px  8=64px`

---

## Available CSS custom properties

Never hardcode hex values. Always use these variables. Never invent variable names not listed here.

### Primary & Accent

```css
/* Primary — main brand color */
--primary               /* main primary color */
--primary-hover         /* hover state */
--primary-active        /* active/pressed state */
--primary-subtle        /* very light tinted background */
--primary-muted         /* light tinted background */
--primary-border        /* border using primary color */
--on-primary            /* text/icon color ON a primary background */

/* Primary shades — use sparingly, prefer semantic aliases above */
--primary-50
--primary-100
--primary-200
--primary-300
--primary-400
--primary-500
--primary-600
--primary-700
--primary-800
--primary-900

/* Accent — secondary highlight color */
--accent
--accent-hover
--accent-active
--accent-subtle
--accent-muted
--accent-border
--on-accent             /* text/icon color ON an accent background */

/* Accent shades — use sparingly, prefer semantic aliases above */
--accent-50
--accent-100
--accent-200
--accent-300
--accent-400
--accent-500
--accent-600
--accent-700
--accent-800
--accent-900
```

### Surface & Background

```css
--color-bg              /* page background */
--color-bg-raised       /* slightly elevated surface (e.g. navbar, sticky header) */
--color-surface         /* card / panel background */
--color-surface-2       /* nested surface, dividers, input backgrounds */
```

### Text

```css
--color-text            /* primary body text */
--color-text-muted      /* secondary / supporting text */
--color-text-faint      /* placeholder, disabled, hint text */
```

### Border

```css
--color-border          /* default border */
--color-border-strong   /* emphasized border */
```

### Status

```css
--color-success
--color-warning
--color-danger
--color-success-bg      /* subtle background for success states */
--color-warning-bg      /* subtle background for warning states */
--color-danger-bg       /* subtle background for danger/error states */
```

### Spacing (fluid)

```css
--space-fluid-sm        /* clamp(0.5rem, 2vw, 1rem) */
--space-fluid-md        /* clamp(1rem, 4vw, 2rem) */
--space-fluid-lg        /* clamp(1.5rem, 6vw, 4rem) */
--space-fluid-xl        /* clamp(2rem, 8vw, 6rem) */
```

### Fixed spacing scale

```css
--space-0               /* 0 */
--space-1               /* 0.25rem — 4px */
--space-2               /* 0.5rem  — 8px */
--space-3               /* 0.75rem — 12px */
--space-4               /* 1rem    — 16px */
--space-5               /* 1.25rem — 20px */
--space-6               /* 1.5rem  — 24px */
--space-8               /* 2rem    — 32px */
--space-10              /* 2.5rem  — 40px */
--space-12              /* 3rem    — 48px */
--space-16              /* 4rem    — 64px */
--space-20              /* 5rem    — 80px */
--space-24              /* 6rem    — 96px */
```

### Typography

```css
--text-xs               /* clamp(~0.69rem, …, 0.75rem) */
--text-sm               /* clamp(~0.83rem, …, 0.875rem) */
--text-base             /* clamp(1rem, …, 1rem) */
--text-md               /* clamp(~1.13rem, …, 1.25rem) */
--text-lg               /* clamp(~1.27rem, …, 1.5rem) */
--text-xl               /* clamp(~1.42rem, …, 1.875rem) */
--text-2xl              /* clamp(~1.60rem, …, 2.25rem) */
--text-3xl              /* clamp(~1.80rem, …, 3rem) */
--text-4xl              /* clamp(~2.03rem, …, 3.75rem) */

--leading-tight         /* 1.2 */
--leading-normal        /* 1.5 */
--leading-loose         /* 1.8 */
```

### Shadows

```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-primary        /* primary-tinted drop shadow / glow */
--shadow-accent         /* accent-tinted drop shadow / glow */
```

---

## Responsive mixins

**Never write raw media queries.** Always use the mixins from `styles/mixins`.

### Setup in component SCSS

```scss
@use 'styles/mixins' as m;
// src/ is an includePath in angular.json — no relative paths needed
```

### Available mixins

```scss
// Breakpoint mixins (mobile-first recommended)
@include m.from('md') { }           // min-width md and up
@include m.until('lg') { }          // max-width below lg (bp - 1px)
@include m.between('sm', 'lg') { }  // range between two breakpoints
@include m.only('md') { }           // exactly the md range only

// Device / interaction
@include m.hover { }                // hover on non-touch devices only
@include m.portrait { }             // orientation: portrait
@include m.landscape { }            // orientation: landscape
@include m.retina { }               // high-DPI / retina screens (192dpi+)
@include m.no-motion { }            // prefers-reduced-motion: reduce
```

### Breakpoints reference

```
xs:   0px
sm:   576px
md:   768px
lg:   992px
xl:   1200px
xxl:  1400px
```

---

## Global UI component styles

Styles for shared UI elements (button, input, select, card, badge, modal, etc.) must live in `src/styles/` as individual partial files, not in component `.scss` files.

### Rules

- Each UI element gets its own file: `_button.scss`, `_input.scss`, `_card.scss`, etc.
- Every new partial **must** be added to `src/styles/_index.scss`
- Component `.scss` files must NOT redefine these styles — use the global classes directly in templates
- Always use CSS custom properties — never hardcode hex values

### Existing partials in `src/styles/`

| File | Purpose |
|---|---|
| `_breakpoints.scss` | `$breakpoints` map and `bp()` function |
| `_mixins.scss` | All responsive and utility mixins |
| `_spacing.scss` | Margin/padding utility classes + `--space-*` custom properties |
| `_typography.scss` | Font/text/line-height utility classes + `--text-*` custom properties |
| `_grid.scss` | `.container`, `.grid`, `.col-*` utilities + `--grid-*` custom properties |
| `_flex.scss` | Flexbox utility classes |
| `_colors.scss` | Text and background color utility classes |
| `_display.scss` | Display utility classes |
| `_borders.scss` | Border and border-radius utility classes |
| `_sizing.scss` | Width, height, overflow, position utility classes |
| `_button.scss` | `.btn`, `.btn-primary`, `.btn-ghost`, `.back-text-btn` |
| `themes/_tokens.scss` | `$palettes` map and `palette($color, $shade)` function |
| `themes/_light.scss` | All `--primary-*`, `--accent-*`, surface, text, shadow vars — light mode |
| `themes/_dark.scss` | All vars overridden for dark mode |

### Adding a new UI component style

1. Create `src/styles/_component-name.scss`
2. Add `@use 'component-name';` to `src/styles/_index.scss`
3. Define all classes using CSS custom properties — never hardcode hex values

---

## Component SCSS rules

- Write component `.scss` only for layout, component-specific structure, or styles that cannot be expressed with utilities
- Do NOT rewrite utilities in component SCSS (e.g. don't write `display: flex` when `.d-flex` exists)
- Do NOT write raw media queries — always use `@include m.from()`, `m.until()`, etc.
- Do NOT hardcode any color, shadow, or spacing hex/px value — always use a CSS custom property
- Do NOT invent CSS custom property names — only use variables listed in this skill

### Good example

```scss
@use 'styles/mixins' as m;

.product-grid {
  display: grid;
  gap: var(--space-fluid-md);
  grid-template-columns: 1fr;

  @include m.from('md') {
    grid-template-columns: repeat(2, 1fr);
  }

  @include m.from('lg') {
    grid-template-columns: repeat(3, 1fr);
  }
}

.product-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-sm);

  @include m.hover {
    box-shadow: var(--shadow-md);
    border-color: var(--primary-border);
  }
}
```

### Bad example — do not do this

```scss
/* ❌ raw media query */
@media (min-width: 768px) { ... }

/* ❌ hardcoded color */
background: #3b82f6;

/* ❌ invented variable */
color: var(--brand-primary);

/* ❌ duplicating a utility */
.my-component { display: flex; align-items: center; }
/* use class="d-flex align-items-center" in the template instead */
```
