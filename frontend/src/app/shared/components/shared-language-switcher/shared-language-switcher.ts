import { Component, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'shared-language-switcher',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-language-switcher.html',
  styleUrl: './shared-language-switcher.scss',
})
export class SharedLanguageSwitcherComponent {
  private transloco = inject(TranslocoService);

  protected activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  protected toggle(): void {
    const newLang = this.activeLang() === 'sr' ? 'en' : 'sr';
    this.transloco.setActiveLang(newLang);
    localStorage.setItem('lang', newLang);
  }
}
