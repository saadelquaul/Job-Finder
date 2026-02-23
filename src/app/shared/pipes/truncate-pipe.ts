import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, limit: number = 150, trail: string = '...'): string {
    if (!value) return '';
    if (value.length <= limit) return value;

    // Strip HTML tags first
    const stripped = value.replace(/<[^>]*>/g, '');
    return stripped.length <= limit ? stripped : stripped.substring(0, limit) + trail;
  }

}
