import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CoreThemeService } from '../../../core/services/core-theme.service';
import { SharedIconComponent } from '../shared-icon/shared-icon';

@Component({
  selector: 'shared-theme-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-theme-switcher.html',
  styleUrl: './shared-theme-switcher.scss',
  imports: [SharedIconComponent],
})
export class SharedThemeSwitcherComponent {
  private readonly themeService = inject(CoreThemeService);

  protected readonly isDark = computed(() => this.themeService.resolvedMode() === 'dark');

  protected toggle(): void {
    this.themeService.setMode(this.isDark() ? 'light' : 'dark');
  }
}
