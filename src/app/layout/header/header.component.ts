import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <mat-toolbar color="primary" class="flex justify-between">
      <div class="flex items-center">
        <span class="text-xl font-bold mr-4">Weather App</span>
        <nav class="hidden md:flex space-x-4">
          <a mat-button routerLink="/" routerLinkActive="mat-accent">Home</a>
          <a mat-button routerLink="/forecast" routerLinkActive="mat-accent">Forecast</a>
          <a mat-button routerLink="/map" routerLinkActive="mat-accent">Map</a>
          <a mat-button routerLink="/alerts" routerLinkActive="mat-accent">Alerts</a>
          <a mat-button routerLink="/settings" routerLinkActive="mat-accent">Settings</a>
        </nav>
      </div>
      <div class="flex items-center space-x-4">
        <button mat-icon-button (click)="toggleDarkMode()">
          <mat-icon>{{ isDarkMode ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
        
        @if (isAuthenticated$ | async) {
          <button mat-icon-button [matMenuTriggerFor]="userMenu">
            <mat-icon>account_circle</mat-icon>
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>
        } @else {
          <a mat-button routerLink="/login">Login</a>
        }
      </div>
    </mat-toolbar>
  `,
  styles: [],
})
export class HeaderComponent {
  isDarkMode = false;
  isAuthenticated$;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark');
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.notificationService.showSuccess('Successfully logged out!');
      },
      error: (error) => {
        this.notificationService.showError(error.message);
      }
    });
  }
} 