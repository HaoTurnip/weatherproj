import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temperature',
  standalone: true
})
export class TemperaturePipe implements PipeTransform {
  transform(value: number, unit: 'celsius' | 'fahrenheit' = 'celsius'): string {
    console.log(`TemperaturePipe transforming ${value} to ${unit}`);
    if (unit === 'fahrenheit') {
      const fahrenheit = (value * 9/5) + 32;
      return `${fahrenheit.toFixed(1)}°F`;
    }
    return `${value.toFixed(1)}°C`;
  }
} 