import { inject, Injectable, DOCUMENT, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@environments/environment';

interface Grecaptcha {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

declare const grecaptcha: Grecaptcha;

/**
 * Wraps Google reCAPTCHA v3.
 *
 * Bootstrap: `provideRecaptcha()` in app.config.ts loads the script at startup.
 *
 * Usage:
 *   const token = await this.recaptcha.execute('login');
 *   // send token to your Cloud Function for server-side score verification
 *
 * If `environment.recaptchaSiteKey` is empty the method resolves with an empty string
 * so local develop works without a key.
 */
@Injectable({ providedIn: 'root' })
export class CoreRecaptchaService {
  private readonly document   = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private scriptLoaded = false;

  constructor() {
    if (isPlatformBrowser(this.platformId) && environment.recaptchaSiteKey) {
      void this.loadScript();
    }
  }

  preload(): Promise<void> {
    if (!environment.recaptchaSiteKey) return Promise.resolve();
    return this.loadScript();
  }

  execute(action: string): Promise<string> {
    if (!environment.recaptchaSiteKey) return Promise.resolve('');
    return this.loadScript().then(
      () =>
        new Promise<string>(resolve => {
          grecaptcha.ready(() => {
            void grecaptcha
              .execute(environment.recaptchaSiteKey, { action })
              .then(token => {
                console.log(`[reCAPTCHA] action="${action}" token=`, token);
                resolve(token);
              });
          });
        }),
    );
  }

  private loadScript(): Promise<void> {
    console.log('[reCAPTCHA] loadScript, document:', !!this.document, 'head:', !!this.document?.head);
    if (this.scriptLoaded) return Promise.resolve();
    return new Promise<void>((resolve, reject) => {
      const script = this.document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${environment.recaptchaSiteKey}`;
      script.onload = () => {
        this.scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('reCAPTCHA script failed to load'));
      this.document.head.appendChild(script);
    });
  }
}
