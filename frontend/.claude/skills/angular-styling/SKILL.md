---
name: angular-styling
description: >
  Defines which utility classes, CSS custom properties, SCSS mixins,
  and global style partials exist in this project. Consult before writing
  any SCSS or HTML classes to avoid duplicating existing utilities or
  inventing non-existent variable names.
---

# Angular Styling

## Styles folder structure

```
src/styles/
├── _index.scss              ← entry point, @use-s everything below
├── _utils.scss              ← one-off classes that don't belong to a component
├── base/
│   ├── _breakpoints.scss    ← $breakpoints map and bp() function
│   ├── _mixins.scss         ← responsive + interaction mixins
│   ├── _colors.scss         ← text/bg utility classes + muscle CSS vars
│   └── _typography.scss     ← font/text/line-height utility classes + --text-* vars
├── utilities/
│   ├── _spacing.scss        ← margin/padding classes + --space-* vars
│   ├── _display.scss        ← .d-* classes, responsive variants
│   ├── _flex.scss           ← flexbox utility classes
│   ├── _borders.scss        ← border + border-radius classes + --radius-* vars
│   ├── _sizing.scss         ← width, height, overflow, position, cursor, opacity
│   └── _grid.scss           ← .container, .grid, .col-* + --grid-* vars
├── components/
│   ├── _button.scss         ← .btn, .btn-primary, .btn-ghost, .btn-sm, etc.
│   ├── _forms.scss          ← .input, .select, .checkbox, .form-label, .field-error
│   ├── _card.scss           ← .card, .card--shadow, .card--interactive, .card__body
│   ├── _badge.scss          ← .badge, .badge--chip, .badge--pill, .badge--dot
│   ├── _item-list.scss      ← .item-list, .item-list--lined, .item-thumb, .drag-handle
│   ├── _context-menu.scss   ← .context-menu, .context-menu__panel, .context-menu__item
│   ├── _navigation.scss     ← .sidebar, .sidebar-nav, .sidebar-brand, etc.
│   ├── _icon-box.scss       ← .icon-box, .icon-box-sm
│   └── _empty-state.scss    ← .empty-state
└── themes/
    ├── _tokens.scss         ← $palettes map and palette() function
    ├── _light.scss          ← all --primary-*, --accent-*, surface, text, shadow vars
    ├── _dark.scss           ← dark mode overrides
    └── _palette-overrides.scss
```

---

## Utility classes

**Always prefer utility classes over writing new component SCSS** when they cover the need.

All utilities are globally available — no import needed in component SCSS.

- **Spacing** — `.m-{0–24}`, `.mt/mb/ms/me/mx/my-{0–24}`, `.p-{0–24}`, `.pt/pb/ps/pe/px/py-{0–24}` · Responsive: `.mt-md-4`, `.px-md-6`, etc.
- **Flexbox** — `.d-flex`, `.flex-row`, `.flex-column`, `.flex-wrap`, `.justify-content-{start|center|end|between|evenly}`, `.align-items-{start|center|end|stretch}`, `.gap-{0–12}`, `.flex-1`, `.flex-grow-1`, `.flex-shrink-0`
- **Grid** — `.container`, `.container--narrow`, `.container--wide`, `.container--full`, `.grid`, `.col-{1–12}`, `.col-sm-{1–12}`, `.col-md-{1–12}`, `.col-lg-{1–12}`
- **Typography** — `.text-{start|center|end}`, `.fw-{light|normal|semibold|bold|black}`, `.fs-{xs|sm|base|md|lg|xl|2xl|3xl|4xl}`, `.text-{uppercase|lowercase|capitalize}`, `.text-truncate`, `.font-body`, `.font-display`, `.lh-{1|sm|base|lg}`, `.ls-{tighter|tight|normal|wide|wider}`
- **Colors** — `.text-{primary|accent|body|secondary|muted|faint|bg|danger}`, `.bg-{base|surface|surface2|primary|accent|primary-subtle|accent-subtle|transparent}`
- **Display** — `.d-{none|block|inline|inline-block|flex|inline-flex|grid}` · Responsive: `.d-sm-*`, `.d-md-*`, `.d-lg-*`
- **Borders** — `.border`, `.border-{top|bottom|start|end}`, `.border-0`, `.rounded`, `.rounded-{sm|md|lg|xl|circle|pill|0}`
- **Sizing & misc** — `.w-{25|50|75|100|auto}`, `.h-100`, `.min-w-0`, `.min-h-0`, `.min-h-screen`, `.max-w-{xs|sm|md|lg}`, `.overflow-{hidden|auto}`, `.overflow-scroll-none`, `.position-{relative|absolute|fixed|sticky}`, `.cursor-{pointer|default}`, `.opacity-{0|25|50|75|100}`

Spacing scale is 4px-based: `1=4px  2=8px  3=12px  4=16px  5=20px  6=24px  7=28px  8=32px  10=40px  12=48px  16=64px  20=80px  24=96px`

### One-off utility classes (`_utils.scss`)

| Class | Purpose |
|---|---|
| `.sticky-bar` | `position: sticky; top: 0; z-index: 10` with page background |
| `.link` | Inline text link / button-as-link style |

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
--primary-50 … --primary-900

/* Accent — secondary highlight color */
--accent
--accent-hover
--accent-active
--accent-subtle
--accent-muted
--accent-border
--on-accent             /* text/icon color ON an accent background */

/* Accent shades — use sparingly, prefer semantic aliases above */
--accent-50 … --accent-900
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
--space-0    /* 0 */         --space-1    /* 0.25rem  — 4px */
--space-2    /* 0.5rem  — 8px */          --space-3    /* 0.75rem — 12px */
--space-4    /* 1rem    — 16px */         --space-5    /* 1.25rem — 20px */
--space-6    /* 1.5rem  — 24px */         --space-7    /* 1.75rem — 28px */
--space-8    /* 2rem    — 32px */         --space-10   /* 2.5rem  — 40px */
--space-12   /* 3rem    — 48px */         --space-16   /* 4rem    — 64px */
--space-20   /* 5rem    — 80px */         --space-24   /* 6rem    — 96px */
```

### Typography

```css
--text-xs               /* clamp(~0.69rem, …, 0.75rem) */
--text-sm               /* clamp(~0.83rem, …, 0.875rem) */
--text-base             /* 1rem */
--text-md               /* clamp(~1.13rem, …, 1.25rem) */
--text-lg               /* clamp(~1.27rem, …, 1.5rem) */
--text-xl               /* clamp(~1.42rem, …, 1.875rem) */
--text-2xl              /* clamp(~1.60rem, …, 2.25rem) */
--text-3xl              /* clamp(~1.80rem, …, 3rem) */
--text-4xl              /* clamp(~2.03rem, …, 3.75rem) */

--leading-tight         /* 1.2 */
--leading-normal        /* 1.5 */
--leading-loose         /* 1.8 */

--font-body             /* 'Inter', system-ui */
--font-display          /* 'Plus Jakarta Sans', 'Inter', system-ui */
```

### Border radius

```css
--radius-sm             /* 0.25rem */
--radius-md             /* 0.5rem */
--radius-lg             /* 0.75rem */
--radius-xl             /* 1rem */
--radius-full           /* 9999px */
```

### Shadows

```css
--shadow-sm
--shadow-md
--shadow-lg
--shadow-primary        /* primary-tinted drop shadow / glow */
--shadow-accent         /* accent-tinted drop shadow / glow */
```

### Navigation

```css
--mobile-nav-h          /* 0px on desktop, 62px on mobile — use for bottom padding */
```

---

## Responsive mixins

**Never write raw media queries.** Always use the mixins from `styles/base/mixins`.

### Setup in component SCSS

```scss
@use 'styles/base/mixins' as m;
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

Styles for shared UI elements live in `src/styles/components/` as individual partials.

### Rules

- Each UI element gets its own file in `src/styles/components/`
- Every new partial **must** be added to `src/styles/_index.scss`
- Component `.scss` files must NOT redefine these styles — use the global classes directly in templates
- Always use CSS custom properties — never hardcode hex values
- Classes that don't belong to a specific component go in `src/styles/_utils.scss`

### Adding a new UI component style

1. Create `src/styles/components/_component-name.scss`
2. Add `@use './components/component-name';` to `src/styles/_index.scss`
3. Define all classes using CSS custom properties

### Adding a one-off utility class

Add it to `src/styles/_utils.scss` — no new file needed.

---

## Component SCSS rules

- Write component `.scss` only for layout, component-specific structure, or styles that cannot be expressed with utilities
- Do NOT rewrite utilities in component SCSS (e.g. don't write `display: flex` when `.d-flex` exists)
- Do NOT write raw media queries — always use `@include m.from()`, `m.until()`, etc.
- Do NOT hardcode any color, shadow, or spacing hex/px value — always use a CSS custom property
- Do NOT invent CSS custom property names — only use variables listed in this skill

### Good example

```scss
@use 'styles/base/mixins' as m;

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
  border-radius: var(--radius-lg);
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

/* ❌ old mixins import path */
@use 'styles/mixins' as m;         // correct: @use 'styles/base/mixins' as m

/* ❌ duplicating a utility */
.my-component { display: flex; align-items: center; }
/* use class="d-flex align-items-center" in the template instead */
```
