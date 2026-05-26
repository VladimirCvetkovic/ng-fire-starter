import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CoreLayoutSidenavComponent } from '../core-layout-sidenav/core-layout-sidenav';
import { CoreLayoutBannerComponent } from '../core-layout-banner/core-layout-banner';
import { CoreLayoutDrawerComponent } from '../core-layout-drawer/core-layout-drawer';
import { CoreLayoutBottomSheetComponent } from '../core-layout-bottom-sheet/core-layout-bottom-sheet';
import { Role } from '@data/models/user.model';
import { CoreAuthService } from '../../auth/core-auth.service';

@Component({
  selector: 'core-layout',
  imports: [RouterOutlet, CoreLayoutSidenavComponent, CoreLayoutBannerComponent, CoreLayoutDrawerComponent, CoreLayoutBottomSheetComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './core-layout.html',
  styleUrl: './core-layout.scss',
})
export class CoreLayoutComponent {
  role = input.required<Role>();

  private readonly router = inject(Router);
  protected readonly authSvc = inject(CoreAuthService);

  protected goToLog(): void {
    this.router.navigate(['/user/log']);
  }
}
