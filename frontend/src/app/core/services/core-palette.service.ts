import { Injectable, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type PaletteKey = 'blue' | 'violet' | 'emerald' | 'rose' | 'amber' | 'red' | 'pink' | 'cyan' | 'orange';

const VALID_PALETTES: PaletteKey[] = ['blue', 'violet', 'emerald', 'rose', 'amber', 'red', 'pink', 'cyan', 'orange'];

/**
 * Manages the application primary color palette.
 *
 * Bootstrap (call once in AppComponent.ngOnInit):
 *   inject(CorePaletteService).init();
 *
 * Switch palette:
 *   inject(CorePaletteService).setPalette('emerald');
 *
 * Read current palette reactively:
 *   palette = inject(CorePaletteService).palette; // Signal<PaletteKey>
 *
 * Side effect: sets/removes the `data-palette` attribute on <html>.
 * Blue is the default; no attribute is set when blue is active.
 */
@Injectable({ providedIn: 'root' })
export class CorePaletteService {
  private readonly doc = inject(DOCUMENT);

  private _palette = signal<PaletteKey>('blue');
  readonly palette = this._palette.asReadonly();

  init(): void {
    const stored = localStorage.getItem('palette') as PaletteKey | null;
    this._palette.set(VALID_PALETTES.includes(stored as PaletteKey) ? (stored as PaletteKey) : 'blue');
    this.apply();
  }

  setPalette(palette: PaletteKey): void {
    this._palette.set(palette);
    localStorage.setItem('palette', palette);
    this.apply();
  }

  private apply(): void {
    const el = this.doc.documentElement;
    if (this._palette() === 'blue') {
      el.removeAttribute('data-palette');
    } else {
      el.setAttribute('data-palette', this._palette());
    }
  }
}
