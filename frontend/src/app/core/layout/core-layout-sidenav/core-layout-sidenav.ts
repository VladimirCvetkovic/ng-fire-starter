import { Component, input, output, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslocoDirective, TranslocoPipe } from '@jsverse/transloco';
import { AppUser, Role } from '@data/models/user.model';
import { SharedIconComponent } from '../../../shared/components/shared-icon/shared-icon';
import { SharedPreferencesBarComponent } from '../../../shared/components/shared-preferences-bar/shared-preferences-bar';
import { SharedLabelInitialsPipe } from '../../../shared/pipes/shared-label-initials.pipe';
import { CoreAuthService } from '../../auth/core-auth.service';

@Component({
  selector: 'core-layout-sidenav',
  imports: [RouterLink, RouterLinkActive, SharedIconComponent, SharedPreferencesBarComponent, SharedLabelInitialsPipe, TranslocoDirective, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './core-layout-sidenav.html',
  styleUrl: './core-layout-sidenav.scss',
})
export class CoreLayoutSidenavComponent {
  role = input.required<Role>();
  userData = input<AppUser | null>();
  playClick = output<void>();

  protected readonly authSvc = inject(CoreAuthService);

  private static readonly COLLAPSED_KEY = 'sidebar-collapsed';

  protected collapsed = signal(
    localStorage.getItem(CoreLayoutSidenavComponent.COLLAPSED_KEY) === 'true'
  );

  protected toggleCollapse(): void {
    this.collapsed.update(v => {
      const next = !v;
      localStorage.setItem(CoreLayoutSidenavComponent.COLLAPSED_KEY, String(next));
      return next;
    });
  }

  protected adminItems = [
    { key: 'home',     path: '/home',     icon: 'grid'    },
    { key: 'clients',  path: '/clients',  icon: 'clients' },
    { key: 'plans',    path: '/plans',    icon: 'plans'   },
    { key: 'meals',    path: '/meals',    icon: 'meals'   },
    { key: 'settings', path: '/settings', icon: 'palette' },
  ];

  protected userItems = [
    { key: 'home',    path: '/home',    icon: 'home'    },
    { key: 'meals',   path: '/meals',   icon: 'meals'   },
    { key: 'play',    path: '/play',    icon: 'play'    },
    { key: 'history', path: '/history', icon: 'history' },
    { key: 'profile', path: '/profile', icon: 'profile' },
  ];
}
