import { Component, ChangeDetectionStrategy } from '@angular/core';
import { SharedLanguageSwitcherComponent } from '../shared-language-switcher/shared-language-switcher';
import { SharedThemeSwitcherComponent } from '../shared-theme-switcher/shared-theme-switcher';

@Component({
  selector: 'shared-preferences-bar',
  imports: [SharedLanguageSwitcherComponent, SharedThemeSwitcherComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-preferences-bar.html',
  styleUrl: './shared-preferences-bar.scss',
})
export class SharedPreferencesBarComponent {}
