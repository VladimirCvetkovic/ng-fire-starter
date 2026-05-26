import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';

export const authActionGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router    = inject(Router);
  const transloco = inject(TranslocoService);

  const mode    = route.queryParamMap.get('mode');
  const oobCode = route.queryParamMap.get('oobCode');
  const lang    = route.queryParamMap.get('lang');

  if (!mode) return true;

  if (lang) transloco.setActiveLang(lang);

  const queryParams = { ...(oobCode ? { oobCode } : {}), ...(lang ? { lang } : {}) };

  if (mode === 'resetPassword' && oobCode) {
    return router.createUrlTree(['/auth/reset-password'], { queryParams });
  }

  if (mode === 'verifyEmail' && oobCode) {
    return router.createUrlTree(['/auth/email-verified'], { queryParams });
  }

  return router.createUrlTree(['/auth/email-verified'], { queryParams: { error: 'invalid' } });
};
