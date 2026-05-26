import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'labelInitials' })
export class SharedLabelInitialsPipe implements PipeTransform {
  transform(name: string | null | undefined): string {
    return (name ?? '')
      .split(' ')
      .slice(0, 2)
      .map(w => w[0] ?? '')
      .join('')
      .toUpperCase();
  }
}
