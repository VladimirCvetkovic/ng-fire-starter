import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { CoreBannerService } from '../../services/core-banner.service';

@Component({
  selector: 'core-layout-banner',
  imports: [NgComponentOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './core-layout-banner.html',
  styleUrl: './core-layout-banner.scss',
})
export class CoreLayoutBannerComponent {
  protected readonly bannerSvc = inject(CoreBannerService);
}
