import { Injectable, signal, Type, TemplateRef } from '@angular/core';

export interface DrawerConfig {
  title: string;
  subtitle?: string;
  component?: Type<unknown>;
  inputs?: Record<string, unknown>;
  template?: TemplateRef<unknown>;
}

/**
 * Opens and closes the wide slide-in drawer rendered inside CoreLayoutComponent.
 *
 * Usage:
 *   inject(CoreDrawerService).open({ title: 'Edit profile', component: EditProfileComponent });
 *   inject(CoreDrawerService).close();
 */
@Injectable({ providedIn: 'root' })
export class CoreDrawerService {
  private readonly _config = signal<DrawerConfig | null>(null);

  readonly config = this._config.asReadonly();
  readonly isOpen = () => this._config() !== null;

  open(config: DrawerConfig): void {
    this._config.set(config);
  }

  close(): void {
    this._config.set(null);
  }
}
