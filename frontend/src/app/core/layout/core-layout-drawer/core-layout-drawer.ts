import { Component, inject, effect, viewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet, NgComponentOutlet } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { CoreDrawerService } from '../../services/core-drawer.service';
import { SharedIconComponent } from '../../../shared/components/shared-icon/shared-icon';

@Component({
  selector: 'core-layout-drawer',
  imports: [NgTemplateOutlet, NgComponentOutlet, SharedIconComponent, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './core-layout-drawer.html',
  styleUrl: './core-layout-drawer.scss',
})
export class CoreLayoutDrawerComponent {
  protected readonly drawerSvc = inject(CoreDrawerService);
  private readonly drawerRef = viewChild<ElementRef<HTMLElement>>('drawerPanel');

  constructor() {
    effect((onCleanup) => {
      if (this.drawerSvc.isOpen()) {
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') this.drawerSvc.close();
        };
        document.addEventListener('keydown', onKeyDown);
        onCleanup(() => document.removeEventListener('keydown', onKeyDown));
        Promise.resolve().then(() => this.drawerRef()?.nativeElement.focus());
      }
    });
  }
}
