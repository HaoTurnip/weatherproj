import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CityService } from '../../../services/city.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatMenuModule,
    NavBarComponent
  ],
  template: `
    <mat-toolbar class="header">
      <div class="header-left">
        <a routerLink="/" class="logo">
          <img src="assets/logo.svg" alt="Weather App Logo" class="logo-img">
          <span class="app-name">WeatherPro</span>
        </a>
      </div>

      <div class="search-container">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search City</mat-label>
          <input matInput [(ngModel)]="searchQuery" (keyup.enter)="onSearch()" placeholder="Enter city name">
          <button mat-icon-button matSuffix (click)="onSearch()">
            <mat-icon>search</mat-icon>
          </button>
        </mat-form-field>
      </div>

      <div class="header-right">
        <button mat-icon-button [matMenuTriggerFor]="themeMenu" aria-label="Theme menu">
          <mat-icon>{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
        <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="User menu">
          <mat-icon>account_circle</mat-icon>
        </button>
      </div>
    </mat-toolbar>
    <app-nav-bar></app-nav-bar>

    <!-- Theme Menu -->
    <mat-menu #themeMenu="matMenu">
      <button mat-menu-item (click)="toggleTheme()">
        <mat-icon>{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
        <span>{{ isDarkTheme ? 'Light Mode' : 'Dark Mode' }}</span>
      </button>
    </mat-menu>

    <!-- User Menu -->
    <mat-menu #userMenu="matMenu">
      <button mat-menu-item routerLink="/settings">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </button>
      <button mat-menu-item (click)="authService.signOut()">
        <mat-icon>logout</mat-icon>
        <span>Logout</span>
      </button>
    </mat-menu>
  `,
  styles: [`
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: #fff;
      color: #333;
      padding: 0.5rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: all 0.3s ease;
    }

    :host-context(.dark-theme) .header {
      background: #232a34;
      color: #f4f6fb;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .header-left {
      display: flex;
      align-items: center;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }

    .logo-img {
      height: 32px;
      margin-right: 0.5rem;
    }

    .app-name {
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .search-container {
      flex: 1;
      max-width: 500px;
      margin: 0 2rem;
    }

    .search-field {
      width: 100%;
    }

    :host-context(.dark-theme) .search-field {
      ::ng-deep {
        .mat-form-field-outline {
          color: #333a4d;
        }
        .mat-form-field-label {
          color: #b0bec5;
        }
        .mat-input-element {
          color: #f4f6fb;
        }
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    mat-icon {
      color: #1976d2;
    }

    :host-context(.dark-theme) mat-icon {
      color: #90caf9;
    }

    @media (max-width: 768px) {
      .header {
        padding: 0.5rem;
      }

      .app-name {
        display: none;
      }

      .search-container {
        margin: 0 1rem;
      }
    }

    @media (max-width: 480px) {
      .search-container {
        display: none;
      }
    }

    .main-nav {
      display: flex;
      justify-content: center;
      gap: 24px;
      padding: 8px;
      background: rgba(0, 0, 0, 0.04);
    }
    .main-nav a {
      display: flex;
      align-items: center;
      gap: 4px;
      text-decoration: none;
      color: rgba(0, 0, 0, 0.87);
      padding: 8px 16px;
      border-radius: 4px;
      transition: background-color 0.2s;
      font-weight: 500;
    }
    .main-nav a:hover {
      background: rgba(0, 0, 0, 0.08);
    }
    .main-nav a.active {
      background: rgba(0, 0, 0, 0.12);
    }
    :host-context(.dark-theme) .main-nav {
      background: #232a34;
    }
    :host-context(.dark-theme) .main-nav a {
      color: #f4f6fb;
    }
    :host-context(.dark-theme) .main-nav a.active {
      background: #333a4d;
    }
    @media (max-width: 768px) {
      .main-nav {
        overflow-x: auto;
        justify-content: flex-start;
        padding: 8px 16px;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() searchCity = new EventEmitter<string>();
  searchQuery = '';
  isDarkTheme = false;

  constructor(public authService: AuthService, private cityService: CityService) {
    // Check if dark theme is enabled
    this.isDarkTheme = document.body.classList.contains('dark-theme');
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.cityService.setCity(this.searchQuery.trim());
      this.searchCity.emit(this.searchQuery.trim());
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme');
    // You can also emit an event to notify the app about theme change
  }
} 