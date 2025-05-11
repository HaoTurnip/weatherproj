import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WeatherService } from '../../core/services/weather.service';
import { ForecastData } from '../../core/models/weather.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { CityService } from '../../services/city.service';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SkeletonLoaderComponent
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      /* Global styles for forecast in dark mode */
      .dark-theme .forecast-container {
        color: var(--text-primary-dark);
      }
      
      .dark-theme .forecast-card {
        background-color: var(--card-dark) ;
        border: 1px solid var(--border-dark) ;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25) ;
      }
      
      .dark-theme .forecast-card:hover {
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35) ;
        transform: translateY(-8px);
      }
      
      .dark-theme .forecast-card .mat-mdc-card-title {
        color: var(--text-primary-dark) ;
      }
      
      .dark-theme .forecast-card .mat-mdc-card-subtitle {
        color: var(--text-secondary-dark) ;
      }
      
      .dark-theme .forecast-container .error-container {
        background-color: var(--card-dark) ;
        border: 1px solid var(--border-dark) ;
        color: var(--text-primary-dark) ;
      }
      
      .dark-theme .forecast-container .error-container h2 {
        color: var(--text-primary-dark) ;
      }
      
      .dark-theme .forecast-container .error-container p {
        color: var(--text-secondary-dark) ;
      }
      
      /* Fix for the condition text in dark mode */
      .dark-theme .details div {
        background-color: rgba(51, 65, 85, 0.6) ;
        color: var(--text-primary-dark) ;
        border: 1px solid var(--border-dark) ;
      }
      
      .dark-theme .details div:hover {
        background-color: rgba(51, 65, 85, 0.8) ;
      }
    </style>
    <div class="forecast-container">
      @if (loading) {
        <div class="skeleton-container">
          <app-skeleton-loader [lines]="[100, 80, 60]" />
        </div>
      } @else if (error) {
        <div class="error-container">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h2>Error Loading Forecast</h2>
          <p>{{ error }}</p>
          <button mat-raised-button color="primary" (click)="loadForecast()">
            Retry
          </button>
        </div>
      } @else {
        <div class="forecast-grid">
          @if (forecast?.daily) {
            @for (day of forecast!.daily; track day.day) {
              <mat-card class="forecast-card">
                <mat-card-header>
                  <mat-card-title>{{ day.day }}</mat-card-title>
                  <!-- You may want to format the date differently -->
                </mat-card-header>
                <mat-card-content>
                  <div class="forecast-info">
                    <img [src]="day.icon" [alt]="day.condition">
                    <div class="temperature">
                      <span class="max">{{ day.high }}°C</span>
                      <span class="min">{{ day.low }}°C</span>
                    </div>
                    <div class="details">
                      <div>Condition: {{ day.condition }}</div>
                    </div>
                  </div>
                </mat-card-content>
              </mat-card>
            }
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .forecast-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .forecast-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 28px;
      margin-top: 24px;
    }

    .forecast-card {
      background: var(--card-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      color: var(--text-primary);
      font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
      border: 1px solid var(--border-light);
      overflow: hidden;
    }

    .forecast-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
    }

    :host-context(.dark-theme) .forecast-card {
      background: var(--card-dark);
      color: var(--text-primary-dark);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      border-color: var(--border-dark);
    }

    :host-context(.dark-theme) .forecast-card:hover {
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
    }

    .forecast-card .mat-mdc-card-header {
      padding: 16px 16px 0;
    }

    .forecast-card .mat-mdc-card-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 4px;
      color: var(--text-primary);
    }

    :host-context(.dark-theme) .forecast-card .mat-mdc-card-title {
      color: var(--text-primary-dark);
    }

    .forecast-info {
      text-align: center;
      padding: 20px 16px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .forecast-info img {
      width: 80px;
      height: 80px;
      margin: 0;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      transition: transform 0.3s ease;
    }

    .forecast-card:hover .forecast-info img {
      transform: scale(1.1);
    }

    .temperature {
      display: flex;
      justify-content: center;
      gap: 24px;
      margin: 8px 0;
      align-items: baseline;
    }

    .max {
      font-size: 2.2rem;
      font-weight: 700;
      color: var(--warning-color);
      letter-spacing: 0.5px;
      line-height: 1;
    }

    .min {
      font-size: 1.4rem;
      color: var(--primary-color);
      font-weight: 500;
    }

    :host-context(.dark-theme) .max {
      color: var(--warning-light);
    }
    
    :host-context(.dark-theme) .min {
      color: var(--primary-light);
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      color: var(--text-secondary);
      font-size: 1.1rem;
      margin-top: 8px;
      width: 100%;
    }
    
    :host-context(.dark-theme) .details {
      color: var(--text-secondary-dark);
    }

    .details div {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-weight: 500;
      padding: 8px;
      border-radius: var(--radius-md);
      background-color: var(--card-hover-light);
      transition: background-color 0.2s ease;
      color: var(--text-primary);
      border: 1px solid var(--border-light);
    }
    
    :host-context(.dark-theme) .details div {
      background-color: rgba(51, 65, 85, 0.6);
      color: var(--text-primary-dark);
      border-color: var(--border-dark);
    }
    
    .details div:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
    
    :host-context(.dark-theme) .details div:hover {
      background-color: rgba(51, 65, 85, 0.8);
    }

    .error-container {
      text-align: center;
      padding: 48px;
      background: var(--card-light);
      border-radius: var(--radius-xl);
      color: var(--text-primary);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }
    
    :host-context(.dark-theme) .error-container {
      background: var(--card-dark);
      color: var(--text-primary-dark);
      border-color: var(--border-dark);
    }

    .error-container h2 {
      font-size: 1.75rem;
      font-weight: 600;
      margin: 0;
      color: var(--text-primary);
    }
    
    :host-context(.dark-theme) .error-container h2 {
      color: var(--text-primary-dark);
    }
    
    .error-container p {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin: 0 0 16px;
    }
    
    :host-context(.dark-theme) .error-container p {
      color: var(--text-secondary-dark);
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--error-color);
      margin-bottom: 8px;
    }
    
    :host-context(.dark-theme) .error-icon {
      color: var(--error-light);
    }
    
    .error-container button {
      background-color: var(--primary-color);
      color: white;
      transition: all 0.2s ease;
    }
    
    .error-container button:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    :host-context(.dark-theme) .error-container button {
      background-color: var(--primary-light);
      color: var(--background-dark);
    }
    
    :host-context(.dark-theme) .error-container button:hover {
      background-color: var(--primary-color);
      box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
    }

    .skeleton-container {
      width: 100%;
      padding: 24px;
    }

    @media (max-width: 768px) {
      .forecast-grid {
        grid-template-columns: 1fr;
      }
      .forecast-container {
        padding: 16px;
      }
      
      .forecast-card .mat-mdc-card-title {
        font-size: 1.3rem;
      }
      
      .max {
        font-size: 1.8rem;
      }
      
      .min {
        font-size: 1.2rem;
      }
    }
  `]
})
export class ForecastComponent implements OnInit {
  forecast: ForecastData | null = null;
  loading = true;
  error: string | null = null;
  cityName = 'New York';

  constructor(private weatherService: WeatherService, private cityService: CityService) {}

  ngOnInit() {
    this.cityService.city$.subscribe(city => {
      this.cityName = city;
      this.loadForecast();
    });
  }

  loadForecast() {
    this.loading = true;
    this.error = null;

    this.weatherService.getForecast(this.cityName, 5).subscribe({
      next: (data: ForecastData) => {
        this.forecast = data;
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading forecast:', error);
        this.error = 'Failed to load forecast data. Please try again.';
        this.loading = false;
      }
    });
  }
} 