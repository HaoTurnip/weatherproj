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
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { CityService } from '../../../services/city.service';
import { Observable } from 'rxjs';

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
    MatDividerModule,
    NavBarComponent
  ],
  template: `
    <div class="header-wrapper">
      <mat-toolbar class="header">
        <div class="header-left">
          <a routerLink="/" class="logo">
            <img src="assets/logo.svg" alt="Weather App Logo" class="logo-img">
            <span class="app-name">WeatherPro</span>
          </a>
        </div>

        <div class="search-container">
          <div class="search-field-wrapper">
            <mat-icon class="search-icon">search</mat-icon>
            <input 
              class="search-input" 
              [(ngModel)]="searchQuery" 
              (keyup.enter)="onSearch()" 
              placeholder="Search city..."
              aria-label="Search city"
            >
            <button 
              *ngIf="searchQuery" 
              class="clear-button" 
              (click)="clearSearch()" 
              aria-label="Clear search"
            >
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>

        <div class="header-right">
          <ng-container *ngIf="user$ | async as user; else loggedOut">
            <button type="button" class="theme-toggle" (click)="toggleTheme()" aria-label="Toggle theme">
              <mat-icon class="toggle-icon">{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
            <button type="button" class="user-button" [matMenuTriggerFor]="userMenu" aria-label="User menu">
              <mat-icon class="user-icon">account_circle</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu" class="user-menu">
              <div class="menu-header">
                <mat-icon class="user-avatar">account_circle</mat-icon>
                <div class="user-info">
                  <div class="user-name">{{ user.displayName || 'User Name' }}</div>
                  <div class="user-email">{{ user.email }}</div>
                </div>
              </div>
              <mat-divider></mat-divider>
              <button mat-menu-item routerLink="/settings">
                <mat-icon>settings</mat-icon>
                <span>Settings</span>
              </button>
              <button mat-menu-item routerLink="/profile">
                <mat-icon>person</mat-icon>
                <span>Profile</span>
              </button>
              <mat-divider></mat-divider>
              <button mat-menu-item (click)="authService.signOut()">
                <mat-icon>logout</mat-icon>
                <span>Logout</span>
              </button>
            </mat-menu>
          </ng-container>
          <ng-template #loggedOut>
            <button type="button" class="theme-toggle" (click)="toggleTheme()" aria-label="Toggle theme">
              <mat-icon class="toggle-icon">{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
            </button>
            <button mat-button color="primary" routerLink="/login">Login</button>
            <button mat-button color="accent" routerLink="/signup">Sign Up</button>
          </ng-template>
        </div>
      </mat-toolbar>
    </div>
    
    <app-nav-bar></app-nav-bar>

    <ng-template #loggedOut>
      <div class="header-right">
        <button type="button" class="theme-toggle" (click)="toggleTheme()" aria-label="Toggle theme">
          <mat-icon class="toggle-icon">{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>
        <button mat-button color="primary" routerLink="/login">Login</button>
        <button mat-button color="accent" routerLink="/signup">Sign Up</button>
      </div>
    </ng-template>
  `,
  styles: [`
    .header-wrapper {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .header {
      background: rgba(255, 255, 255, 0.8);
      color: var(--text-primary);
      height: 72px;
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: var(--shadow-sm);
      border-bottom: 1px solid rgba(229, 231, 235, 0.5);
      transition: all 0.3s ease;
    }

    :host-context(.dark-theme) .header {
      background: rgba(30, 41, 59, 0.8);
      color: var(--text-primary-dark);
      border-bottom: 1px solid rgba(51, 65, 85, 0.5);
    }

    .header-left {
      display: flex;
      align-items: center;
      width: 175px;
    }

    .logo {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: inherit;
    }

    .logo-img {
      height: 32px;
      margin-right: 0.75rem;
    }

    .app-name {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    :host-context(.dark-theme) .app-name {
      background: linear-gradient(90deg, var(--primary-light), var(--secondary-color));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
    }

    .search-container {
      flex: 0 1 350px;
      margin: 0 auto;
      padding: 0;
      display: flex;
      justify-content: center;
      position: absolute;
      left: 50%;
      transform: translateX(-54%);
    }

    .search-field-wrapper {
      display: flex;
      align-items: center;
      background: var(--card-light);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      padding: 0.5rem 0.875rem;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
      margin: 0.75rem 0;
      width: 100%;
    }

    .search-field-wrapper:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }

    :host-context(.dark-theme) .search-field-wrapper {
      background: var(--card-dark);
      border-color: var(--border-dark);
    }

    :host-context(.dark-theme) .search-field-wrapper:focus-within {
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }

    .search-icon {
      color: var(--text-tertiary);
      margin-right: 0.5rem;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.9rem;
      color: var(--text-primary);
      padding: 0.4rem 0;
      font-family: inherit;
      width: 100%;
    }

    :host-context(.dark-theme) .search-input {
      color: var(--text-primary-dark);
    }

    .search-input::placeholder {
      color: var(--text-tertiary);
    }

    :host-context(.dark-theme) .search-input::placeholder {
      color: var(--text-tertiary-dark);
    }

    .clear-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      margin-left: 0.5rem;
      flex-shrink: 0;
    }

    .clear-button mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      color: var(--text-tertiary);
      transition: color 0.2s ease;
    }

    .clear-button:hover mat-icon {
      color: var(--text-primary);
    }

    :host-context(.dark-theme) .clear-button:hover mat-icon {
      color: var(--text-primary-dark);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 175px;
      justify-content: flex-end;
    }

    .theme-toggle, .user-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--card-light);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      width: 40px;
      height: 40px;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
      padding: 0;
      cursor: pointer;
    }

    :host-context(.dark-theme) .theme-toggle, 
    :host-context(.dark-theme) .user-button {
      background: var(--card-dark);
      border-color: var(--border-dark);
    }

    .theme-toggle:hover, .user-button:hover {
      background: var(--card-hover-light);
      transform: translateY(-2px);
    }

    :host-context(.dark-theme) .theme-toggle:hover, 
    :host-context(.dark-theme) .user-button:hover {
      background: var(--card-hover-dark);
    }

    .toggle-icon, .user-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    :host-context(.dark-theme) .toggle-icon, 
    :host-context(.dark-theme) .user-icon {
      color: var(--primary-light);
    }

    /* User menu styles */
    ::ng-deep .user-menu {
      padding: 0 !important;
      overflow: hidden !important;
      border-radius: var(--radius-lg) !important;
      margin-top: 8px !important;
    }

    ::ng-deep .user-menu .mat-mdc-menu-content {
      padding: 0 !important;
    }

    ::ng-deep .user-menu .menu-header {
      display: flex;
      align-items: center;
      padding: 1rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    }

    ::ng-deep .user-menu .user-avatar {
      color: white;
      font-size: 2.5rem;
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 1rem;
    }

    ::ng-deep .user-menu .user-info {
      color: white;
    }

    ::ng-deep .user-menu .user-name {
      font-weight: 600;
      font-size: 1rem;
    }

    ::ng-deep .user-menu .user-email {
      font-size: 0.85rem;
      opacity: 0.8;
    }

    ::ng-deep .user-menu .mat-mdc-menu-item {
      font-size: 0.95rem;
      padding: 0.75rem 1rem;
    }

    ::ng-deep .user-menu .mat-mdc-menu-item .mat-icon {
      margin-right: 0.75rem;
    }

    @media (max-width: 768px) {
      .header {
        padding: 0 1rem;
      }

      .app-name {
        display: none;
      }

      .search-container {
        margin: 0 1rem;
      }
    }

    @media (max-width: 550px) {
      .search-container {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() searchCity = new EventEmitter<string>();
  searchQuery = '';
  isDarkTheme = false;
  user$: Observable<any>;

  constructor(public authService: AuthService, private cityService: CityService) {
    this.isDarkTheme = document.body.classList.contains('dark-theme');
    this.user$ = this.authService.user$;
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.cityService.setCity(this.searchQuery.trim());
      this.searchCity.emit(this.searchQuery.trim());
    }
  }

  clearSearch() {
    this.searchQuery = '';
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.body.classList.toggle('dark-theme');
  }
} 