---
name: angular
description: Modern Angular (v22+) expert with deep knowledge of Signals, Signal Forms, Standalone Components, Zoneless applications, SSR/Hydration, and reactive patterns. Use PROACTIVELY for Angular develop, component architecture, state management, performance optimization, and migration to modern patterns.
source: https://github.com/sickn33/antigravity-awesome-skills/tree/main/skills/angular
---

# Angular Expert

Master modern Angular develop with Signals, Standalone Components, Zoneless applications, SSR/Hydration, and the latest reactive patterns.

## When to Use This Skill

- Building new Angular applications (v22+)
- Implementing Signals-based reactive patterns
- Creating Standalone Components and migrating from NgModules
- Configuring Zoneless Angular applications
- Implementing SSR, prerendering, and hydration
- Optimizing Angular performance
- Adopting modern Angular patterns and best practices

## Do Not Use This Skill When

- Migrating from AngularJS (1.x) → use `angular-migration` skill
- Working with legacy Angular apps that cannot upgrade
- General TypeScript issues → use `typescript-expert` skill

## Instructions

1. Assess the Angular version and project structure
2. Apply modern patterns (Signals, Standalone, Zoneless)
3. Implement with proper typing and reactivity
4. Validate with build and tests

## Safety

- Always test changes in develop before production
- Gradual migration for existing apps (don't big-bang refactor)
- Keep backward compatibility during transitions

---

## Angular Version Timeline

| Version        | Release | Key Features                                                                    |
| -------------- | ------- | ------------------------------------------------------------------------------- |
| **Angular 20** | Q2 2025 | Signals stable, Zoneless stable, Incremental hydration                          |
| **Angular 21** | Q4 2025 | Signals-first default, Enhanced SSR, Signal Forms (experimental)                |
| **Angular 22** | Q2 2026 | Signal Forms **stable**, `resource()`/`httpResource()` stable, OnPush by default |

---

## 1. Signals: The New Reactive Primitive

Signals are Angular's fine-grained reactivity system, replacing zone.js-based change detection.

### Core Concepts

```typescript
import { signal, computed, effect } from "@angular/core";

// Writable signal
const count = signal(0);

// Read value
console.log(count()); // 0

// Update value
count.set(5); // Direct set
count.update((v) => v + 1); // Functional update

// Computed (derived) signal
const doubled = computed(() => count() * 2);

// Effect (side effects)
effect(() => {
  console.log(`Count changed to: ${count()}`);
});
```

### Signal-Based Inputs and Outputs

```typescript
import { Component, input, output, model } from "@angular/core";

@Component({
  selector: "user-card",
  template: `
    <div class="card">
      <h3>{{ name() }}</h3>
      <span>{{ role() }}</span>
      <button (click)="select.emit(id())">Select</button>
    </div>
  `,
})
export class UserCardComponent {
  // Signal inputs (read-only)
  id = input.required<string>();
  name = input.required<string>();
  role = input<string>("User"); // With default

  // Output
  select = output<string>();

  // Two-way binding (model)
  isSelected = model(false);
}

// Usage:
// <user-card [id]="'123'" [name]="'John'" [(isSelected)]="selected" />
```

### Signal Queries (ViewChild/ContentChild)

```typescript
import {
  Component,
  viewChild,
  viewChildren,
  contentChild,
} from "@angular/core";

@Component({
  selector: "container",
  template: `
    <input #searchInput />
    <item *ngFor="let item of items()" />
  `,
})
export class ContainerComponent {
  // Signal-based queries
  searchInput = viewChild<ElementRef>("searchInput");
  items = viewChildren(ItemComponent);
  projectedContent = contentChild(HeaderDirective);

  focusSearch() {
    this.searchInput()?.nativeElement.focus();
  }
}
```

### When to Use Signals vs RxJS

| Use Case                | Signals         | RxJS                             |
| ----------------------- | --------------- | -------------------------------- |
| Local component state   | ✅ Preferred    | Overkill                         |
| Derived/computed values | ✅ `computed()` | `combineLatest` works            |
| Side effects            | ✅ `effect()`   | `tap` operator                   |
| HTTP requests           | ❌              | ✅ HttpClient returns Observable |
| Event streams           | ❌              | ✅ `fromEvent`, operators        |
| Complex async flows     | ❌              | ✅ `switchMap`, `mergeMap`       |

---

## 2. Standalone Components

Standalone components are self-contained and don't require NgModule declarations.

### Creating Standalone Components

```typescript
import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterLink } from "@angular/router";

@Component({
  selector: "header",
  imports: [CommonModule, RouterLink], // Direct imports
  template: `
    <header>
      <a routerLink="/">Home</a>
      <a routerLink="/about">About</a>
    </header>
  `,
})
export class HeaderComponent {}
```

### Bootstrapping Without NgModule

```typescript
// main.ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { AppComponent } from "./app/app.component";
import { routes } from "./app/app.routes";

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes), provideHttpClient()],
});
```

### Lazy Loading Standalone Components

```typescript
// app.routes.ts
import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "dashboard",
    loadComponent: () =>
      import("./dashboard/dashboard.component").then(
        (m) => m.DashboardComponent,
      ),
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.routes").then((m) => m.ADMIN_ROUTES),
  },
];
```

---

## 3. Zoneless Angular

Zoneless applications don't use zone.js, improving performance and debugging.

### Enabling Zoneless Mode

```typescript
// main.ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideZonelessChangeDetection } from "@angular/core";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [provideZonelessChangeDetection()],
});
```

### Zoneless Component Patterns

```typescript
import { Component, signal } from "@angular/core";

@Component({
  selector: "counter",
  template: `
    <div>Count: {{ count() }}</div>
    <button (click)="increment()">+</button>
  `,
})
export class CounterComponent {
  count = signal(0);

  increment() {
    this.count.update((v) => v + 1);
    // No zone.js needed - Signal triggers change detection
  }
}
```

### Key Zoneless Benefits

- **Performance**: No zone.js patches on async APIs
- **Debugging**: Clean stack traces without zone wrappers
- **Bundle size**: Smaller without zone.js (~15KB savings)
- **Interoperability**: Better with Web Components and micro-frontends

---

## 4. Server-Side Rendering & Hydration

### SSR Setup with Angular CLI

```bash
ng add @angular/ssr
```

### Hydration Configuration

```typescript
// app.config.ts
import { ApplicationConfig } from "@angular/core";
import {
  provideClientHydration,
  withEventReplay,
} from "@angular/platform-browser";

export const appConfig: ApplicationConfig = {
  providers: [provideClientHydration(withEventReplay())],
};
```

### Incremental Hydration (v21+)

```typescript
import { Component } from "@angular/core";

@Component({
  selector: "page",
  template: `
    <hero />

    @defer (hydrate on viewport) {
      <comments />
    }

    @defer (hydrate on interaction) {
      <chat-widget />
    }
  `,
})
export class PageComponent {}
```

### Hydration Triggers

| Trigger          | When to Use                             |
| ---------------- | --------------------------------------- |
| `on idle`        | Low-priority, hydrate when browser idle |
| `on viewport`    | Hydrate when element enters viewport    |
| `on interaction` | Hydrate on first user interaction       |
| `on hover`       | Hydrate when user hovers                |
| `on timer(ms)`   | Hydrate after specified delay           |

---

## 5. Modern Routing Patterns

### Functional Route Guards

```typescript
// auth.guard.ts
import { inject } from "@angular/core";
import { Router, CanActivateFn } from "@angular/router";
import { AuthService } from "./auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(["/login"], {
    queryParams: { returnUrl: state.url },
  });
};

// Usage in routes
export const routes: Routes = [
  {
    path: "dashboard",
    loadComponent: () => import("./dashboard.component"),
    canActivate: [authGuard],
  },
];
```

### Route-Level Data Resolvers

```typescript
import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UserService } from './user.service';
import { User } from './user.model';

export const userResolver: ResolveFn<User> = (route) => {
  const userService = inject(UserService);
  return userService.getUser(route.paramMap.get('id')!);
};

// In routes
{
  path: 'user/:id',
  loadComponent: () => import('./user.component'),
  resolve: { user: userResolver }
}

// In component
export class UserComponent {
  private route = inject(ActivatedRoute);
  user = toSignal(this.route.data.pipe(map(d => d['user'])));
}
```

---

## 6. Dependency Injection Patterns

### Modern inject() Function

```typescript
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';

@Component({...})
export class UserComponent {
  // Modern inject() - no constructor needed
  private http = inject(HttpClient);
  private userService = inject(UserService);

  // Works in any injection context
  users = toSignal(this.userService.getUsers());
}
```

### Injection Tokens for Configuration

```typescript
import { InjectionToken, inject } from "@angular/core";

// Define token
export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");

// Provide in config
bootstrapApplication(AppComponent, {
  providers: [{ provide: API_BASE_URL, useValue: "https://api.example.com" }],
});

// Inject in service
@Injectable({ providedIn: "root" })
export class ApiService {
  private baseUrl = inject(API_BASE_URL);

  get(endpoint: string) {
    return this.http.get(`${this.baseUrl}/${endpoint}`);
  }
}
```

---

## 7. Component Composition & Reusability

### Content Projection (Slots)

```typescript
@Component({
  selector: 'card',
  template: `
    <div class="card">
      <div class="header">
        <!-- Select by attribute -->
        <ng-content select="[card-header]"></ng-content>
      </div>
      <div class="body">
        <!-- Default slot -->
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class CardComponent {}

// Usage
<card>
  <h3 card-header>Title</h3>
  <p>Body content</p>
</card>
```

### Host Directives (Composition)

```typescript
// Reusable behaviors without inheritance
@Directive({
  selector: '[appTooltip]',
  inputs: ['tooltip'] // Signal input alias
})
export class TooltipDirective { ... }

@Component({
  selector: 'button',
  hostDirectives: [
    {
      directive: TooltipDirective,
      inputs: ['tooltip: title'] // Map input
    }
  ],
  template: `<ng-content />`
})
export class ButtonComponent {}
```

---

## 8. State Management Patterns

### Signal-Based State Service

```typescript
import { Injectable, signal, computed } from "@angular/core";

interface AppState {
  user: User | null;
  theme: "light" | "dark";
  notifications: Notification[];
}

@Injectable({ providedIn: "root" })
export class StateService {
  // Private writable signals
  private _user = signal<User | null>(null);
  private _theme = signal<"light" | "dark">("light");
  private _notifications = signal<Notification[]>([]);

  // Public read-only computed
  readonly user = computed(() => this._user());
  readonly theme = computed(() => this._theme());
  readonly notifications = computed(() => this._notifications());
  readonly unreadCount = computed(
    () => this._notifications().filter((n) => !n.read).length,
  );

  // Actions
  setUser(user: User | null) {
    this._user.set(user);
  }

  toggleTheme() {
    this._theme.update((t) => (t === "light" ? "dark" : "light"));
  }

  addNotification(notification: Notification) {
    this._notifications.update((n) => [...n, notification]);
  }
}
```

### Component Store Pattern with Signals

```typescript
import { Injectable, signal, computed, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable()
export class ProductStore {
  private http = inject(HttpClient);

  // State
  private _products = signal<Product[]>([]);
  private _loading = signal(false);
  private _filter = signal("");

  // Selectors
  readonly products = computed(() => this._products());
  readonly loading = computed(() => this._loading());
  readonly filteredProducts = computed(() => {
    const filter = this._filter().toLowerCase();
    return this._products().filter((p) =>
      p.name.toLowerCase().includes(filter),
    );
  });

  // Actions
  loadProducts() {
    this._loading.set(true);
    this.http.get<Product[]>("/api/products").subscribe({
      next: (products) => {
        this._products.set(products);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }

  setFilter(filter: string) {
    this._filter.set(filter);
  }
}
```

---

## 9. Signal Forms (Stable in Angular 22)

Signal Forms replace Reactive Forms. **Never use `ReactiveFormsModule`, `FormGroup`, `FormControl`, or `FormBuilder` in new code.**

### Core imports

```typescript
import { form, FormField, required, email, minLength, maxLength, min, max, pattern } from '@angular/forms/signals';
```

`FormField` is a directive — add it to `imports: [FormField]` in the component.

### Basic pattern

```typescript
@Component({
  imports: [FormField],
  template: `
    <form (submit)="onSubmit($event)">
      <input [formField]="loginForm.email" type="email" />
      @if (loginForm.email().touched() && loginForm.email().errors().length) {
        <p>{{ t(loginForm.email().errors()[0].message ?? '') }}</p>
      }
      <input [formField]="loginForm.password" type="password" />
      <button type="submit">Login</button>
    </form>
  `,
})
export class LoginComponent {
  private model = signal({ email: '', password: '' });

  protected loginForm = form(this.model, p => {
    required(p.email, { message: 'validation.required' });
    email(p.email, { message: 'validation.invalidEmail' });
    required(p.password, { message: 'validation.required' });
  });

  protected formInvalid = computed(() =>
    this.loginForm.email().invalid() || this.loginForm.password().invalid()
  );

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (this.formInvalid()) return;
    console.log(this.model()); // access values via the model signal
  }
}
```

### Validator API

| Validator | Signature | Notes |
|-----------|-----------|-------|
| `required` | `required(path, { message })` | Fails on empty string / null |
| `email` | `email(path, { message })` | Validates email format |
| `minLength` | `minLength(path, n, { message })` | Constraint is 2nd arg |
| `maxLength` | `maxLength(path, n, { message })` | Constraint is 2nd arg |
| `min` | `min(path, n, { message })` | Number range |
| `max` | `max(path, n, { message })` | Number range |
| `pattern` | `pattern(path, /regex/, { message })` | Regex is 2nd arg; passes on empty string |

### Field state signals

```typescript
field().value()    // current value (WritableSignal)
field().valid()
field().invalid()
field().touched()
field().dirty()
field().errors()   // ValidationError[] — use [0].message ?? ''
field().pending()  // async validation in progress
```

### Handling "mark all touched" on submit

Signal Forms have no imperative `markAllAsTouched()`. Use a `submitted` signal instead:

```typescript
protected submitted = signal(false);

protected onSubmit(event: Event): void {
  event.preventDefault();
  this.submitted.set(true);
  if (this.formInvalid()) return;
  // proceed
}
```

In the template, show errors when `submitted() || field.touched()`:

```html
@if ((submitted() || form.email().touched()) && form.email().errors().length) {
  <p>{{ t(form.email().errors()[0].message ?? '') }}</p>
}
```

### Cross-field validation (e.g. password match)

Use `computed()` — Signal Forms validators are field-level only:

```typescript
protected passwordMismatch = computed(() => {
  const { password, confirmPassword } = this.model();
  return !!(password && confirmPassword && password !== confirmPassword);
});
```

In the template:
```html
@if ((submitted() || form.confirmPassword().touched()) && (form.confirmPassword().errors().length || passwordMismatch())) {
  <p>{{ passwordMismatch() ? t('validation.passwordMismatch') : t(form.confirmPassword().errors()[0].message ?? '') }}</p>
}
```

### Accessing values

Access form values through the model signal, not the field tree:

```typescript
// ✅ correct
const { email, password } = this.model();

// ❌ don't do this
const email = this.loginForm.email().value();
```

### Translation keys as error messages

Since this project uses Transloco, set validator `message` to a translation key and call `t()` in the template:

```typescript
required(p.email, { message: 'auth.login.validation.required' });
```

```html
{{ t(form.email().errors()[0].message ?? '') }}
```

---

## 10. Performance Optimization

### Change Detection Strategies

```typescript
@Component({
  // Only checks when:
  // 1. Input signal/reference changes
  // 2. Event handler runs
  // 3. Async pipe emits
  // 4. Signal value changes
})
```

### Defer Blocks for Lazy Loading

```typescript
@Component({
  template: `
    <!-- Immediate loading -->
    <header />

    <!-- Lazy load when visible -->
    @defer (on viewport) {
      <heavy-chart />
    } @placeholder {
      <div class="skeleton" />
    } @loading (minimum 200ms) {
      <spinner />
    } @error {
      <p>Failed to load chart</p>
    }
  `
})
```

### NgOptimizedImage

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `
    <img
      ngSrc="hero.jpg"
      width="800"
      height="600"
      priority
    />

    <img
      ngSrc="thumbnail.jpg"
      width="200"
      height="150"
      loading="lazy"
      placeholder="blur"
    />
  `
})
```

---

## 11. Testing Modern Angular

### Testing Signal Components

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CounterComponent } from "./counter.component";

describe("CounterComponent", () => {
  let component: CounterComponent;
  let fixture: ComponentFixture<CounterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponent], // Standalone import
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should increment count", () => {
    expect(component.count()).toBe(0);

    component.increment();

    expect(component.count()).toBe(1);
  });

  it("should update DOM on signal change", () => {
    component.count.set(5);
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector(".count");
    expect(el.textContent).toContain("5");
  });
});
```

### Testing with Signal Inputs

```typescript
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ComponentRef } from "@angular/core";
import { UserCardComponent } from "./user-card.component";

describe("UserCardComponent", () => {
  let fixture: ComponentFixture<UserCardComponent>;
  let componentRef: ComponentRef<UserCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(UserCardComponent);
    componentRef = fixture.componentRef;

    // Set signal inputs via setInput
    componentRef.setInput("id", "123");
    componentRef.setInput("name", "John Doe");

    fixture.detectChanges();
  });

  it("should display user name", () => {
    const el = fixture.nativeElement.querySelector("h3");
    expect(el.textContent).toContain("John Doe");
  });
});
```

---

## Best Practices Summary

| Pattern              | ✅ Do                          | ❌ Don't                        |
| -------------------- | ------------------------------ | ------------------------------- |
| **State**            | Use Signals for local state    | Overuse RxJS for simple state   |
| **Components**       | Standalone with direct imports | Bloated SharedModules           |
| **Change Detection** | Signals (OnPush is default)    | Setting `Eager` unnecessarily   |
| **Lazy Loading**     | `@defer` and `loadComponent`   | Eager load everything           |
| **DI**               | `inject()` function            | Constructor injection (verbose) |
| **Inputs**           | `input()` signal function      | `@Input()` decorator (legacy)   |
| **Zoneless**         | Enable for new projects        | Force on legacy without testing |

---

## Resources

- [Angular.dev Documentation](https://angular.dev)
- [Angular Signals Guide](https://angular.dev/guide/signals)
- [Angular SSR Guide](https://angular.dev/guide/ssr)
- [Angular Update Guide](https://angular.dev/update-guide)
- [Angular Blog](https://blog.angular.dev)

---

## Common Troubleshooting

| Issue                          | Solution                                            |
| ------------------------------ | --------------------------------------------------- |
| Signal not updating UI         | Ensure `OnPush` + call signal as function `count()` |
| Hydration mismatch             | Check server/client content consistency             |
| Circular dependency            | Use `inject()` with `forwardRef`                    |
| Zoneless not detecting changes | Trigger via signal updates, not mutations           |
| SSR fetch fails                | Use `TransferState` or `withFetch()`                |
