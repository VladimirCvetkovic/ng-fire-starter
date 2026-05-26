import { Component, signal, computed, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { form, FormField, FormRoot, required, minLength } from '@angular/forms/signals';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { mapResetPasswordError } from '@core/auth/core-auth-error';
import { SharedPreferencesBarComponent } from '@shared/components/shared-preferences-bar/shared-preferences-bar';

type PageState = 'verifying' | 'invalid' | 'form' | 'success';

@Component({
  selector: 'auth-reset-password',
  imports: [FormField, FormRoot, RouterLink, TranslocoDirective, SharedPreferencesBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-reset-password.html',
  styleUrl: './auth-reset-password.scss',
})
export class AuthResetPasswordComponent implements OnInit {
  private auth      = inject(CoreAuthService);
  private route     = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  private oobCode = '';

  private resetModel = signal({ password: '', confirmPassword: '' });

  protected resetForm = form(this.resetModel, p => {
    required(p.password, { message: 'validation.required' });
    minLength(p.password, 6, { message: 'validation.minPassword' });
    required(p.confirmPassword, { message: 'validation.required' });
  });

  protected submitted = signal(false);

  protected passwordMismatch = computed(() => {
    const { password, confirmPassword } = this.resetModel();
    return !!(password && confirmPassword && password !== confirmPassword);
  });

  protected pageState = signal<PageState>('verifying');
  protected userEmail = signal('');
  protected loading   = signal(false);
  protected errorKey  = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    const lang = this.route.snapshot.queryParamMap.get('lang');
    if (lang) this.transloco.setActiveLang(lang);

    const code = this.route.snapshot.queryParamMap.get('oobCode');
    if (!code) {
      this.pageState.set('invalid');
      return;
    }
    this.oobCode = code;
    try {
      const email = await this.auth.verifyPasswordResetCode(code);
      this.userEmail.set(email);
      this.pageState.set('form');
    } catch {
      this.pageState.set('invalid');
    }
  }

  protected async submit(): Promise<void> {
    this.submitted.set(true);
    if (this.resetForm.password().invalid() || this.resetForm.confirmPassword().invalid() || this.passwordMismatch()) return;
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      await this.auth.confirmPasswordReset(this.oobCode, this.resetModel().password);
      this.pageState.set('success');
    } catch (error) {
      this.errorKey.set(mapResetPasswordError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
