import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { CoreFirebaseService } from '@core/firebase/core-firebase.service';
import { SharedPreferencesBarComponent } from '@shared/components/shared-preferences-bar/shared-preferences-bar';

@Component({
  selector: 'auth-verify-email',
  imports: [TranslocoDirective, SharedPreferencesBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-verify-email.html',
  styleUrl: './auth-verify-email.scss',
})
export class AuthVerifyEmailComponent {
  private auth      = inject(CoreAuthService);
  private firebase  = inject(CoreFirebaseService);
  private transloco = inject(TranslocoService);

  protected email    = this.firebase.auth.currentUser?.email ?? '';
  protected sending  = signal(false);
  protected sent     = signal(false);
  protected errorKey = signal<string | null>(null);

  protected async resend(): Promise<void> {
    this.sending.set(true);
    this.sent.set(false);
    this.errorKey.set(null);
    try {
      await this.auth.resendVerificationEmail(this.transloco.getActiveLang());
      this.sent.set(true);
    } catch {
      this.errorKey.set('errors.resendFailed');
    } finally {
      this.sending.set(false);
    }
  }

  protected goToLogin(): void {
    void this.auth.logout();
  }
}
