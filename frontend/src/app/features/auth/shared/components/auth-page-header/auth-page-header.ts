import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { SharedIconComponent } from '../../../../../shared/components/shared-icon/shared-icon';

@Component({
  selector: 'auth-page-header',
  imports: [SharedIconComponent, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-page-header.html',
  styleUrl: './auth-page-header.scss',
})
export class AuthPageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  backClick = output<void>();
}
