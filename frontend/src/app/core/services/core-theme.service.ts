import { Injectable, signal, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type ThemeMode = 'light' | 'dark' | 'system';

/**
 * Manages the application color theme.
 *
 * Bootstrap (call once in AppComponent.ngOnInit):
 *   inject(CoreThemeService).init();
 *
 * Switch theme:
 *   inject(CoreThemeService).setMode('dark');
 *   inject(CoreThemeService).setMode('system'); // follows OS preference
 *
 * Read current preference reactively:
 *   mode = inject(CoreThemeService).mode; // Signal<ThemeMode>
 */
@Injectable({ providedIn: 'root' })
export class CoreThemeService {
  private readonly doc = inject(DOCUMENT);

  private _mode = signal<ThemeMode>('system');
  readonly mode = this._mode.asReadonly();

  private _resolvedMode = signal<'light' | 'dark'>('light');
  readonly resolvedMode = this._resolvedMode.asReadonly();

  private mediaQuery: MediaQueryList | null = null;
  private readonly onOsChange = () => {
    if (this._mode() === 'system') this.applyResolved();
  };

  setMode(mode: ThemeMode): void {
    this._mode.set(mode);
    localStorage.setItem('theme-mode', mode);
    this.applyResolved();
  }

  init(): void {
    const win = this.doc.defaultView;
    if (win) {
      this.mediaQuery = win.matchMedia('(prefers-color-scheme: dark)');
      this.mediaQuery.addEventListener('change', this.onOsChange);
    }

    const stored = localStorage.getItem('theme-mode') as ThemeMode | null;
    this._mode.set(
      stored === 'light' || stored === 'dark' || stored === 'system'
        ? stored
        : 'system',
    );
    this.applyResolved();
  }

  private applyResolved(): void {
    const resolved: 'light' | 'dark' =
      this._mode() === 'system'
        ? (this.mediaQuery?.matches ? 'dark' : 'light')
        : (this._mode() as 'light' | 'dark');
    this.doc.documentElement.setAttribute('data-theme', resolved);
    this._resolvedMode.set(resolved);
  }
}
