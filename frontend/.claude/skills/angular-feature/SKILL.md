---
name: angular-feature
description: Generating a new Angular standalone feature following the standard pattern (pages, shared, store, data). Use when you need to create a new feature module, add a new page to an existing feature, or explain how a feature should be organized.
---

# Angular Feature — Pattern and scaffolding

## When to use this skill

- Creating a new feature folder from scratch
- Adding a new page component to an existing feature
- Adding a file to `store/`, `shared/`, or `data/` within a feature
- Questions like "how should I organize the X feature?"

---

## Structure of each feature

```
features/feature-name/
├── feature-name.routes.ts
│
├── pages/                                 # Smart components — one per route
│   ├── feature-name-list-page/
│   │   ├── feature-name-list-page.component.ts
│   │   ├── feature-name-list-page.component.html
│   │   └── feature-name-list-page.component.scss
│   ├── feature-name-detail-page/
│   │   ├── feature-name-detail-page.component.ts
│   │   ├── feature-name-detail-page.component.html
│   │   └── feature-name-detail-page.component.scss
│   └── feature-name-form-page/
│       ├── feature-name-form-page.component.ts
│       ├── feature-name-form-page.component.html
│       └── feature-name-form-page.component.scss
│
├── shared/                                # Dumb components — only within this feature
│   ├── components/
│   │   ├── feature-name-card/
│   │   │   ├── feature-name-card.component.ts
│   │   │   ├── feature-name-card.component.html
│   │   │   └── feature-name-card.component.scss
│   │   └── feature-name-badge/
│   │       ├── feature-name-badge.component.ts
│   │       ├── feature-name-badge.component.html
│   │       └── feature-name-badge.component.scss
│   ├── pipes/
│   │   └── feature-name-status.pipe.ts
│   ├── constants/
│   │   └── feature-name-status.enum.ts
│   ├── utils/
│   │   └── feature-name.utils.ts
│
├── store/
│   ├── feature-name.state.ts
│   └── feature-name.store.ts              # SignalStore (one class instead of 5 files)
│
└── data/
    ├── feature-name.service.ts            # HttpClient calls
    └── feature-name.resolver.ts          # Functional resolver

# Models live in the global models folder — NOT inside the feature:
# src/app/data/models/feature-name.model.ts
```

---

## feature-name.routes.ts

Every route MUST have a `title` property pointing to an i18n key. `CoreTitleStrategy` translates it automatically and appends `| My Coach`.

```typescript
import { Routes } from '@angular/router';
import { featureNameResolver } from './data/feature-name.resolver';

export const featureNameRoutes: Routes = [
  {
    path: '',
    title: 'featureName.list.pageTitle',
    loadComponent: () =>
      import('./pages/feature-name-list-page/feature-name-list-page.component')
        .then(c => c.FeatureNameListPageComponent),
    resolve: { data: featureNameResolver }
  },
  {
    path: 'new',
    title: 'featureName.form.pageTitle',
    loadComponent: () =>
      import('./pages/feature-name-form-page/feature-name-form-page.component')
        .then(c => c.FeatureNameFormPageComponent)
  },
  {
    path: ':id',
    title: 'featureName.detail.pageTitle',
    loadComponent: () =>
      import('./pages/feature-name-detail-page/feature-name-detail-page.component')
        .then(c => c.FeatureNameDetailPageComponent)
  },
  {
    path: ':id/edit',
    title: 'featureName.form.pageTitle',
    loadComponent: () =>
      import('./pages/feature-name-form-page/feature-name-form-page.component')
        .then(c => c.FeatureNameFormPageComponent)
  }
];
```

Add the corresponding `pageTitle` key to **both** `sr.json` and `en.json` under the feature's i18n namespace:

```json
// en.json
"featureName": {
  "list":   { "pageTitle": "Items" },
  "detail": { "pageTitle": "Item details" },
  "form":   { "pageTitle": "Edit item" }
}

// sr.json
"featureName": {
  "list":   { "pageTitle": "Stavke" },
  "detail": { "pageTitle": "Detalji stavke" },
  "form":   { "pageTitle": "Izmeni stavku" }
}
```

Result in browser tab: `Items | My Coach`

---

## Page komponenta (smart)

```typescript
// pages/feature-name-list-page/feature-name-list-page.component.ts
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FeatureNameStore } from '../../store/feature-name.store';
import { FeatureNameCardComponent } from '../../shared/components/feature-name-card/feature-name-card';
import { FeatureNameBadgeComponent } from '../../shared/components/feature-name-badge/feature-name-badge';
import { DataTableComponent, PageHeaderComponent } from '@app/shared/components';

@Component({
  selector: 'feature-name-list-page',
  imports: [
    FeatureNameCardComponent,
    FeatureNameBadgeComponent,
    DataTableComponent,
    PageHeaderComponent,
  ],
  templateUrl: './feature-name-list-page.component.html',
  styleUrl: './feature-name-list-page.component.scss',
})
export class FeatureNameListPageComponent implements OnInit {
  private store = inject(FeatureNameStore);

  items = this.store.items;           // signal
  loading = this.store.loading;       // signal
  error = this.store.error;           // signal

  ngOnInit() {
    this.store.loadItems();
  }
}
```

---

## Store (SignalStore)

```typescript
// store/feature-name.store.ts
import { Injectable, signal, computed, inject } from '@angular/core';
import { FeatureNameService } from '../data/feature-name.service';
import { FeatureNameItem } from '@data/models/feature-name.model';

@Injectable({ providedIn: 'root' })
export class FeatureNameStore {
  private service = inject(FeatureNameService);

  // State
  private _items = signal<FeatureNameItem[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  // Selectors (read-only)
  readonly items = computed(() => this._items());
  readonly loading = computed(() => this._loading());
  readonly error = computed(() => this._error());

  // Actions
  loadItems() {
    this._loading.set(true);
    this._error.set(null);
    this.service.getAll().subscribe({
      next: items => {
        this._items.set(items);
        this._loading.set(false);
      },
      error: err => {
        this._error.set(err.message);
        this._loading.set(false);
      }
    });
  }

  addItem(item: FeatureNameItem) {
    this._items.update(items => [...items, item]);
  }

  removeItem(id: string) {
    this._items.update(items => items.filter(i => i.id !== id));
  }
}
```

---

## Data servis

```typescript
// data/feature-name.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FeatureNameItem } from '@data/models/feature-name.model';

@Injectable({ providedIn: 'root' })
export class FeatureNameService {
  private http = inject(HttpClient);
  private readonly base = '/api/feature-name';

  getAll(): Observable<FeatureNameItem[]> {
    return this.http.get<FeatureNameItem[]>(this.base);
  }

  getById(id: string): Observable<FeatureNameItem> {
    return this.http.get<FeatureNameItem>(`${this.base}/${id}`);
  }

  create(payload: Omit<FeatureNameItem, 'id'>): Observable<FeatureNameItem> {
    return this.http.post<FeatureNameItem>(this.base, payload);
  }

  update(id: string, payload: Partial<FeatureNameItem>): Observable<FeatureNameItem> {
    return this.http.patch<FeatureNameItem>(`${this.base}/${id}`, payload);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
```

---

## Models

Models MUST NOT be placed inside the feature folder. Place them in the global models folder and import via `@data`:

```typescript
// src/app/data/models/feature-name.model.ts
export interface FeatureNameItem {
  id: string;
  // ... fields specific to the feature
  createdAt: string;
  updatedAt: string;
}

export type CreateFeatureNamePayload = Omit<FeatureNameItem, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFeatureNamePayload = Partial<CreateFeatureNamePayload>;
```

Import in service, store, or component:
```typescript
import { FeatureNameItem } from '@data/models/feature-name.model';
```

---

## Functional resolver

```typescript
// data/feature-name.resolver.ts
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { FeatureNameItem } from '@data/models/feature-name.model';
import { FeatureNameService } from './feature-name.service';

export const featureNameResolver: ResolveFn<FeatureNameItem[]> = () => {
  return inject(FeatureNameService).getAll();
};
```

---

## Dumb component (shared within feature)

```typescript
// shared/components/feature-name-card/feature-name-card.component.ts
import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { FeatureNameItem } from '../../data/feature-name.models';
import { FeatureNameBadgeComponent } from '../feature-name-badge/feature-name-badge.component';

@Component({
  selector: 'feature-name-card',
  imports: [FeatureNameBadgeComponent],
  templateUrl: './feature-name-card.component.html',
  styleUrl: './feature-name-card.component.scss',
})
export class FeatureNameCardComponent {
  item = input.required<FeatureNameItem>();
  selected = output<FeatureNameItem>();
  deleted = output<string>();
}
```

---

## Rules

| | Where | Why |
|---|---|---|
| Page component | `pages/` | Smart, reads store, one per route |
| Card, Badge, small UI | `shared/components/` | Dumb, used by 2+ pages within the feature |
| Feature-specific pipe | `shared/pipes/` | Not shared outside the feature |
| Enum, constants | `shared/constants/` | Static feature data |
| HTTP calls | `data/feature-name.service.ts` | One class, one endpoint |
| TypeScript types | `src/app/data/models/feature-name.model.ts` | Global models folder, import via `@data/models/` |
| State | `store/feature-name.store.ts` | SignalStore — one class |

## Migration to global shared

When a component from `feature-name/shared/` starts being used by another feature, move it to `src/app/shared/`.
