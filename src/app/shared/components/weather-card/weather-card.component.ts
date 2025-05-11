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
    <div class="weather-card-container">
      <div class="weather-card">
        <div class="weather-card-header">
          <div class="weather-location">
            <h2 class="city-name">{{ weather.cityName || 'Current Weather' }}</h2>
            <div class="condition-badge" [ngClass]="getConditionClass(weather.condition)">
              {{ weather.condition }}
            </div>
          </div>
          <div class="weather-time">
            <span class="current-time">{{ getCurrentTime() }}</span>
            <span class="current-date">{{ getCurrentDate() }}</span>
          </div>
        </div>
        
        <div class="weather-body">
          <div class="weather-main">
            <img [src]="weather.icon" [alt]="weather.condition" class="weather-icon">
            <div class="temperature-display">
              <span class="temperature-value">{{ weather.temperature }}</span>
              <span class="temperature-unit">°C</span>
            </div>
          </div>
          
          <div class="weather-details">
            <div class="detail-item">
              <mat-icon>water_drop</mat-icon>
              <div class="detail-info">
                <span class="detail-label">Humidity</span>
                <span class="detail-value">{{ weather.humidity }}%</span>
              </div>
            </div>
            
            <div class="detail-item">
              <mat-icon>air</mat-icon>
              <div class="detail-info">
                <span class="detail-label">Wind</span>
                <span class="detail-value">{{ weather.windSpeed }} km/h</span>
              </div>
            </div>
            
            <div class="detail-item">
              <mat-icon>opacity</mat-icon>
              <div class="detail-info">
                <span class="detail-label">Precipitation</span>
                <span class="detail-value">{{ weather.precipitation }} mm</span>
              </div>
            </div>
            
            <div class="detail-item">
              <mat-icon>wb_sunny</mat-icon>
              <div class="detail-info">
                <span class="detail-label">UV Index</span>
                <span class="detail-value">{{ weather.uvIndex }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card-action">
          <button class="view-forecast-btn">
            <span>View Forecast</span>
            <mat-icon>arrow_forward</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .weather-card-container {
      width: 100%;
      padding: 0.5rem;
    }

    .weather-card {
      background-color: var(--card-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      transition: all 0.3s ease;
    }

    .weather-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }

    :host-context(.dark-theme) .weather-card {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
    }

    /* Header */
    .weather-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 1.5rem 1.5rem 0.75rem;
    }

    .weather-location {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .city-name {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1.2;
    }

    :host-context(.dark-theme) .city-name {
      color: var(--text-primary-dark);
    }

    .condition-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      font-weight: 500;
      background-color: var(--cloudy-light);
      color: white;
    }

    .condition-badge.sunny {
      background-color: var(--sunny-light);
    }

    .condition-badge.cloudy {
      background-color: var(--cloudy-light);
    }

    .condition-badge.rainy {
      background-color: var(--rainy-light);
    }

    .condition-badge.stormy {
      background-color: var(--stormy-light);
    }

    .condition-badge.snowy {
      background-color: var(--snowy-light);
      color: var(--text-primary);
    }

    :host-context(.dark-theme) .condition-badge.sunny {
      background-color: var(--sunny-dark);
    }

    :host-context(.dark-theme) .condition-badge.cloudy {
      background-color: var(--cloudy-dark);
    }

    :host-context(.dark-theme) .condition-badge.rainy {
      background-color: var(--rainy-dark);
    }

    :host-context(.dark-theme) .condition-badge.stormy {
      background-color: var(--stormy-dark);
    }

    :host-context(.dark-theme) .condition-badge.snowy {
      background-color: var(--snowy-dark);
      color: var(--text-primary-dark);
    }

    .weather-time {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.25rem;
    }

    .current-time {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    .current-date {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }

    :host-context(.dark-theme) .current-time {
      color: var(--text-primary-dark);
    }

    :host-context(.dark-theme) .current-date {
      color: var(--text-secondary-dark);
    }

    /* Body */
    .weather-body {
      padding: 0.75rem 1.5rem 1.5rem;
    }

    .weather-main {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding: 1rem;
      background-color: rgba(59, 130, 246, 0.08);
      border-radius: var(--radius-lg);
    }

    :host-context(.dark-theme) .weather-main {
      background-color: rgba(96, 165, 250, 0.1);
    }

    .weather-icon {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }

    .temperature-display {
      display: flex;
      align-items: flex-start;
    }

    .temperature-value {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1;
      color: var(--primary-color);
    }

    .temperature-unit {
      font-size: 1.5rem;
      font-weight: 500;
      color: var(--text-secondary);
      margin-top: 0.5rem;
      margin-left: 0.25rem;
    }

    :host-context(.dark-theme) .temperature-value {
      color: var(--primary-light);
    }

    :host-context(.dark-theme) .temperature-unit {
      color: var(--text-secondary-dark);
    }

    .weather-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--radius-md);
      background-color: rgba(241, 245, 249, 0.6);
      transition: background-color 0.2s ease;
    }

    .detail-item:hover {
      background-color: rgba(241, 245, 249, 0.9);
    }

    :host-context(.dark-theme) .detail-item {
      background-color: rgba(51, 65, 85, 0.4);
    }

    :host-context(.dark-theme) .detail-item:hover {
      background-color: rgba(51, 65, 85, 0.6);
    }

    .detail-item mat-icon {
      color: var(--primary-color);
      font-size: 1.5rem;
      width: 1.5rem;
      height: 1.5rem;
    }

    :host-context(.dark-theme) .detail-item mat-icon {
      color: var(--primary-light);
    }

    .detail-info {
      display: flex;
      flex-direction: column;
    }

    .detail-label {
      font-size: 0.8rem;
      color: var(--text-tertiary);
      margin-bottom: 0.25rem;
    }

    .detail-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    :host-context(.dark-theme) .detail-label {
      color: var(--text-tertiary-dark);
    }

    :host-context(.dark-theme) .detail-value {
      color: var(--text-primary-dark);
    }

    /* Action */
    .card-action {
      padding: 1rem 1.5rem 1.5rem;
      display: flex;
      justify-content: center;
    }

    .view-forecast-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--radius-full);
      padding: 0.75rem 1.5rem;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
    }

    .view-forecast-btn:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }

    .view-forecast-btn mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
    }

    :host-context(.dark-theme) .view-forecast-btn {
      background-color: var(--primary-light);
      color: var(--background-dark);
    }

    :host-context(.dark-theme) .view-forecast-btn:hover {
      background-color: var(--primary-color);
    }

    @media (max-width: 600px) {
      .weather-card-header {
        flex-direction: column;
        gap: 1rem;
      }

      .weather-time {
        align-items: flex-start;
      }

      .weather-details {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class WeatherCardComponent {
  @Input() weather!: WeatherData;

  getCurrentTime(): string {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });
  }

  getConditionClass(condition: string): string {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('sun') || lowerCondition.includes('clear')) {
      return 'sunny';
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return 'cloudy';
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle') || lowerCondition.includes('shower')) {
      return 'rainy';
    } else if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) {
      return 'stormy';
    } else if (lowerCondition.includes('snow') || lowerCondition.includes('ice') || lowerCondition.includes('frost')) {
      return 'snowy';
    }
    return 'cloudy'; // default
  }
} 