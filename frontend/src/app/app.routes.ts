import { inject } from '@angular/core';
import { CanMatchFn, Routes } from '@angular/router';
import { coreAuthGuard } from './core/auth/core-auth.guard';
import { coreSmartRedirectGuard } from './core/auth/core-smart-redirect.guard';
import { authActionGuard } from './features/auth/guards/auth-action.guard';
import { CoreAuthService } from './core/auth/core-auth.service';
import { CoreLayoutComponent } from './core/layout/core-layout/core-layout';

const adminCanMatch: CanMatchFn = async () => {
  const auth = inject(CoreAuthService);
  await auth.waitForAuthReady();
  return auth.role() === 'admin';
};

const userCanMatch: CanMatchFn = async () => {
  const auth = inject(CoreAuthService);
  await auth.waitForAuthReady();
  return auth.role() === 'user';
};

export const routes: Routes = [
  { path: '', pathMatch: 'full', canActivate: [coreSmartRedirectGuard], component: CoreLayoutComponent },

  {
    path: 'auth',
    canActivate: [authActionGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },

  // TODO: replace with real admin feature routes once implemented
  {
    path: '',
    component: CoreLayoutComponent,
    canActivate: [coreAuthGuard],
    canMatch: [adminCanMatch],
    loadChildren: () => import('./features/placeholder/placeholder.routes').then(m => m.placeholderRoutes),
  },

  // TODO: replace with real user feature routes once implemented
  {
    path: '',
    component: CoreLayoutComponent,
    canActivate: [coreAuthGuard],
    canMatch: [userCanMatch],
    loadChildren: () => import('./features/placeholder/placeholder.routes').then(m => m.placeholderRoutes),
  },

  { path: '**', canActivate: [coreSmartRedirectGuard], component: CoreLayoutComponent },
];
