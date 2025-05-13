import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'hour12', standalone: true })
export class Hour12Pipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    // Convert '2025-05-11 13:00' to '2025-05-11T13:00'
    const date = new Date(value.replace(' ', 'T'));
    if (isNaN(date.getTime())) return value;
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  }
} 

/**
 * @deprecated we no longer use this pipe
 */
