import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { WeatherService } from '../../core/services/weather.service';
import { WeatherAlert } from '../../core/models/alert.model';
import { ForecastData, HourlyForecast, DailyForecast } from '../../core/models/weather.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { WeatherConditionPipe } from '../../shared/pipes/weather-condition.pipe';
import { RouterModule } from '@angular/router';
import { CityService } from '../../services/city.service';

interface WeatherData {
  cityName: string;
  temp_c: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_kph: number;
  wind_dir: string;
  precip_mm: number;
  uv: number;
  feelsLike?: number;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule,
    SkeletonLoaderComponent,
    TemperaturePipe,
    WeatherConditionPipe,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styles: [`
    .home-container {
      padding: 0.5rem;
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-in-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Page header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-light);
    }

    :host-context(.dark-theme) .page-header {
      border-bottom-color: var(--border-dark);
    }

    .page-title {
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0;
    }

    :host-context(.dark-theme) .page-title {
      color: var(--text-primary-dark);
    }

    .location-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background-color: var(--card-light);
      border-radius: var(--radius-full);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);
      font-weight: 500;
      color: var(--text-secondary);
    }

    .location-info mat-icon {
      color: var(--primary-color);
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    :host-context(.dark-theme) .location-info {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
      color: var(--text-secondary-dark);
    }

    :host-context(.dark-theme) .location-info mat-icon {
      color: var(--primary-light);
    }

    /* Weather grid layout */
    .weather-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .grid-item {
      animation: fadeInUp 0.6s ease-out;
      animation-fill-mode: both;
    }

    .current-weather {
      animation-delay: 0.1s;
    }

    .hourly-forecast {
      animation-delay: 0.3s;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Weather cards */
    .weather-card, .forecast-card {
      background-color: var(--card-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      height: 100%;
      transition: all 0.3s ease;
    }

    .weather-card:hover, .forecast-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }

    :host-context(.dark-theme) .weather-card,
    :host-context(.dark-theme) .forecast-card {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
    }

    /* Current weather card */
    .weather-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
      color: white;
    }

    .weather-condition-wrapper {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .condition-icon {
      width: 64px;
      height: 64px;
      filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.4));
    }

    .condition-info {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .condition-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.85rem;
      font-weight: 600;
      background-color: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    .condition-badge.sunny {
      background-color: rgba(251, 191, 36, 0.7);
    }

    .condition-badge.cloudy {
      background-color: rgba(156, 163, 175, 0.7);
    }

    .condition-badge.rainy {
      background-color: rgba(96, 165, 250, 0.7);
    }

    .condition-badge.stormy {
      background-color: rgba(99, 102, 241, 0.7);
    }

    .condition-badge.snowy {
      background-color: rgba(229, 231, 235, 0.7);
      color: #333;
    }

    .feels-like {
      margin: 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }

    .temperature {
      display: flex;
      align-items: flex-start;
    }

    .temp-value {
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1;
    }

    .temp-unit {
      font-size: 1.5rem;
      font-weight: 500;
      margin-top: 0.5rem;
    }

    .weather-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1.5rem;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
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

    /* Weather alerts */
    .weather-alerts {
      margin-top: 1rem;
      padding: 0 1.5rem 1.5rem;
    }

    .alerts-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1rem;
    }

    .alerts-title mat-icon {
      color: var(--warning-color);
    }

    :host-context(.dark-theme) .alerts-title {
      color: var(--text-primary-dark);
    }

    .alert-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .alert-item {
      border-radius: var(--radius-md);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      border-left: 4px solid var(--warning-color);
    }

    .alert-item.severity-extreme {
      border-left-color: var(--error-color);
    }

    .alert-item.severity-severe {
      border-left-color: var(--warning-color);
    }

    .alert-item.severity-moderate {
      border-left-color: var(--info-color);
    }

    .alert-item.severity-minor {
      border-left-color: var(--success-color);
    }

    .alert-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      background-color: rgba(245, 158, 11, 0.1);
    }

    .alert-item.severity-extreme .alert-header {
      background-color: rgba(239, 68, 68, 0.1);
    }

    .alert-item.severity-severe .alert-header {
      background-color: rgba(245, 158, 11, 0.1);
    }

    .alert-item.severity-moderate .alert-header {
      background-color: rgba(6, 182, 212, 0.1);
    }

    .alert-item.severity-minor .alert-header {
      background-color: rgba(16, 185, 129, 0.1);
    }

    :host-context(.dark-theme) .alert-header {
      background-color: rgba(245, 158, 11, 0.2);
    }

    :host-context(.dark-theme) .alert-item.severity-extreme .alert-header {
      background-color: rgba(239, 68, 68, 0.2);
    }

    :host-context(.dark-theme) .alert-item.severity-severe .alert-header {
      background-color: rgba(245, 158, 11, 0.2);
    }

    :host-context(.dark-theme) .alert-item.severity-moderate .alert-header {
      background-color: rgba(6, 182, 212, 0.2);
    }

    :host-context(.dark-theme) .alert-item.severity-minor .alert-header {
      background-color: rgba(16, 185, 129, 0.2);
    }

    .alert-icon {
      color: var(--warning-color);
    }

    .alert-item.severity-extreme .alert-icon {
      color: var(--error-color);
    }

    .alert-item.severity-severe .alert-icon {
      color: var(--warning-color);
    }

    .alert-item.severity-moderate .alert-icon {
      color: var(--info-color);
    }

    .alert-item.severity-minor .alert-icon {
      color: var(--success-color);
    }

    .alert-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }

    :host-context(.dark-theme) .alert-title {
      color: var(--text-primary-dark);
    }

    .alert-content {
      padding: 1rem;
      background-color: rgba(255, 255, 255, 0.5);
    }

    :host-context(.dark-theme) .alert-content {
      background-color: rgba(30, 41, 59, 0.5);
    }

    .alert-description {
      margin: 0 0 0.75rem 0;
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--text-secondary);
    }

    :host-context(.dark-theme) .alert-description {
      color: var(--text-secondary-dark);
    }

    .alert-meta {
      display: flex;
      gap: 1rem;
      font-size: 0.85rem;
    }

    .alert-type, .alert-severity {
      padding: 0.25rem 0.5rem;
      border-radius: var(--radius-sm);
      background-color: rgba(241, 245, 249, 0.8);
    }

    :host-context(.dark-theme) .alert-type,
    :host-context(.dark-theme) .alert-severity {
      background-color: rgba(51, 65, 85, 0.8);
    }

    /* Hourly forecast */
    .forecast-card {
      display: flex;
      flex-direction: column;
    }

    .forecast-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin: 0;
      padding: 1.25rem 1.5rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--text-primary);
      border-bottom: 1px solid var(--border-light);
    }

    .forecast-title mat-icon {
      color: var(--primary-color);
    }

    :host-context(.dark-theme) .forecast-title {
      color: var(--text-primary-dark);
      border-bottom-color: var(--border-dark);
    }

    :host-context(.dark-theme) .forecast-title mat-icon {
      color: var(--primary-light);
    }

    .hourly-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-height: 400px;
      scrollbar-width: thin;
      scrollbar-color: var(--primary-light) var(--card-light);
    }

    .hourly-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .hourly-scroll::-webkit-scrollbar-track {
      background: var(--card-light);
      border-radius: var(--radius-full);
    }

    .hourly-scroll::-webkit-scrollbar-thumb {
      background-color: var(--primary-light);
      border-radius: var(--radius-full);
    }

    :host-context(.dark-theme) .hourly-scroll {
      scrollbar-color: var(--primary-color) var(--card-dark);
    }

    :host-context(.dark-theme) .hourly-scroll::-webkit-scrollbar-track {
      background: var(--card-dark);
    }

    :host-context(.dark-theme) .hourly-scroll::-webkit-scrollbar-thumb {
      background-color: var(--primary-color);
    }

    .hourly-item {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      background-color: rgba(241, 245, 249, 0.6);
      transition: all 0.2s ease;
    }

    .hourly-item:hover {
      background-color: rgba(241, 245, 249, 0.9);
      transform: translateX(4px);
    }

    :host-context(.dark-theme) .hourly-item {
      background-color: rgba(51, 65, 85, 0.4);
    }

    :host-context(.dark-theme) .hourly-item:hover {
      background-color: rgba(51, 65, 85, 0.6);
    }

    .hour {
      width: 60px;
      font-weight: 600;
      color: var(--text-primary);
    }

    :host-context(.dark-theme) .hour {
      color: var(--text-primary-dark);
    }

    .hourly-icon-wrapper {
      width: 40px;
      display: flex;
      justify-content: center;
      margin: 0 0.75rem;
    }

    .hourly-icon {
      width: 32px;
      height: 32px;
      object-fit: contain;
    }

    .hourly-temp {
      width: 45px;
      font-weight: 600;
      color: var(--primary-color);
    }

    :host-context(.dark-theme) .hourly-temp {
      color: var(--primary-light);
    }

    .hourly-condition {
      flex: 1;
      font-size: 0.9rem;
      color: var(--text-secondary);
      margin-left: 0.5rem;
    }

    :host-context(.dark-theme) .hourly-condition {
      color: var(--text-secondary-dark);
    }

    .forecast-action {
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--border-light);
      display: flex;
      justify-content: center;
    }

    :host-context(.dark-theme) .forecast-action {
      border-top-color: var(--border-dark);
    }

    .forecast-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: var(--primary-color);
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease;
    }

    .forecast-link:hover {
      color: var(--primary-dark);
      transform: translateX(4px);
    }

    :host-context(.dark-theme) .forecast-link {
      color: var(--primary-light);
    }

    :host-context(.dark-theme) .forecast-link:hover {
      color: var(--primary-color);
    }

    /* Loading state */
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .loading-text {
      color: var(--text-secondary);
      font-size: 1rem;
    }

    :host-context(.dark-theme) .loading-text {
      color: var(--text-secondary-dark);
    }

    /* Error state */
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 2rem;
      background-color: var(--card-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      margin: 2rem 0;
    }

    :host-context(.dark-theme) .error-container {
      background-color: var(--card-dark);
    }

    .error-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: var(--error-color);
      margin-bottom: 1rem;
    }

    .error-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin: 0 0 0.75rem 0;
    }

    :host-context(.dark-theme) .error-title {
      color: var(--text-primary-dark);
    }

    .error-message {
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }

    :host-context(.dark-theme) .error-message {
      color: var(--text-secondary-dark);
    }

    .retry-button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--radius-md);
      padding: 0.5rem 1.5rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .retry-button:hover {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
    }

    /* Responsive styles */
    @media (max-width: 992px) {
      .weather-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .location-info {
        align-self: flex-start;
      }

      .temperature {
        justify-content: flex-end;
      }

      .weather-details {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 576px) {
      .weather-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .temperature {
        align-self: flex-start;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  cityName: string = 'New York';
  currentWeather: WeatherData | null = null;
  hourlyForecast: HourlyForecast[] = [];
  dailyForecast: DailyForecast[] = [];
  activeAlerts: WeatherAlert[] = [];
  loading = false;
  error: string | null = null;
  currentDate = new Date();

  constructor(
    private weatherService: WeatherService,
    private cityService: CityService
  ) {}

  ngOnInit() {
    this.cityService.city$.subscribe(city => {
      this.cityName = city;
      this.loadWeatherData();
    });
  }

  loadWeatherData() {
    this.loading = true;
    this.error = null;

    this.weatherService.getForecast(this.cityName).subscribe({
      next: (data: ForecastData) => {
        // Use the first hourly forecast as current weather
        const current = data.hourly[0];
        this.currentWeather = {
          cityName: data.cityName,
          temp_c: current.temperature,
          condition: current.condition,
          icon: current.icon,
          humidity: 65, // Placeholder values - use real API data in production
          wind_kph: 15, 
          wind_dir: 'NE', 
          precip_mm: 0.2, 
          uv: 4,
          feelsLike: current.temperature - 2 // Example
        };
        this.hourlyForecast = data.hourly;
        // You can also set daily forecast here if needed
        this.loading = false;
      },
      error: (error: any) => {
        this.error = 'Failed to load weather data';
        console.error('Error fetching weather data:', error);
        this.loading = false;
      }
    });
  }

  getWeatherIcon(condition: string): string {
    const conditionMap: { [key: string]: string } = {
      'Sunny': 'assets/weather-icons/sunny.svg',
      'Clear': 'assets/weather-icons/clear.svg',
      'Partly cloudy': 'assets/weather-icons/partly-cloudy.svg',
      'Cloudy': 'assets/weather-icons/cloudy.svg',
      'Overcast': 'assets/weather-icons/cloudy.svg',
      'Rain': 'assets/weather-icons/rain.svg',
      'Light rain': 'assets/weather-icons/rain.svg',
      'Moderate rain': 'assets/weather-icons/rain.svg',
      'Heavy rain': 'assets/weather-icons/rain.svg',
      'Snow': 'assets/weather-icons/snow.svg',
      'Thunder': 'assets/weather-icons/thunder.svg',
      'Fog': 'assets/weather-icons/fog.svg',
      'Mist': 'assets/weather-icons/fog.svg'
    };
    
    const normalizedCondition = condition.split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return conditionMap[normalizedCondition] || 'assets/weather-icons/partly-cloudy.svg';
  }

  getWindDirection(degree: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  }

  getConditionClass(condition: string | undefined): string {
    if (!condition) return 'cloudy';
    
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