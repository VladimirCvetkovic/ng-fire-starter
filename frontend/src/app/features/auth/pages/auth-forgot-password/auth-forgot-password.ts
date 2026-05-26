import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { mapForgotPasswordError } from '@core/auth/core-auth-error';
import { SharedPreferencesBarComponent } from '@shared/components/shared-preferences-bar/shared-preferences-bar';

@Component({
  selector: 'auth-forgot-password',
  imports: [ReactiveFormsModule, RouterLink, TranslocoDirective, SharedPreferencesBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-forgot-password.html',
  styleUrl: './auth-forgot-password.scss',
})
export class AuthForgotPasswordComponent {
  private auth     = inject(CoreAuthService);
  private transloco = inject(TranslocoService);

  protected email = new FormControl('', [Validators.required, Validators.email]);

  protected loading    = signal(false);
  protected sent       = signal(false);
  protected sentEmail  = signal('');
  protected errorKey   = signal<string | null>(null);

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    if (this.email.invalid) {
      this.email.markAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      await this.auth.resetPassword(this.email.value!, this.transloco.getActiveLang());
      this.sentEmail.set(this.email.value!);
      this.sent.set(true);
    } catch (error) {
      this.errorKey.set(mapForgotPasswordError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
