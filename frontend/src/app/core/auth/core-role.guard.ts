import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CoreAuthService } from './core-auth.service';
import { Role } from '@data/models/user.model';

export const coreRoleGuard = (requiredRole: Role): CanActivateFn => () => {
  const auth = inject(CoreAuthService);
  const router = inject(Router);
  if (auth.role() === requiredRole) return true;
  return router.createUrlTree(['/home']);
};
