import { Component, signal, computed, ChangeDetectionStrategy, inject } from '@angular/core';
import { form, FormField, FormRoot, required, email as emailValidator, minLength, pattern } from '@angular/forms/signals';
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

@Component({
  selector: 'auth-register',
  imports: [FormField, FormRoot, RouterLink, SharedStepDotsComponent, SharedIconComponent, SharedThemeSwitcherComponent, SharedPaletteSwitcherComponent, SharedLanguageSwitcherComponent, AuthPageHeaderComponent, AuthFooterComponent, TranslocoDirective, SharedPreferencesBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegisterComponent {
  private auth      = inject(CoreAuthService);
  private router    = inject(Router);
  private recaptcha = inject(CoreRecaptchaService);
  private transloco = inject(TranslocoService);

  protected step               = signal(0);
  protected selectedRole       = signal<Role | null>(null);
  protected loading            = signal(false);
  protected errorKey           = signal<string | null>(null);
  protected basicInfoSubmitted = signal(false);
  protected adminSubmitted     = signal(false);

  // Returns 3 (max) when no role is selected so step 0 always shows full dots
  protected totalSteps = computed(() => this.selectedRole() === 'user' ? 2 : 3);

  private basicInfoModel = signal({ name: '', email: '', password: '', confirmPassword: '' });
  private adminModel     = signal({ phone: '', logoUrl: '' });

  protected basicInfoForm = form(this.basicInfoModel, p => {
    required(p.name,            { message: 'auth.register.validation.required' });
    required(p.email,           { message: 'auth.register.validation.required' });
    emailValidator(p.email,     { message: 'auth.register.validation.invalidEmail' });
    required(p.password,        { message: 'auth.register.validation.required' });
    minLength(p.password,       6, { message: 'auth.register.validation.minPassword' });
    required(p.confirmPassword, { message: 'auth.register.validation.required' });
  });

  protected adminForm = form(this.adminModel, p => {
    required(p.phone,  { message: 'auth.register.validation.required' });
    pattern(p.phone,   /^\+?[\d\s\-()+]{7,20}$/, { message: 'auth.register.validation.invalidPhone' });
    pattern(p.logoUrl, /^https?:\/\/.+/, { message: 'auth.register.validation.invalidUrl' });
  });

  protected passwordMismatch = computed(() => {
    const { password, confirmPassword } = this.basicInfoModel();
    return !!(password && confirmPassword && password !== confirmPassword);
  });

  protected basicInfoFormInvalid = computed(() =>
    this.basicInfoForm.name().invalid() ||
    this.basicInfoForm.email().invalid() ||
    this.basicInfoForm.password().invalid() ||
    this.basicInfoForm.confirmPassword().invalid()
  );

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
    this.basicInfoSubmitted.set(true);
    if (this.basicInfoFormInvalid() || this.passwordMismatch()) return;
    if (this.selectedRole() === 'admin' && this.adminForm.phone().invalid()) return;
    this.errorKey.set(null);
    if (this.selectedRole() === 'admin') {
      this.next();
    } else {
      void this.doRegister();
    }
  }

  protected submitAdminInfo(): void {
    this.adminSubmitted.set(true);
    if (this.adminForm.logoUrl().invalid()) return;
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
        this.basicInfoModel().email,
        this.basicInfoModel().password,
        this.basicInfoModel().name,
        role,
        this.adminModel().phone || undefined,
        this.transloco.getActiveLang(),
        this.adminModel().logoUrl || undefined,
      );
    } catch (error) {
      const isRecaptchaError = error instanceof Error && error.message.includes('reCAPTCHA');
      this.errorKey.set(isRecaptchaError ? 'errors.recaptchaFailed' : mapRegisterError(error));
      this.loading.set(false);
    }
  }
}
