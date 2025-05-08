import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <header class="w-full flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-900 shadow-md">
      <div class="flex items-center gap-2">
        <span class="font-bold text-xl text-blue-600 dark:text-blue-300">WeatherApp</span>
      </div>
      <nav class="flex gap-4">
        <a routerLink="/" routerLinkActive="font-bold underline" class="hover:text-blue-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400">Home</a>
        <a routerLink="/forecast" routerLinkActive="font-bold underline" class="hover:text-blue-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400">Forecast</a>
        <a routerLink="/map" routerLinkActive="font-bold underline" class="hover:text-blue-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400">Map</a>
        <a routerLink="/alerts" routerLinkActive="font-bold underline" class="hover:text-blue-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400">Alerts</a>
        <a routerLink="/settings" routerLinkActive="font-bold underline" class="hover:text-blue-500 focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400">Settings</a>
      </nav>
      <button (click)="toggleDarkMode()" class="ml-4 p-2 rounded focus-visible:outline focus-visible:ring-2 focus-visible:ring-blue-400" [attr.aria-label]="isDark ? 'Switch to light mode' : 'Switch to dark mode'">
        <span *ngIf="!isDark">🌙</span>
        <span *ngIf="isDark">☀️</span>
      </button>
    </header>
  `,
  styles: [],
})
export class HeaderComponent {
  isDark = false;

  constructor() {
    this.isDark = document.documentElement.classList.contains('dark');
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
} 