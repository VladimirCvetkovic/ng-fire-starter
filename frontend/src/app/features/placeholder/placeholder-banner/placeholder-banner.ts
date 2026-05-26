import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CoreBannerService } from '@core/services/core-banner.service';

@Component({
  selector: 'placeholder-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './placeholder-banner.html',
  styleUrl: './placeholder-banner.scss',
  imports: [TranslocoDirective],
})
export class PlaceholderBannerComponent {
  protected readonly banner = inject(CoreBannerService);
}
