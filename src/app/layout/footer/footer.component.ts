import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4 class="footer-title">WeatherPro</h4>
          <p class="footer-description">
            Get accurate weather forecasts for any location worldwide with our powerful and intuitive weather app.
          </p>
          <div class="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Twitter">
              <mat-icon>twitter</mat-icon>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook">
              <mat-icon>facebook</mat-icon>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
              <mat-icon>photo_camera</mat-icon>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="GitHub">
              <mat-icon>code</mat-icon>
            </a>
          </div>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-title">Quick Links</h4>
          <nav class="footer-nav">
            <a href="/" class="footer-link">Home</a>
            <a href="/forecast" class="footer-link">Forecast</a>
            <a href="/map" class="footer-link">Weather Map</a>
            <a href="/alerts" class="footer-link">Alerts</a>
          </nav>
        </div>
        
        <div class="footer-section">
          <h4 class="footer-title">Resources</h4>
          <nav class="footer-nav">
            <a href="/about" class="footer-link">About Us</a>
            <a href="/privacy" class="footer-link">Privacy Policy</a>
            <a href="/terms" class="footer-link">Terms of Service</a>
            <a href="/contact" class="footer-link">Contact</a>
          </nav>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} WeatherPro. All rights reserved.
        </div>
        <div class="powered-by">
          Powered by 
          <a 
            href="https://openweathermap.org" 
            target="_blank" 
            rel="noopener noreferrer"
            class="powered-link"
          >
            OpenWeather
          </a>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--surface-light);
      color: var(--text-secondary);
      border-top: 1px solid var(--border-light);
      padding: 2.5rem 1.5rem 1.5rem;
      margin-top: 3rem;
    }

    :host-context(.dark-theme) .footer {
      background-color: var(--surface-dark);
      color: var(--text-secondary-dark);
      border-top: 1px solid var(--border-dark);
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }

    .footer-section {
      display: flex;
      flex-direction: column;
    }

    .footer-title {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 1.125rem;
      margin-top: 0;
      margin-bottom: 1rem;
    }

    :host-context(.dark-theme) .footer-title {
      color: var(--text-primary-dark);
    }

    .footer-description {
      font-size: 0.95rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .social-links {
      display: flex;
      gap: 1rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--radius-full);
      background-color: var(--card-light);
      border: 1px solid var(--border-light);
      color: var(--primary-color);
      transition: all 0.2s ease;
    }

    .social-link:hover {
      background-color: var(--primary-color);
      color: white;
      transform: translateY(-3px);
    }

    :host-context(.dark-theme) .social-link {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
      color: var(--primary-light);
    }

    :host-context(.dark-theme) .social-link:hover {
      background-color: var(--primary-light);
      color: var(--background-dark);
    }

    .footer-nav {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .footer-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.95rem;
      transition: color 0.2s ease;
    }

    .footer-link:hover {
      color: var(--primary-color);
    }

    :host-context(.dark-theme) .footer-link {
      color: var(--text-secondary-dark);
    }

    :host-context(.dark-theme) .footer-link:hover {
      color: var(--primary-light);
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-light);
      font-size: 0.875rem;
    }

    :host-context(.dark-theme) .footer-bottom {
      border-top-color: var(--border-dark);
    }

    .powered-link {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .powered-link:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    :host-context(.dark-theme) .powered-link {
      color: var(--primary-light);
    }

    :host-context(.dark-theme) .powered-link:hover {
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .footer-bottom {
        flex-direction: column;
        gap: 0.75rem;
        text-align: center;
      }
    }

    @media (min-width: 769px) and (max-width: 1024px) {
      .footer-content {
        grid-template-columns: 1.5fr 1fr 1fr;
        gap: 1.5rem;
      }
    }
  `],
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
} 