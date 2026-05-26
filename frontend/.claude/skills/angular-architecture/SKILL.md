---
name: angular-architecture
description: Scaffolding and folder structure for an Angular standalone project. Use when you need to generate the entire project structure, add core/ or shared/ files, or explain where a file should go.
---

# Project Architecture

## When to use this skill

- Generating the complete project structure from scratch
- Adding a new file to `core/` or global `shared/`
- Questions like "where should X go?"
- Explaining the difference between `core/`, `shared/`, and `feature/shared/`

---

## Complete project structure

```
src/
├── app/
│   ├── app.config.ts                          # provideRouter, provideHttpClient, provideStore...
│   ├── app.routes.ts                          # Lazy loading for all feature routes
│   ├── app.component.ts
│   │
│   ├── data/                                  # Global TypeScript models — ALL models go here
│   │   └── models/
│   │       ├── core-user.model.ts             # AppUser, Role, ThemeMode, BodyMetrics...
│   │       └── feature-name.model.ts          # Per-feature interfaces (import via @data/models/)
│   │
│   ├── core/                                  # Singleton — registered in app.config.ts
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts                  # functional guard
│   │   │   └── auth.interceptor.ts            # functional interceptor
│   │   ├── http/
│   │   │   ├── api.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── loading.interceptor.ts
│   │   ├── services/
│   │   │   ├── logger.service.ts
│   │   │   └── notification.service.ts
│   │   └── layout/
│   │       ├── layout.component.ts
│   │       ├── layout.component.html
│   │       ├── layout.component.scss
│   │       ├── sidebar/
│   │       │   ├── sidebar.component.ts
│   │       │   ├── sidebar.component.html
│   │       │   └── sidebar.component.scss
│   │       └── header/
│   │           ├── header.component.ts
│   │           ├── header.component.html
│   │           └── header.component.scss
│   │
│   ├── shared/                                # Shared between MULTIPLE features
│   │   ├── components/
│   │   │   ├── confirm-dialog/
│   │   │   │   ├── confirm-dialog.component.ts
│   │   │   │   ├── confirm-dialog.component.html
│   │   │   │   └── confirm-dialog.component.scss
│   │   │   ├── data-table/
│   │   │   │   ├── data-table.component.ts
│   │   │   │   ├── data-table.component.html
│   │   │   │   └── data-table.component.scss
│   │   │   ├── page-header/
│   │   │   │   ├── page-header.component.ts
│   │   │   │   ├── page-header.component.html
│   │   │   │   └── page-header.component.scss
│   │   │   └── empty-state/
│   │   │       ├── empty-state.component.ts
│   │   │       ├── empty-state.component.html
│   │   │       └── empty-state.component.scss
│   │   ├── pipes/
│   │   │   ├── date-format.pipe.ts
│   │   │   └── truncate.pipe.ts
│   │   ├── directives/
│   │   │   ├── has-permission.directive.ts
│   │   │   └── autofocus.directive.ts
│   │   ├── validators/
│   │   │   └── custom.validators.ts
│   │   └── utils/
│   │       └── form.utils.ts
│   │
│   └── features/
│       ├── feature-1/                         # See angular-feature SKILL.md
│       ├── feature-2/
│       └── feature-n/
│
├── public/
│   ├── icons/                                 # SVG icons — never inline in template
│   └── i18n/
│       ├── sr.json
│       └── en.json
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
│
└── styles/
    ├── styles.scss
    ├── _variables.scss
    ├── _mixins.scss
    └── _themes.scss
```

---

## app.config.ts

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor, loadingInterceptor])
    ),
    provideZonelessChangeDetection(),
  ]
};
```

## app.routes.ts

```typescript
export const appRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then(r => r.dashboardRoutes)
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./features/users/users.routes').then(r => r.usersRoutes)
      },
    ]
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login/login.component').then(c => c.LoginComponent)
  }
];
```

## Functional guard

```typescript
// core/auth/auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
```

## Functional interceptor

```typescript
// core/http/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;
  return next(authReq);
};
```

---

## File placement rules

| File | Where | Why |
|---|---|---|
| TypeScript interfaces & types | `src/app/data/models/` | All models — import via `@data/models/` |
| `AuthService`, interceptors, guards | `core/` | Singleton, registered once in `app.config.ts` |
| `LayoutComponent`, `SidebarComponent` | `core/layout/` | Application shell |
| `DataTableComponent`, `ConfirmDialog` | `shared/components/` | Used by 2+ features |
| `DateFormatPipe`, `TruncatePipe` | `shared/pipes/` | Globally useful pipes |
| `UserAvatarComponent` | `users/shared/components/` | Only the users feature uses it |
| `UserRolePipe` | `users/shared/pipes/` | Specific to users |
| SVG icons | `public/icons/` | Never inline in template |

## Migration rule

```
feature/shared/  →  src/app/shared/
```
When a component from `feature-1/shared/` starts being used by `feature-2/` as well,
move it to the global `shared/`. That is the only reason for migration.
