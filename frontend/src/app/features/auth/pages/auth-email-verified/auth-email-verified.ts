import { Component, signal, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { SharedPreferencesBarComponent } from '@shared/components/shared-preferences-bar/shared-preferences-bar';

type PageState = 'verifying' | 'success' | 'invalid';

@Component({
  selector: 'auth-email-verified',
  imports: [RouterLink, TranslocoDirective, SharedPreferencesBarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-email-verified.html',
  styleUrl: './auth-email-verified.scss',
})
export class AuthEmailVerifiedComponent implements OnInit {
  private auth      = inject(CoreAuthService);
  private route     = inject(ActivatedRoute);
  private transloco = inject(TranslocoService);

  protected pageState = signal<PageState>('verifying');

  async ngOnInit(): Promise<void> {
    const params  = this.route.snapshot.queryParamMap;
    const oobCode = params.get('oobCode');
    const lang    = params.get('lang');

    if (lang) this.transloco.setActiveLang(lang);

    if (params.get('error') === 'invalid' || !oobCode) {
      this.pageState.set('invalid');
      return;
    }

    try {
      await this.auth.applyEmailVerificationCode(oobCode);
      this.pageState.set('success');
    } catch {
      this.pageState.set('invalid');
    }
  }
}
