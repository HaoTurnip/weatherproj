import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  template: `
    <footer class="w-full py-4 px-4 bg-gray-100 dark:bg-gray-800 text-center text-gray-600 dark:text-gray-300 text-sm border-t border-gray-200 dark:border-gray-700">
      <span>&copy; {{ year }} WeatherApp. All rights reserved.</span>
      <span class="ml-2">|</span>
      <a href="https://openweathermap.org/" target="_blank" rel="noopener" class="underline hover:text-blue-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400">Powered by OpenWeather</a>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {
  year = new Date().getFullYear();
} 