import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  template: `
    <div class="not-found-container">
      <div class="content">
        <h1>404</h1>
        <h2>Page Not Found</h2>
        <p>Oops! The page you're looking for seems to have drifted away like a cloud in the wind.</p>
        
        <div class="actions">
          <button mat-raised-button color="primary" routerLink="/">
            <mat-icon>home</mat-icon>
            Go Home
          </button>
          <button mat-stroked-button routerLink="/alerts">
            <mat-icon>notifications</mat-icon>
            View Alerts
          </button>
        </div>

        <div class="weather-animation">
          <div class="cloud"></div>
          <div class="sun"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      padding: 20px;
    }

    .content {
      text-align: center;
      max-width: 600px;
      padding: 40px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    h1 {
      font-size: 120px;
      margin: 0;
      color: #1976d2;
      line-height: 1;
    }

    h2 {
      font-size: 32px;
      margin: 0 0 16px;
      color: #333;
    }

    p {
      font-size: 18px;
      color: #666;
      margin-bottom: 32px;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 40px;
    }

    .actions button {
      padding: 8px 24px;
    }

    .actions mat-icon {
      margin-right: 8px;
    }

    .weather-animation {
      position: relative;
      height: 100px;
      margin-top: 40px;
    }

    .cloud {
      position: absolute;
      width: 100px;
      height: 40px;
      background: #fff;
      border-radius: 20px;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      animation: float 3s ease-in-out infinite;
    }

    .cloud:before,
    .cloud:after {
      content: '';
      position: absolute;
      background: #fff;
      border-radius: 50%;
    }

    .cloud:before {
      width: 50px;
      height: 50px;
      top: -20px;
      left: 15px;
    }

    .cloud:after {
      width: 30px;
      height: 30px;
      top: -10px;
      right: 15px;
    }

    .sun {
      position: absolute;
      width: 60px;
      height: 60px;
      background: #ffd700;
      border-radius: 50%;
      right: 20%;
      top: 20px;
      animation: pulse 2s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translate(-50%, -50%); }
      50% { transform: translate(-50%, -60%); }
    }

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    @media (max-width: 600px) {
      .content {
        padding: 20px;
      }

      h1 {
        font-size: 80px;
      }

      h2 {
        font-size: 24px;
      }

      p {
        font-size: 16px;
      }

      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class NotFoundComponent {} 