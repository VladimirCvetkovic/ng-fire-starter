import { Component, inject, effect, viewChild, ElementRef, DestroyRef, signal, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet, NgComponentOutlet } from '@angular/common';
import { TranslocoDirective } from '@jsverse/transloco';
import { CoreBottomSheetService } from '../../services/core-bottom-sheet.service';
import { SharedIconComponent } from '../../../shared/components/shared-icon/shared-icon';

@Component({
  selector: 'core-layout-bottom-sheet',
  imports: [NgTemplateOutlet, NgComponentOutlet, SharedIconComponent, TranslocoDirective],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './core-layout-bottom-sheet.html',
  styleUrl: './core-layout-bottom-sheet.scss',
})
export class CoreLayoutBottomSheetComponent {
  protected readonly bottomSheetSvc = inject(CoreBottomSheetService);
  private readonly panelRef = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly destroyRef = inject(DestroyRef);

  private readonly mql = window.matchMedia('(min-width: 768px)');
  protected readonly isWide = signal(this.mql.matches);

  private dragStartY = 0;
  private currentDelta = 0;

  constructor() {
    const handler = (e: MediaQueryListEvent) => this.isWide.set(e.matches);
    this.mql.addEventListener('change', handler);
    this.destroyRef.onDestroy(() => this.mql.removeEventListener('change', handler));

    effect((onCleanup) => {
      if (this.bottomSheetSvc.isOpen()) {
        const onKeyDown = (e: KeyboardEvent) => {
          if (e.key === 'Escape') this.bottomSheetSvc.close();
        };
        document.addEventListener('keydown', onKeyDown);
        onCleanup(() => document.removeEventListener('keydown', onKeyDown));
        Promise.resolve().then(() => this.panelRef()?.nativeElement.focus());
      }
    });
  }

  onDragStart(e: TouchEvent): void {
    this.dragStartY = e.touches[0].clientY;
    this.currentDelta = 0;
    const panel = this.panelRef()?.nativeElement;
    if (panel) panel.style.transition = 'none';
  }

  onDragMove(e: TouchEvent): void {
    const dy = e.touches[0].clientY - this.dragStartY;
    if (dy <= 0) return;
    this.currentDelta = dy;
    const panel = this.panelRef()?.nativeElement;
    if (panel) panel.style.transform = `translateY(${dy}px)`;
  }

  onDragEnd(): void {
    const panel = this.panelRef()?.nativeElement;
    if (!panel) { this.currentDelta = 0; return; }

    const threshold = panel.offsetHeight * 0.35;
    if (this.currentDelta > threshold) {
      panel.style.transition = 'transform 0.25s ease';
      panel.style.transform = `translateY(${panel.offsetHeight}px)`;
      panel.addEventListener('transitionend', () => this.bottomSheetSvc.close(), { once: true });
    } else {
      panel.style.transition = 'transform 0.25s ease';
      panel.style.transform = '';
      panel.addEventListener('transitionend', () => { panel.style.transition = ''; }, { once: true });
    }
    this.currentDelta = 0;
  }
}
