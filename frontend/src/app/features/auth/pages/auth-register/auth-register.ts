import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { AbstractControl, ReactiveFormsModule, FormGroup, FormControl, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { mapRegisterError } from '@core/auth/core-auth-error';
import { CoreRecaptchaService } from '@core/services/core-recaptcha.service';
import { Role } from '@data/models/user.model';
import { SharedStepDotsComponent } from '@shared/components/shared-step-dots/shared-step-dots';
import { SharedIconComponent } from '@shared/components/shared-icon/shared-icon';
import { SharedThemeSwitcherComponent } from '@shared/components/shared-theme-switcher/shared-theme-switcher';
import { SharedPaletteSwitcherComponent } from '@shared/components/shared-palette-switcher/shared-palette-switcher';
import { SharedLanguageSwitcherComponent } from '@shared/components/shared-language-switcher/shared-language-switcher';
import { AuthPageHeaderComponent } from '../../shared/components/auth-page-header/auth-page-header';
import { AuthFooterComponent } from '../../shared/components/auth-footer/auth-footer';
import { SharedPreferencesBarComponent } from '@shared/components/shared-preferences-bar/shared-preferences-bar';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm  = control.get('confirmPassword')?.value;
  if (!password || !confirm) return null;
  return password === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'auth-register',
  imports: [ReactiveFormsModule, RouterLink, SharedStepDotsComponent, SharedIconComponent, SharedThemeSwitcherComponent, SharedPaletteSwitcherComponent, SharedLanguageSwitcherComponent, AuthPageHeaderComponent, AuthFooterComponent, TranslocoDirective, SharedPreferencesBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegisterComponent {
  private auth      = inject(CoreAuthService);
  private router    = inject(Router);
  private recaptcha = inject(CoreRecaptchaService);
  private transloco = inject(TranslocoService);


  protected step         = signal(0);
  protected selectedRole = signal<Role | null>(null);
  protected loading      = signal(false);
  protected errorKey     = signal<string | null>(null);

  // Returns 3 (max) when no role is selected so step 0 always shows full dots
  protected totalSteps = computed(() => this.selectedRole() === 'user' ? 2 : 3);

  protected basicInfoForm = new FormGroup(
    {
      name:            new FormControl('', Validators.required),
      email:           new FormControl('', [Validators.required, Validators.email]),
      password:        new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', Validators.required),
    },
    { validators: passwordMatchValidator },
  );

  protected adminForm = new FormGroup({
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\+?[\d\s\-()+]{7,20}$/),
    ]),
    logoUrl: new FormControl('', [
      Validators.pattern(/^https?:\/\/.+/),
    ]),
  });

  protected selectRole(role: Role): void {
    this.selectedRole.set(role);
  }

  protected next(): void {
    this.step.update(s => s + 1);
  }

  protected back(): void {
    if (this.step() === 0) {
      this.router.navigate(['/auth/login']);
    } else {
      this.errorKey.set(null);
      this.step.update(s => s - 1);
    }
  }

  protected submitBasicInfo(): void {
    this.basicInfoForm.markAllAsTouched();
    if (this.selectedRole() === 'admin') {
      this.adminForm.controls.phone.markAsTouched();
    }
    if (this.basicInfoForm.invalid) return;
    if (this.selectedRole() === 'admin' && this.adminForm.controls.phone.invalid) return;
    this.errorKey.set(null);
    if (this.selectedRole() === 'admin') {
      this.next();
    } else {
      void this.doRegister();
    }
  }

  protected submitAdminInfo(): void {
    this.adminForm.markAllAsTouched();
    if (this.adminForm.invalid) return;
    void this.doRegister();
  }

  private async doRegister(): Promise<void> {
    const role = this.selectedRole();
    if (!role) return;

    this.loading.set(true);
    this.errorKey.set(null);
    try {
      await this.recaptcha.execute('register');
      await this.auth.register(
        this.basicInfoForm.value.email!,
        this.basicInfoForm.value.password!,
        this.basicInfoForm.value.name!,
        role,
        this.adminForm.value.phone ?? undefined,
        this.transloco.getActiveLang(),
        this.adminForm.value.logoUrl ?? undefined,
      );
    } catch (error) {
      const isRecaptchaError = error instanceof Error && error.message.includes('reCAPTCHA');
      this.errorKey.set(isRecaptchaError ? 'errors.recaptchaFailed' : mapRegisterError(error));
      this.loading.set(false);
    }
  }
}
