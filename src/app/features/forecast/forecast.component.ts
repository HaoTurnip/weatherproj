import { Component, OnInit } from '@angular/core';
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
  template: `
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
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 20px rgba(30, 64, 175, 0.10);
      transition: transform 0.2s, box-shadow 0.3s, background 0.3s, color 0.3s;
      color: #222;
      font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
    }

    .forecast-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 8px 24px rgba(30, 64, 175, 0.16);
    }

    .dark-theme .forecast-card {
      background: #232a34;
      color: #f4f6fb;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }

    .forecast-info {
      text-align: center;
      padding: 20px 8px 8px 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .forecast-info img {
      width: 64px;
      height: 64px;
      margin: 12px 0 8px 0;
    }

    .temperature {
      display: flex;
      justify-content: center;
      gap: 18px;
      margin: 10px 0 8px 0;
    }

    .max {
      font-size: 2rem;
      font-weight: 700;
      color: #e67e22;
      letter-spacing: 0.5px;
    }

    .min {
      font-size: 1.3rem;
      color: #1976d2;
      font-weight: 600;
      align-self: flex-end;
    }

    .dark-theme .max {
      color: #ffb74d;
    }
    .dark-theme .min {
      color: #90caf9;
    }

    .details {
      display: flex;
      flex-direction: column;
      gap: 6px;
      color: #666;
      font-size: 1.05rem;
      margin-top: 4px;
    }
    .dark-theme .details {
      color: #cfd8dc;
    }

    .details div {
      display: flex;
      align-items: center;
      gap: 0.5em;
      font-weight: 500;
    }

    .error-container {
      text-align: center;
      padding: 48px;
      background: #f5f5f5;
      border-radius: 12px;
      color: #222;
    }
    .dark-theme .error-container {
      background: #232a34;
      color: #f4f6fb;
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #f44336;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .forecast-grid {
        grid-template-columns: 1fr;
      }
      .forecast-container {
        padding: 12px;
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

    this.weatherService.getForecast(this.cityName).subscribe({
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