import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shared-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-icon.html',
  styleUrl: './shared-icon.scss',
  host: {
    'class': 'icon',
    'aria-hidden': 'true',
    '[style.--icon-url]': 'iconUrl()',
    '[style.width.px]': 'size()',
    '[style.height.px]': 'size()',
    '[style.color]': 'color() || null',
  },
})
export class SharedIconComponent {
  name = input.required<string>();
  size = input<number>(12);
  color = input<string>('');

  protected iconUrl = computed(() => `url(icons/${this.name()}.svg)`);
}
