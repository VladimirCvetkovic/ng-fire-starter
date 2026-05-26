import { Injectable, signal, Type, TemplateRef } from '@angular/core';

export interface BottomSheetConfig {
  title: string;
  subtitle?: string;
  component?: Type<unknown>;
  inputs?: Record<string, unknown>;
  template?: TemplateRef<unknown>;
}

/**
 * Opens and closes the wide bottom sheet (modal on wide viewports) rendered inside CoreLayoutComponent.
 *
 * Usage:
 *   inject(CoreBottomSheetService).open({ title: 'Select option', component: OptionListComponent });
 *   inject(CoreBottomSheetService).close();
 */
@Injectable({ providedIn: 'root' })
export class CoreBottomSheetService {
  private readonly _config = signal<BottomSheetConfig | null>(null);

  readonly config = this._config.asReadonly();
  readonly isOpen = () => this._config() !== null;

  open(config: BottomSheetConfig): void {
    this._config.set(config);
  }

  close(): void {
    this._config.set(null);
  }
}
