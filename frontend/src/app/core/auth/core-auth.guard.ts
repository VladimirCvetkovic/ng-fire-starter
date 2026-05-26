import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CoreAuthService } from './core-auth.service';

export const coreAuthGuard: CanActivateFn = async () => {
  const auth = inject(CoreAuthService);
  const router = inject(Router);

  // Wait for Firebase to resolve the persisted session before checking login state
  await auth.waitForAuthReady();

  if (auth.isLoggedIn()) return true;
  return router.createUrlTree(['/auth/login']);
};
