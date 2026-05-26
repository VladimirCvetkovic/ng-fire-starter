import { Routes } from '@angular/router';

export const placeholderRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: '**',
    loadComponent: () => import('./placeholder').then(m => m.PlaceholderComponent),
  },
];
