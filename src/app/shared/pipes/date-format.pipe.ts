import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: Date | string, format: 'short' | 'medium' | 'long' = 'medium'): string {
    if (!value) return '';

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {};

    switch (format) {
      case 'short':
        options.hour = 'numeric';
        options.minute = 'numeric';
        options.hour12 = true;
        break;
      case 'medium':
        options.weekday = 'short';
        options.month = 'short';
        options.day = 'numeric';
        options.hour = 'numeric';
        options.minute = 'numeric';
        options.hour12 = true;
        break;
      case 'long':
        options.weekday = 'long';
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = 'numeric';
        options.minute = 'numeric';
        options.hour12 = true;
        break;
    }

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }
} 

/**
 * @deprecated we no longer use this pipe
 */