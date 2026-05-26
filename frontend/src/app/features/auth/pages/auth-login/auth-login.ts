import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { form, FormField, FormRoot, required, email as emailValidator } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { mapLoginError } from '@core/auth/core-auth-error';
import { CoreRecaptchaService } from '@core/services/core-recaptcha.service';
import { SharedPreferencesBarComponent } from '@shared/components/shared-preferences-bar/shared-preferences-bar';
import { AuthFooterComponent } from '../../shared/components/auth-footer/auth-footer';
import { SharedLabelInitialsPipe } from '@shared/pipes/shared-label-initials.pipe';

@Component({
  selector: 'auth-login',
  imports: [FormField, FormRoot, RouterLink, TranslocoDirective, TranslocoPipe, SharedPreferencesBarComponent, AuthFooterComponent, SharedLabelInitialsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLoginComponent {
  private auth       = inject(CoreAuthService);
  private recaptcha  = inject(CoreRecaptchaService);

  private model = signal({ email: '', password: '' });

  protected loginForm = form(this.model, p => {
    required(p.email, { message: 'validation.required' });
    emailValidator(p.email, { message: 'validation.invalidEmail' });
    required(p.password, { message: 'validation.required' });
  });

  protected formInvalid = computed(() =>
    this.loginForm.email().invalid() || this.loginForm.password().invalid()
  );

  protected submitted = signal(false);
  protected loading   = signal(false);
  protected errorKey  = signal<string | null>(null);

  protected async doLogin(): Promise<void> {
    this.submitted.set(true);
    if (this.formInvalid()) return;
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      await this.recaptcha.execute('login');
      await this.auth.login(
        this.model().email,
        this.model().password,
      );
    } catch (error) {
      const isRecaptchaError = error instanceof Error && error.message.includes('reCAPTCHA');
      this.errorKey.set(isRecaptchaError ? 'errors.recaptchaFailed' : mapLoginError(error));
      this.loading.set(false);
    }
  }
}
