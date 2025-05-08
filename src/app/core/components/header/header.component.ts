import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AsyncPipe, NgIf } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    AsyncPipe,
    NgIf
  ],
  template: `
    <mat-toolbar class="header" [class.dark]="(isDarkMode$ | async)">
      <div class="header-content">
        <a routerLink="/" class="logo">
          <span class="logo-text">Weather App</span>
        </a>
        
        <div class="nav-links">
          <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            Home
          </a>
          <a mat-button routerLink="/forecast" routerLinkActive="active">
            Forecast
          </a>
          <a mat-button routerLink="/map" routerLinkActive="active">
            Map
          </a>
          <a mat-button routerLink="/alerts" routerLinkActive="active">
            Alerts
          </a>
          <a mat-button routerLink="/settings" routerLinkActive="active">
            Settings
          </a>
        </div>

        <div class="header-actions">
          <button mat-icon-button (click)="themeService.toggleTheme()" aria-label="Toggle theme">
            <mat-icon>{{ (isDarkMode$ | async) ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>
          
          <button mat-button [matMenuTriggerFor]="userMenu" *ngIf="isAuthenticated$ | async">
            <mat-icon>account_circle</mat-icon>
            Account
          </button>
          <mat-menu #userMenu="matMenu">
            <button mat-menu-item routerLink="/profile">
              <mat-icon>person</mat-icon>
              <span>Profile</span>
            </button>
            <button mat-menu-item routerLink="/settings">
              <mat-icon>settings</mat-icon>
              <span>Settings</span>
            </button>
            <button mat-menu-item (click)="logout()">
              <mat-icon>exit_to_app</mat-icon>
              <span>Logout</span>
            </button>
          </mat-menu>

          <button mat-raised-button color="primary" routerLink="/login" *ngIf="!(isAuthenticated$ | async)">
            Sign In
          </button>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .header {
      background-color: var(--background-light);
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-light);
      transition: all 0.3s ease;
    }

    .header.dark {
      background-color: var(--background-dark);
      color: #ffffff;
      border-bottom-color: var(--border-dark);
    }

    .header-content {
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }

    .logo {
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .logo-text {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary-blue);
    }

    .nav-links {
      display: flex;
      gap: 8px;
    }

    .nav-links a {
      color: var(--text-primary);
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .nav-links a:hover {
      background-color: var(--light-blue);
    }

    .nav-links a.active {
      color: var(--primary-blue);
      background-color: var(--light-blue);
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .dark .nav-links a {
      color: #ffffff;
    }

    .dark .nav-links a:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .dark .nav-links a.active {
      background-color: rgba(255, 255, 255, 0.1);
    }

    @media (max-width: 768px) {
      .header-content {
        padding: 0 12px;
      }

      .nav-links {
        display: none;
      }

      .logo-text {
        font-size: 20px;
      }
    }
  `]
})
export class HeaderComponent {
  isDarkMode$ = this.themeService.isDarkMode$;
  isAuthenticated$ = this.authService.currentUser$.pipe(
    map(user => !!user)
  );

  constructor(
    public themeService: ThemeService,
    private authService: AuthService
  ) {}

  logout() {
    this.authService.logout();
  }
} 