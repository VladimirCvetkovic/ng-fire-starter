import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
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
  imports: [ReactiveFormsModule, RouterLink, TranslocoDirective, TranslocoPipe, SharedPreferencesBarComponent, AuthFooterComponent, SharedLabelInitialsPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLoginComponent {
  private auth       = inject(CoreAuthService);
  private recaptcha  = inject(CoreRecaptchaService);

  protected form = new FormGroup({
    email:    new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  protected loading  = signal(false);
  protected errorKey = signal<string | null>(null);

  protected async doLogin(): Promise<void> {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      await this.recaptcha.execute('login');
      await this.auth.login(
        this.form.value.email!,
        this.form.value.password!,
      );
    } catch (error) {
      const isRecaptchaError = error instanceof Error && error.message.includes('reCAPTCHA');
      this.errorKey.set(isRecaptchaError ? 'errors.recaptchaFailed' : mapLoginError(error));
      this.loading.set(false);
    }
  }
}
