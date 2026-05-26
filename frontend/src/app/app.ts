import { Component, ChangeDetectionStrategy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslocoService } from '@jsverse/transloco';
import { CoreThemeService } from './core/services/core-theme.service';
import { CorePaletteService } from './core/services/core-palette.service';

@Component({
  selector: 'root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit {
  private readonly themeService = inject(CoreThemeService);
  private readonly paletteService = inject(CorePaletteService);
  private readonly translocoService = inject(TranslocoService);

  ngOnInit(): void {
    this.themeService.init();
    this.paletteService.init();
    const storedLang = localStorage.getItem('lang');
    this.translocoService.setActiveLang(
      storedLang === 'sr' || storedLang === 'en' ? storedLang : 'en',
    );
  }
}
