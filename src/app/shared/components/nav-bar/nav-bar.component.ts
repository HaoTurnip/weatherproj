import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [RouterModule, MatIconModule],
  template: `
    <nav class="main-nav">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
        <mat-icon>home</mat-icon>
        <span>Home</span>
      </a>
      <a routerLink="/forecast" routerLinkActive="active">
        <mat-icon>calendar_today</mat-icon>
        <span>Forecast</span>
      </a>
      <a routerLink="/map" routerLinkActive="active">
        <mat-icon>map</mat-icon>
        <span>Map</span>
      </a>
      <a routerLink="/alerts" routerLinkActive="active">
        <mat-icon>notifications</mat-icon>
        <span>Alerts</span>
      </a>
      <a routerLink="/settings" routerLinkActive="active">
        <mat-icon>settings</mat-icon>
        <span>Settings</span>
      </a>
    </nav>
  `,
  styles: [`
    .main-nav {
      display: flex;
      justify-content: center;
      gap: 32px;
      padding: 8px 0 12px 0;
      background: #f8fafc;
      border-bottom: 2px solid #e3e8f0;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.04);
      z-index: 999;
      position: sticky;
      top: 64px; /* Adjust if your header is a different height */
    }
    .main-nav a {
      display: flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      color: #1976d2;
      font-weight: 500;
      font-size: 1.1rem;
      padding: 10px 22px;
      border-radius: 999px;
      transition: background 0.2s, color 0.2s;
    }
    .main-nav a.active, .main-nav a:hover {
      background: #e3e8f0;
      color: #0d47a1;
    }
    :host-context(.dark-theme) .main-nav {
      background: #232a34;
      border-bottom: 2px solid #333a4d;
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    :host-context(.dark-theme) .main-nav a {
      color: #90caf9;
    }
    :host-context(.dark-theme) .main-nav a.active, :host-context(.dark-theme) .main-nav a:hover {
      background: #333a4d;
      color: #fff;
    }
    @media (max-width: 768px) {
      .main-nav {
        gap: 8px;
        padding: 0 0 4px 0;
        overflow-x: auto;
      }
      .main-nav a {
        font-size: 1rem;
        padding: 6px 10px;
      }
    }
  `]
})
export class NavBarComponent {} 