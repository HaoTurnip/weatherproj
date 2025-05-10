import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatIconModule
  ],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Weather App</h3>
          <p>Your trusted source for accurate weather information and forecasts.</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <a routerLink="/">Home</a>
          <a routerLink="/forecast">Forecast</a>
          <a routerLink="/map">Map</a>
          <a routerLink="/alerts">Alerts</a>
        </div>
        
        <div class="footer-section">
          <h4>Connect With Us</h4>
          <div class="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <mat-icon>facebook</mat-icon>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <mat-icon>twitter</mat-icon>
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <mat-icon>instagram</mat-icon>
            </a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2024 Weather App. All rights reserved.</p>
        <div class="footer-links">
          <a routerLink="/privacy">Privacy Policy</a>
          <a routerLink="/terms">Terms of Service</a>
          <a routerLink="/contact">Contact Us</a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #f5f5f5;
      padding: 40px 0 20px;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
    }

    .footer-section h3 {
      color: #333;
      margin-bottom: 16px;
      font-size: 1.5rem;
    }

    .footer-section h4 {
      color: #333;
      margin-bottom: 16px;
      font-size: 1.2rem;
    }

    .footer-section p {
      color: #666;
      line-height: 1.6;
    }

    .footer-section a {
      display: block;
      color: #666;
      text-decoration: none;
      margin-bottom: 8px;
      transition: color 0.2s;
    }

    .footer-section a:hover {
      color: #1976d2;
    }

    .social-links {
      display: flex;
      gap: 16px;
    }

    .social-links a {
      color: #666;
      transition: color 0.2s;
    }

    .social-links a:hover {
      color: #1976d2;
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 40px auto 0;
      padding: 20px;
      border-top: 1px solid #ddd;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .footer-bottom p {
      color: #666;
      margin: 0;
    }

    .footer-links {
      display: flex;
      gap: 24px;
    }

    .footer-links a {
      color: #666;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: #1976d2;
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 32px;
      }

      .footer-bottom {
        flex-direction: column;
        text-align: center;
      }

      .footer-links {
        justify-content: center;
      }
    }

    /* Dark mode styles */
    :host-context(.dark-theme) .footer {
      background-color: #232a34;
    }
    :host-context(.dark-theme) .footer-section h3,
    :host-context(.dark-theme) .footer-section h4 {
      color: #f4f6fb;
    }
    :host-context(.dark-theme) .footer-section p,
    :host-context(.dark-theme) .footer-section a,
    :host-context(.dark-theme) .footer-bottom p,
    :host-context(.dark-theme) .footer-links a,
    :host-context(.dark-theme) .social-links a {
      color: #b0bec5;
    }
    :host-context(.dark-theme) .footer-section a:hover,
    :host-context(.dark-theme) .footer-links a:hover,
    :host-context(.dark-theme) .social-links a:hover {
      color: #90caf9;
    }
    :host-context(.dark-theme) .footer-bottom {
      border-top: 1px solid #333a4d;
    }
  `]
})
export class FooterComponent {} 