import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { TranslocoDirective } from '@jsverse/transloco';
import { CorePaletteService, PaletteKey } from '@core/services/core-palette.service';

interface PaletteOption {
  value: PaletteKey;
  labelKey: string;
}

@Component({
  selector: 'shared-palette-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-palette-switcher.html',
  styleUrl: './shared-palette-switcher.scss',
  imports: [TranslocoDirective],
})
export class SharedPaletteSwitcherComponent {
  private readonly paletteService = inject(CorePaletteService);

  protected readonly currentPalette = this.paletteService.palette;

  protected readonly options: PaletteOption[] = [
    { value: 'emerald', labelKey: 'emerald' },
    { value: 'blue',    labelKey: 'blue'    },
    { value: 'amber',   labelKey: 'amber'   },
    { value: 'red',     labelKey: 'red'     },
    { value: 'violet',  labelKey: 'violet'  },
    { value: 'pink',    labelKey: 'pink'    },
    { value: 'cyan',    labelKey: 'cyan'    },
    { value: 'orange',  labelKey: 'orange'  },
  ];

  protected setPalette(palette: PaletteKey): void {
    this.paletteService.setPalette(palette);
  }
}
