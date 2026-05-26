import { Routes } from '@angular/router';

export const placeholderRoutes: Routes = [
  {
    path: '**',
    loadComponent: () => import('./placeholder').then(m => m.PlaceholderComponent),
  },
];
