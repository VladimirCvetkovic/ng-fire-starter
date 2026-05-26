import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CoreAuthService } from './core-auth.service';

/** Redirects logged-in users to their role home, unauthenticated users to login. */
export const coreSmartRedirectGuard: CanActivateFn = async () => {
  const auth = inject(CoreAuthService);
  const router = inject(Router);

  await auth.waitForAuthReady();

  if (auth.isLoggedIn()) {
    return router.createUrlTree(['/home']);
  }
  return router.createUrlTree(['/auth/login']);
};
