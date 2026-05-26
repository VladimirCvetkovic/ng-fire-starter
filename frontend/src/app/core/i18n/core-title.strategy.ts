import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { switchMap, take } from 'rxjs';

/**
 * Custom title strategy that translates route `title` i18n keys and appends the app name.
 * Register via `{ provide: TitleStrategy, useClass: CoreTitleStrategy }` in app.config.ts.
 * Route usage: `title: 'auth.login.pageTitle'` → "Sign in | My Coach"
 * Waits for translations to load before setting the title, and reacts to language changes.
 */
@Injectable({ providedIn: 'root' })
export class CoreTitleStrategy extends TitleStrategy {
  private readonly titleService = inject(Title);
  private readonly transloco    = inject(TranslocoService);
  private lastSnapshot: RouterStateSnapshot | null = null;

  constructor() {
    super();
    this.transloco.langChanges$.pipe(
      switchMap(lang => this.transloco.selectTranslation(lang).pipe(take(1))),
    ).subscribe(() => {
      if (this.lastSnapshot) this.applyTitle(this.lastSnapshot);
    });
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastSnapshot = snapshot;
    this.transloco.selectTranslation().pipe(take(1)).subscribe(() => {
      this.applyTitle(snapshot);
    });
  }

  private applyTitle(snapshot: RouterStateSnapshot): void {
    const appName   = this.transloco.translate('ui.appName');
    const routeKey  = this.buildTitle(snapshot);
    const pageTitle = routeKey ? this.transloco.translate(routeKey) : null;
    this.titleService.setTitle(pageTitle ? `${pageTitle} | ${appName}` : appName);
  }
}
