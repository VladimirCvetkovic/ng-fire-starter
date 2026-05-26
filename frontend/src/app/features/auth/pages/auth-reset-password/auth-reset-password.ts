import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { mapResetPasswordError } from '@core/auth/core-auth-error';
import { SharedPreferencesBarComponent } from '@shared/components/shared-preferences-bar/shared-preferences-bar';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm  = control.get('confirmPassword')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordMismatch: true };
}

type PageState = 'verifying' | 'invalid' | 'form' | 'success';

@Component({
  selector: 'auth-reset-password',
  imports: [ReactiveFormsModule, RouterLink, TranslocoDirective, SharedPreferencesBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-reset-password.html',
  styleUrl: './auth-reset-password.scss',
})
export class AuthResetPasswordComponent implements OnInit {
  private auth      = inject(CoreAuthService);
  private route     = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  private oobCode = '';

  protected pageState = signal<PageState>('verifying');
  protected userEmail = signal('');
  protected loading   = signal(false);
  protected errorKey  = signal<string | null>(null);

  protected form = new FormGroup(
    {
      password:        new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: passwordMatchValidator },
  );

  protected get password()        { return this.form.controls.password; }
  protected get confirmPassword() { return this.form.controls.confirmPassword; }
  protected get passwordMismatch(){ return this.form.hasError('passwordMismatch') && this.confirmPassword.touched; }

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

  protected async submit(event: Event): Promise<void> {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.loading.set(true);
    this.errorKey.set(null);
    try {
      await this.auth.confirmPasswordReset(this.oobCode, this.form.value.password!);
      this.pageState.set('success');
    } catch (error) {
      this.errorKey.set(mapResetPasswordError(error));
    } finally {
      this.loading.set(false);
    }
  }
}
