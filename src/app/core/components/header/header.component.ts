import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar class="bg-white dark:bg-gray-800 shadow-md">
      <div class="container mx-auto px-4 flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <a routerLink="/" class="text-xl font-bold text-gray-900 dark:text-white">
            Weather App
          </a>
          <nav class="hidden md:flex space-x-4">
            <a routerLink="/" routerLinkActive="text-blue-600" 
               class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </a>
            <a routerLink="/forecast" routerLinkActive="text-blue-600"
               class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Forecast
            </a>
            <a routerLink="/map" routerLinkActive="text-blue-600"
               class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Map
            </a>
            <a routerLink="/alerts" routerLinkActive="text-blue-600"
               class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Alerts
            </a>
          </nav>
        </div>

        <div class="flex items-center space-x-4">
          <button mat-icon-button (click)="toggleTheme()" class="text-gray-600 dark:text-gray-300">
            <mat-icon>{{ (isDarkMode$ | async) ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          @if (isAuthenticated$ | async) {
            <button mat-icon-button [matMenuTriggerFor]="menu" class="text-gray-600 dark:text-gray-300">
              <mat-icon>account_circle</mat-icon>
            </button>
            <mat-menu #menu="matMenu">
              <button mat-menu-item routerLink="/settings">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <button mat-menu-item (click)="logout()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          } @else {
            <a mat-button routerLink="/login" class="text-blue-600 dark:text-blue-400">
              Login
            </a>
          }
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: []
})
export class HeaderComponent implements OnInit {
  isAuthenticated$!: Observable<boolean>;
  isDarkMode$!: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.isAuthenticated$ = this.authService.isAuthenticated();
    this.isDarkMode$ = this.themeService.isDarkMode$;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout().subscribe();
  }
} 