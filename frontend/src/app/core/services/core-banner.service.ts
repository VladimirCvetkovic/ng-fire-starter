import { Injectable, signal, Type } from '@angular/core';

/**
 * Controls a full-width banner slot rendered inside CoreLayoutComponent.
 *
 * Usage:
 *   inject(CoreBannerService).show(MyBannerComponent);
 *   inject(CoreBannerService).hide();
 */
@Injectable({ providedIn: 'root' })
export class CoreBannerService {
  private readonly _component = signal<Type<unknown> | null>(null);

  readonly component = this._component.asReadonly();
  readonly isVisible = () => this._component() !== null;

  show(component: Type<unknown>): void {
    this._component.set(component);
  }

  hide(): void {
    this._component.set(null);
  }
}
