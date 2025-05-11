import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  template: `
    <div class="nav-container">
      <nav class="main-nav">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" class="nav-item">
          <mat-icon>home</mat-icon>
          <span>Home</span>
        </a>
        <a routerLink="/forecast" routerLinkActive="active" class="nav-item">
          <mat-icon>calendar_today</mat-icon>
          <span>Forecast</span>
        </a>
        <a routerLink="/map" routerLinkActive="active" class="nav-item">
          <mat-icon>map</mat-icon>
          <span>Map</span>
        </a>
        <a routerLink="/alerts" routerLinkActive="active" class="nav-item">
          <mat-icon>notifications</mat-icon>
          <span>Alerts</span>
        </a>
        <a routerLink="/settings" routerLinkActive="active" class="nav-item">
          <mat-icon>settings</mat-icon>
          <span>Settings</span>
        </a>
        <div class="nav-indicator"></div>
      </nav>
    </div>
  `,
  styles: [`
    .nav-container {
      position: fixed;
      top: 72px;
      left: 0;
      right: 0;
      z-index: 998; /* Just below header */
      width: 100%;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border-light);
      margin-bottom: 0.5rem;
    }

    :host-context(.dark-theme) .nav-container {
      border-bottom: 1px solid var(--border-dark);
    }

    .main-nav {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
      position: relative;
      background: rgba(255, 255, 255, 0.7);
    }

    :host-context(.dark-theme) .main-nav {
      background: rgba(0, 0, 0, 0);
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 0.95rem;
      padding: 0.7rem 1.25rem;
      border-radius: var(--radius-full);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;
    }

    .nav-item mat-icon {
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-secondary);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .nav-item:hover {
      color: var(--primary-color);
      background: rgba(59, 130, 246, 0.1);
    }

    .nav-item:hover mat-icon {
      color: var(--primary-color);
    }

    .nav-item.active {
      color: var(--primary-color);
      background: rgba(59, 130, 246, 0.15);
      font-weight: 600;
    }

    .nav-item.active mat-icon {
      color: var(--primary-color);
    }

    :host-context(.dark-theme) .nav-item {
      color: var(--text-primary-dark);
    }

    :host-context(.dark-theme) .nav-item mat-icon {
      color: var(--text-primary-dark);
    }

    :host-context(.dark-theme) .nav-item:hover {
      color: var(--primary-light);
      background: rgba(96, 165, 250, 0.15);
    }

    :host-context(.dark-theme) .nav-item:hover mat-icon {
      color: var(--primary-light);
    }

    :host-context(.dark-theme) .nav-item.active {
      color: var(--primary-light);
      background: rgba(96, 165, 250, 0.2);
    }

    :host-context(.dark-theme) .nav-item.active mat-icon {
      color: var(--primary-light);
    }

    @media (max-width: 768px) {
      .main-nav {
        justify-content: flex-start;
        overflow-x: auto;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none; /* IE and Edge */
      }

      .main-nav::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Opera */
      }

      .nav-item {
        padding: 0.5rem 0.75rem;
        white-space: nowrap;
      }

      .nav-item span {
        display: none;
      }

      .nav-item mat-icon {
        font-size: 1.35rem;
        width: 1.35rem;
        height: 1.35rem;
        margin: 0;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .nav-item {
        padding: 0.6rem 1rem;
      }
    }
  `]
})
export class NavBarComponent {} 