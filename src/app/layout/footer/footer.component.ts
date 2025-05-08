import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  template: `
    <footer class="mt-auto">
      <mat-toolbar class="flex justify-center text-sm text-gray-600 dark:text-gray-400">
        <div class="text-center">
          <p>&copy; {{ currentYear }} Weather App. All rights reserved.</p>
          <p class="mt-1">
            Powered by 
            <a 
              href="https://openweathermap.org" 
              target="_blank" 
              rel="noopener noreferrer"
              class="text-blue-600 dark:text-blue-400 hover:underline"
            >
              OpenWeather
            </a>
          </p>
        </div>
      </mat-toolbar>
    </footer>
  `,
  styles: [],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 