import { Routes } from '@angular/router';
import { coreAuthGuard } from './core/auth/core-auth.guard';
import { authActionGuard } from './features/auth/guards/auth-action.guard';
import { CoreLayoutComponent } from './core/layout/core-layout/core-layout';

export const routes: Routes = [
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

  {
    path: 'auth',
    canActivate: [authActionGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.authRoutes),
  },

  // TODO: replace with real feature routes once implemented
  {
    path: 'user',
    component: CoreLayoutComponent,
    canActivate: [coreAuthGuard],
    data: { role: 'user' },
    loadChildren: () => import('./features/placeholder/placeholder.routes').then(m => m.placeholderRoutes),
  },
  {
    path: 'admin',
    component: CoreLayoutComponent,
    canActivate: [coreAuthGuard],
    data: { role: 'admin' },
    loadChildren: () => import('./features/placeholder/placeholder.routes').then(m => m.placeholderRoutes),
  },

  { path: '**', redirectTo: 'auth/login' },
];
