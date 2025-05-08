import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WeatherService, ForecastData } from '../../core/services/weather.service';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { WeatherConditionPipe } from '../../shared/pipes/weather-condition.pipe';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    TemperaturePipe,
    WeatherConditionPipe
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">5-Day Forecast</h1>
        <button mat-raised-button color="primary" (click)="loadForecast()" [disabled]="loading">
          <mat-icon>refresh</mat-icon>
          Refresh
        </button>
      </div>

      @if (loading) {
        <div class="flex justify-center items-center h-64">
          <mat-spinner class="text-primary"></mat-spinner>
        </div>
      } @else if (error) {
        <div class="error-card" [class.dark]="(isDarkMode$ | async)">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <div class="error-content">
            <strong class="error-title">Error!</strong>
            <span class="error-message">{{ error }}</span>
          </div>
        </div>
      } @else if (forecast) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          @for (day of forecast.forecast.forecastday; track day.date) {
            <mat-card class="weather-card" [class.dark]="(isDarkMode$ | async)">
              <div class="text-center">
                <h3 class="text-lg font-semibold mb-2">
                  {{ day.date | date:'EEE, MMM d' }}
                </h3>
                <img [src]="day.day.condition.icon" [alt]="day.day.condition.text" class="weather-icon">
                <p class="mb-2">
                  {{ day.day.condition.text | weatherCondition }}
                </p>
                <div class="weather-details">
                  <div class="weather-detail-item">
                    <span class="weather-detail-label">High:</span>
                    <span>{{ day.day.maxtemp_f | temperature }}</span>
                  </div>
                  <div class="weather-detail-item">
                    <span class="weather-detail-label">Low:</span>
                    <span>{{ day.day.mintemp_f | temperature }}</span>
                  </div>
                  <div class="weather-detail-item">
                    <span class="weather-detail-label">Rain:</span>
                    <span>{{ day.day.daily_chance_of_rain }}%</span>
                  </div>
                  <div class="weather-detail-item">
                    <span class="weather-detail-label">Humidity:</span>
                    <span>{{ day.day.avghumidity }}%</span>
                  </div>
                  <div class="weather-detail-item">
                    <span class="weather-detail-label">Wind:</span>
                    <span>{{ day.day.maxwind_mph }} mph</span>
                  </div>
                </div>
              </div>
            </mat-card>
          }
        </div>
      } @else {
        <div class="no-data" [class.dark]="(isDarkMode$ | async)">
          <mat-icon class="no-data-icon">cloud_off</mat-icon>
          <h2 class="no-data-title">No Forecast Data</h2>
          <p class="no-data-message">Unable to load forecast data. Please try again.</p>
          <button mat-raised-button color="primary" (click)="loadForecast()" class="mt-4">
            <mat-icon>refresh</mat-icon>
            Retry
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .weather-card {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
      color: white;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .weather-card.dark {
      background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
    }

    .weather-icon {
      width: 64px;
      height: 64px;
      margin: 16px 0;
    }

    .weather-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 16px;
    }

    .weather-detail-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0.1);
      border-radius: 8px;
    }

    .weather-detail-label {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .weather-detail-item span:last-child {
      font-weight: 500;
      margin-top: 4px;
    }

    h1 {
      color: var(--text-primary);
      transition: color 0.3s ease;
    }

    .dark h1 {
      color: white;
    }

    .error-card {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #991b1b;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
    }

    .error-card.dark {
      background: linear-gradient(135deg, #7f1d1d, #991b1b);
      color: #fecaca;
    }

    .error-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .error-title {
      font-weight: 600;
      display: block;
      margin-bottom: 4px;
    }

    .error-message {
      font-size: 0.875rem;
    }

    .no-data {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
      color: white;
      border-radius: 12px;
      padding: 48px 24px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .no-data.dark {
      background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
    }

    .no-data-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.8;
    }

    .no-data-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .no-data-message {
      opacity: 0.8;
    }

    .text-primary {
      color: var(--primary-blue);
    }

    .dark .text-primary {
      color: var(--light-blue);
    }

    button[mat-raised-button] {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class ForecastComponent implements OnInit {
  forecast: ForecastData | null = null;
  loading = false;
  error: string | null = null;
  private weatherService = inject(WeatherService);
  private themeService = inject(ThemeService);
  isDarkMode$ = this.themeService.isDarkMode$;

  ngOnInit() {
    this.loadForecast();
  }

  loadForecast() {
    this.loading = true;
    this.error = null;

    this.weatherService.getForecast('London').subscribe({
      next: (data) => {
        this.forecast = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load forecast data. Please try again later.';
        this.loading = false;
        console.error('Error loading forecast:', err);
      }
    });
  }
} 