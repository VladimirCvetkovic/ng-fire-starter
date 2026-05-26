import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'shared-step-dots',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './shared-step-dots.html',
  styleUrl: './shared-step-dots.scss',
})
export class SharedStepDotsComponent {
  current = input.required<number>();
  total = input.required<number>();
  items = () => Array.from({ length: this.total() }, (_, i) => i);
}
