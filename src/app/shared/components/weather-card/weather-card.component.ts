import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WeatherData } from '../../../core/models/weather.model';

@Component({
  selector: 'app-weather-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <mat-card class="weather-card">
      <mat-card-header>
        <mat-card-title>{{ weather.cityName || 'Current Weather' }}</mat-card-title>
        <mat-card-subtitle>{{ weather.condition }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <div class="weather-main">
          <img [src]="weather.icon" [alt]="weather.condition" class="weather-icon">
          <div class="temperature">{{ weather.temperature }}°C</div>
        </div>

        <div class="weather-details">
          <div class="detail-item">
            <mat-icon>water_drop</mat-icon>
            <span>Humidity: {{ weather.humidity }}%</span>
          </div>
          <div class="detail-item">
            <mat-icon>air</mat-icon>
            <span>Wind: {{ weather.windSpeed }} km/h {{ weather.windDirection }}</span>
          </div>
          <div class="detail-item">
            <mat-icon>opacity</mat-icon>
            <span>Precipitation: {{ weather.precipitation }} mm</span>
          </div>
          <div class="detail-item">
            <mat-icon>wb_sunny</mat-icon>
            <span>UV Index: {{ weather.uvIndex }}</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .weather-card {
      max-width: 400px;
      margin: 1rem;
      border-radius: 16px;
      background: #fff;
      color: #333;
      transition: all 0.3s ease;
    }

    :host-context(.dark-theme) .weather-card {
      background: #232a34;
      color: #f4f6fb;
    }

    mat-card-header {
      padding: 1rem;
    }

    mat-card-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    mat-card-subtitle {
      font-size: 1.1rem;
      color: #666;
    }

    :host-context(.dark-theme) mat-card-subtitle {
      color: #b0bec5;
    }

    .weather-main {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .weather-icon {
      width: 80px;
      height: 80px;
      margin-right: 1rem;
    }

    .temperature {
      font-size: 3rem;
      font-weight: 700;
    }

    .weather-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
      color: #1976d2;
    }

    :host-context(.dark-theme) mat-icon {
      color: #90caf9;
    }

    @media (max-width: 600px) {
      .weather-card {
        margin: 0.5rem;
      }

      .weather-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WeatherCardComponent {
  @Input() weather!: WeatherData;
} 