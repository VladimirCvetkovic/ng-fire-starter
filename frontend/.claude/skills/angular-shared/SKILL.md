---
name: angular-shared
description: Structure and conventions for global shared components, pipes, directives, and utils in src/app/shared/. Use when adding a new shared component, shared pipe, shared directive, or deciding whether something belongs in shared/ vs feature/shared/.
---

# Angular Shared — Structure and conventions

## When to use this skill

- Adding a new component to `shared/components/`
- Adding a new pipe, directive, validator, or util to `shared/`
- Deciding whether a component belongs in `shared/` or inside a feature's `shared/`
- Deciding whether to create a **simple component** or a **component group**
- Adding a model file for shared components

---

## Complete structure

```
shared/
├── components/
│   │
│   ├── simple-component/                 # Single component, no related siblings
│   │   ├── simple-component.ts
│   │   ├── simple-component.html
│   │   └── simple-component.scss
│   │
│   └── component-group/                  # 2+ related components that share a model
│       ├── component-group.model.ts      # All TypeScript types for this group
│       ├── main-component/
│       │   ├── main-component.ts
│       │   ├── main-component.html
│       │   └── main-component.scss
│       ├── sub-component-a/
│       │   ├── sub-component-a.ts
│       │   ├── sub-component-a.html
│       │   └── sub-component-a.scss
│       └── sub-component-b/
│           ├── sub-component-b.ts
│           ├── sub-component-b.html
│           └── sub-component-b.scss
│
├── pipes/
│   └── pipe-name.ts
│
├── directives/
│   └── directive-name.ts
│
├── validators/
│   └── custom.validators.ts
│
└── utils/
    └── domain.utils.ts
```

---

## Simple component

Use when a component has no siblings that share its model or always appear with it.

```typescript
// shared/components/stats-row/stats-row.ts
import { Component, input, ChangeDetectionStrategy } from '@angular/core';

export interface StatItem { value: string | number; label: string; accentColor?: string; }

@Component({
  selector: 'stats-row',
  templateUrl: './stats-row.html',
  styleUrl: './stats-row.scss',
})
export class StatsRowComponent {
  items = input.required<StatItem[]>();
}
```

> **Rule:** inline the model interface in the `.ts` file when it is only used by that one component.
> Move it to a `.model.ts` file only when 2+ components in the group import it.

---

## Component group

Use when 2+ components share a domain model, or a main component has named sub-components (overlays, sheets, pickers inside the same domain).

### group.model.ts

```typescript
// shared/components/workout/workout.model.ts
export type MuscleGroup = 'Chest' | 'Back' | 'Legs' | 'Shoulders' | 'Biceps' | 'Triceps';

export interface Exercise {
  id: string;
  name: string;
  muscle: MuscleGroup;
  sets: number;
  reps: string;
  weight: number;
  rest: string;
}

export interface WorkoutPlan {
  name: string;
  // ...
}
```

### Sub-component importing from the group model

```typescript
// shared/components/workout/workout-log/workout-log.ts
import { Exercise, LoggedSet } from '../workout.model';
// NOT from core/models — model lives alongside its components
```

---

## Placement rules

| What | Where | Reason |
|---|---|---|
| Used by 2+ features | `shared/components/` | Global — migration rule |
| Used by 1 feature only | `feature/shared/components/` | Keep it local until promoted |
| Types used by 2+ components in the same group | `component-group/component-group.model.ts` | Co-locate with consumers |
| Types used by only 1 component | Inline in the component `.ts` | Avoid unnecessary files |
| Pipe used only in 1 feature | `feature/shared/pipes/` | Local until promoted |
| Global utility (date, string) | `shared/utils/` | Pure functions, no Angular deps |

---

## Naming conventions

| File type | Convention | Example |
|---|---|---|
| Component TS | `name.ts` | `workout-log.ts` |
| Component HTML | `name.html` | `workout-log.html` |
| Component SCSS | `name.scss` | `workout-log.scss` |
| Group model | `group.model.ts` | `workout.model.ts` |
| Pipe | `name.ts` | `date-format.ts` |
| Directive | `name.ts` | `autofocus.ts` |

> No `.component.` suffix — matches the project convention from CLAUDE.md.

---

## Decision tree

```
Is this component used by 2+ features?
  YES → shared/components/
  NO  → feature/shared/components/ (promote later if needed)

Does the new shared component share types with an existing group?
  YES → add it to that group folder, put types in group.model.ts
  NO  → create a simple component folder

Does the component have named sub-components (overlay, sheet, inner picker)?
  YES → create a component group folder with the main + sub-components inside
  NO  → simple component folder
```

---

## Migration rule

```
feature/shared/  →  shared/
```

When a component from `feature-name/shared/` starts being used by a second feature,
move it to `src/app/shared/` and update the barrel exports in `shared/index.ts`.
