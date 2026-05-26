import { Component, ChangeDetectionStrategy, inject, viewChild, TemplateRef } from '@angular/core';
import { TranslocoDirective, TranslocoService } from '@jsverse/transloco';
import { CoreAuthService } from '@core/auth/core-auth.service';
import { CoreDrawerService } from '@core/services/core-drawer.service';
import { CoreBottomSheetService } from '@core/services/core-bottom-sheet.service';
import { CoreBannerService } from '@core/services/core-banner.service';
import { SharedThemeSwitcherComponent } from '@shared/components/shared-theme-switcher/shared-theme-switcher';
import { SharedPaletteSwitcherComponent } from '@shared/components/shared-palette-switcher/shared-palette-switcher';
import { SharedIconComponent } from '@shared/components/shared-icon/shared-icon';
import { PlaceholderBannerComponent } from './placeholder-banner/placeholder-banner';

@Component({
  selector: 'placeholder',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.scss',
  imports: [SharedThemeSwitcherComponent, SharedPaletteSwitcherComponent, SharedIconComponent, TranslocoDirective],
})
export class PlaceholderComponent {
  protected readonly auth = inject(CoreAuthService);
  private readonly drawer = inject(CoreDrawerService);
  private readonly bottomSheet = inject(CoreBottomSheetService);
  private readonly banner = inject(CoreBannerService);
  private readonly transloco = inject(TranslocoService);

  private readonly drawerTpl = viewChild.required<TemplateRef<unknown>>('drawerTpl');
  private readonly bottomSheetTpl = viewChild.required<TemplateRef<unknown>>('bottomSheetTpl');

  openDrawer(): void {
    this.drawer.open({
      title: this.transloco.translate('placeholder.drawerTitle'),
      subtitle: this.transloco.translate('placeholder.drawerSubtitle'),
      template: this.drawerTpl(),
    });
  }

  openBottomSheet(): void {
    this.bottomSheet.open({
      title: this.transloco.translate('placeholder.bottomSheetTitle'),
      subtitle: this.transloco.translate('placeholder.bottomSheetSubtitle'),
      template: this.bottomSheetTpl(),
    });
  }

  openBanner(): void {
    this.banner.show(PlaceholderBannerComponent);
  }
}
