import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { environment } from '@environments/environment';
import { version } from '../../../../../../../package.json';

@Component({
  selector: 'auth-footer',
  imports: [TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-footer.html',
  styleUrl: './auth-footer.scss',
})
export class AuthFooterComponent {
  readonly isProduction = environment.production;
  readonly buildVersion = version;
}
