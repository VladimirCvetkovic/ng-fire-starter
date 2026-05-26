import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideTransloco } from '@jsverse/transloco';

import { routes } from './app.routes';
import { CoreTranslocoHttpLoader } from './core/i18n/core-transloco-loader';
import { CoreTitleStrategy } from './core/i18n/core-title.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    { provide: TitleStrategy, useClass: CoreTitleStrategy },
    provideHttpClient(),
    provideTransloco({
      config: {
        availableLangs: ['sr', 'en'],
        defaultLang: 'en',
        fallbackLang: 'en',
        reRenderOnLangChange: true,
        prodMode: !isDevMode(),
      },
      loader: CoreTranslocoHttpLoader,
    }),
  ],
};
