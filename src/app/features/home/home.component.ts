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
  template: `
    <div class="home-container">
      @if (loading) {
        <div class="skeleton-container">
          <app-skeleton-loader [lines]="[100, 80, 60]" />
        </div>
      } @else if (error) {
        <div class="error-container">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h2>Error Loading Weather Data</h2>
          <p>{{ error }}</p>
          <button mat-raised-button color="primary" (click)="loadWeatherData()">
            Retry
          </button>
        </div>
      } @else {
        <!-- Weather Card -->
        <mat-card class="weather-card">
          <div class="weather-header">
            <div class="location">
              <h1>{{ currentWeather?.cityName }}</h1>
              <p class="date-time">{{ currentDate | date:'EEEE, MMMM d, y' }}</p>
            </div>
            <div class="temperature">
              <span class="temp-value">{{ currentWeather?.temp_c }}°</span>
              <span class="temp-unit">C</span>
            </div>
          </div>
          <div class="weather-details">
            <div class="weather-icon">
              <img [src]="currentWeather?.icon" [alt]="currentWeather?.condition">
            </div>
            <div class="weather-info">
              <p class="weather-condition">{{ currentWeather?.condition }}</p>
              <p class="feels-like">Humidity: {{ currentWeather?.humidity }}%</p>
              <p class="wind">Wind: {{ currentWeather?.wind_kph }} km/h {{ currentWeather?.wind_dir }}</p>
              <p class="precipitation">Precipitation: {{ currentWeather?.precip_mm }} mm</p>
              <p class="uv-index">UV Index: {{ currentWeather?.uv }}</p>
            </div>
          </div>
        </mat-card>

        <!-- Hourly Forecast -->
        <section class="hourly-forecast">
          <h2>Hourly Forecast</h2>
          <div class="hourly-scroll">
            <div class="hourly-item" *ngFor="let hour of hourlyForecast">
              <span class="hour">{{ hour.time }}</span>
              <img [src]="hour.icon" [alt]="hour.condition">
              <span class="temp">{{ hour.temperature }}°</span>
            </div>
          </div>
        </section>

        <!-- Daily Forecast -->
        <!-- Active Alerts -->
        <div class="active-alerts" *ngIf="activeAlerts.length > 0">
          <h2>Active Weather Alerts</h2>
          <mat-card *ngFor="let alert of activeAlerts" class="alert-card">
            <mat-card-header>
              <mat-card-title>{{ alert.title }}</mat-card-title>
              <mat-card-subtitle>{{ alert.type }} - {{ alert.severity }}</mat-card-subtitle>
            </mat-card-header>
            <mat-card-content>
              <p>{{ alert.description }}</p>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .weather-card {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .weather-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .location h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .date-time {
      color: #666;
      margin: 4px 0 0;
    }

    .temperature {
      text-align: right;
    }

    .temp-value {
      font-size: 48px;
      font-weight: 700;
    }

    .temp-unit {
      font-size: 24px;
      font-weight: 500;
    }

    .weather-details {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .weather-icon img {
      width: 64px;
      height: 64px;
    }

    .weather-info {
      flex: 1;
    }

    .weather-info p {
      margin: 4px 0;
      color: #333;
    }

    .weather-condition {
      font-size: 18px;
      font-weight: 500;
    }

    .hourly-forecast {
      background: #fff;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .hourly-forecast h2 {
      margin: 0 0 16px;
      font-size: 20px;
      font-weight: 600;
    }

    .hourly-scroll {
      display: flex;
      overflow-x: auto;
      gap: 16px;
      padding: 8px 0;
    }

    .hourly-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 80px;
      text-align: center;
    }

    .hourly-item .hour {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }

    .hourly-item img {
      width: 32px;
      height: 32px;
      margin: 8px 0;
    }

    .hourly-item .temp {
      font-size: 16px;
      font-weight: 500;
    }

    .active-alerts {
      margin-top: 32px;
    }

    .alert-card {
      transition: transform 0.2s;
    }

    .alert-card:hover {
      transform: translateY(-4px);
    }

    .alert-card.severity-extreme {
      border-left: 4px solid #f44336;
    }

    .alert-card.severity-severe {
      border-left: 4px solid #ff9800;
    }

    .alert-card.severity-moderate {
      border-left: 4px solid #4caf50;
    }

    .alert-card.severity-minor {
      border-left: 4px solid #2196f3;
    }

    .error-container {
      text-align: center;
      padding: 48px;
      background: #f5f5f5;
      border-radius: 12px;
    }

    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #f44336;
      margin-bottom: 16px;
    }

    @media (max-width: 768px) {
      .weather-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .temperature {
        text-align: left;
        margin-top: 16px;
      }

      .weather-details {
        flex-direction: column;
        align-items: flex-start;
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
          humidity: 0, // Not available in stub, set to 0 or fetch from another API
          wind_kph: 0, // Not available in stub, set to 0 or fetch from another API
          wind_dir: '', // Not available in stub
          precip_mm: 0, // Not available in stub
          uv: 0 // Not available in stub
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
} 