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
import { ForecastData, HourlyForecast, DailyForecast, HomeWeatherData } from '../../core/models/weather.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { WeatherConditionPipe } from '../../shared/pipes/weather-condition.pipe';
import { RouterModule } from '@angular/router';
import { CityService } from '../../core/services/city.service';
import { Hour12Pipe } from '../../shared/pipes/hour12.pipe';

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
    RouterModule,
    SkeletonLoaderComponent,
    TemperaturePipe,
    WeatherConditionPipe,
    Hour12Pipe
  ],
  template: `
    <div class="home-container">
      @if (loading) {
        <div class="loading-container">
          <div class="loading-spinner">
            <mat-spinner diameter="40"></mat-spinner>
            <div class="loading-text">Loading weather data...</div>
          </div>
        </div>
      } @else if (error) {
        <div class="error-container">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h2 class="error-title">Error Loading Weather</h2>
          <p class="error-message">{{ error }}</p>
          <button mat-raised-button color="primary" (click)="loadWeatherData()" class="retry-button">
            Retry
          </button>
        </div>
      } @else if (weatherData) {
        <div class="page-header">
          <h1 class="page-title">Weather Forecast</h1>
          <div class="location-info">
            <mat-icon>location_on</mat-icon>
            <span>{{ weatherData.cityName }}</span>
          </div>
        </div>

        <div class="weather-grid">
          <div class="grid-item current-weather">
            <mat-card class="weather-card">
              <div class="weather-header">
                <div class="weather-condition-wrapper">
                  <img [src]="weatherData.icon" [alt]="weatherData.condition" class="condition-icon">
                  <div class="condition-info">
                    <span class="condition-badge" [class]="getConditionClass(weatherData.condition)">
                      {{ weatherData.condition }}
                    </span>
                    <p class="feels-like">Feels like {{ weatherData.temp_c | temperature:temperatureUnit }}</p>
                  </div>
                </div>
                <div class="temperature">
                  <span class="temp-value">{{ weatherData.temp_c | temperature: temperatureUnit }}</span>
                </div>
              </div>

              <div class="weather-details">
                <div class="detail-item">
                  <mat-icon>water_drop</mat-icon>
                  <div class="detail-info">
                    <span class="detail-label">Humidity</span>
                    <span class="detail-value">{{ weatherData.humidity }}%</span>
                  </div>
                </div>
                <div class="detail-item">
                  <mat-icon>air</mat-icon>
                  <div class="detail-info">
                    <span class="detail-label">Wind</span>
                    <span class="detail-value">{{ weatherData.wind_kph }} km/h {{ weatherData.wind_dir }}</span>
                  </div>
                </div>
                <div class="detail-item">
                  <mat-icon>opacity</mat-icon>
                  <div class="detail-info">
                    <span class="detail-label">Precipitation</span>
                    <span class="detail-value">{{ weatherData.precip_mm }} mm</span>
                  </div>
                </div>
                <div class="detail-item">
                  <mat-icon>wb_sunny</mat-icon>
                  <div class="detail-info">
                    <span class="detail-label">UV Index</span>
                    <span class="detail-value">{{ weatherData.uv }}</span>
                  </div>
                </div>
              </div>
            </mat-card>
          </div>

          <div class="grid-item hourly-forecast">
            <mat-card class="forecast-card">
              <h2 class="forecast-title">
                <mat-icon>schedule</mat-icon>
                Hourly Forecast
              </h2>
              <div class="hourly-scroll">
                @for (hour of hourlyForecast; track hour.time) {
                  <div class="hourly-item">
                    <span class="hour">{{ hour.time | hour12 }}</span>
                    <div class="hourly-icon-wrapper">
                      <img [src]="hour.icon" [alt]="hour.condition" class="hourly-icon">
                    </div>
                    <span class="hourly-temp">{{ hour.temperature | temperature: temperatureUnit }}</span>
                    <span class="hourly-condition">{{ hour.condition }}</span>
                  </div>
                }
              </div>
              <div class="forecast-action">
                <a routerLink="/forecast" class="forecast-link">
                  <mat-icon>arrow_forward</mat-icon>
                  View Full Forecast
                </a>
              </div>
            </mat-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* Global dark mode styles for home component */
    .dark-theme .home-container {
      color: var(--text-primary-dark);
    }
    
    .dark-theme .page-title {
      color: var(--text-primary-dark) ;
    }
    
    .dark-theme .location-info {
      background-color: var(--card-dark) ;
      border-color: var(--border-dark) ;
      color: var(--text-secondary-dark) ;
    }
    
    .dark-theme .weather-card, 
    .dark-theme .forecast-card {
      background-color: var(--card-dark) ;
      border-color: var(--border-dark) ;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) ;
    }
    
    .dark-theme .detail-item {
      background-color: var(--card-hover-dark) ;
    }
    
    .dark-theme .detail-item:hover {
      background-color: rgba(51, 65, 85, 0.6) ;
    }
    
    .dark-theme .detail-item mat-icon {
      color: var(--primary-light) ;
    }
    
    .dark-theme .detail-label {
      color: var(--text-tertiary-dark) ;
    }
    
    .dark-theme .detail-value {
      color: var(--text-primary-dark) ;
    }
    
    .dark-theme .forecast-title {
      color: var(--text-primary-dark) ;
      border-color: var(--border-dark) ;
    }
    
    .dark-theme .forecast-title mat-icon {
      color: var(--primary-light) ;
    }
    
    .dark-theme .hourly-scroll {
      scrollbar-color: var(--primary-light) var(--card-dark) ;
    }
    
    .dark-theme .hourly-scroll::-webkit-scrollbar-track {
      background: var(--card-dark) ;
    }
    
    .dark-theme .hourly-item {
      background-color: var(--card-hover-dark) ;
    }
    
    .dark-theme .hourly-item:hover {
      background-color: rgba(51, 65, 85, 0.6) ;
    }
    
    .dark-theme .hour {
      color: var(--text-primary-dark) ;
    }
    
    .dark-theme .hourly-temp {
      color: var(--primary-light) ;
    }
    
    .dark-theme .hourly-condition {
      color: var(--text-secondary-dark) ;
    }
    
    .dark-theme .forecast-link {
      color: var(--primary-light) ;
    }
    
    .dark-theme .forecast-link:hover {
      color: var(--primary-color) ;
    }
    
    .dark-theme .error-container {
      background-color: var(--card-dark) ;
      border: 1px solid var(--border-dark) ;
    }
    
    .dark-theme .error-title {
      color: var(--text-primary-dark) ;
    }
    
    .dark-theme .error-message {
      color: var(--text-secondary-dark) ;
    }
    
    .dark-theme .loading-text {
      color: var(--text-secondary-dark) ;
    }

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

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-light);
    }
    
    :host-context(.dark-theme) .page-header {
      border-bottom: 1px solid var(--border-dark);
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
    
    :host-context(.dark-theme) .location-info {
      background-color: rgba(0, 0, 0, 0
);
      border-color: var(--border-dark);
      color: var(--text-secondary-dark);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    
    .location-info mat-icon {
      color: var(--primary-color);
    }
    
    :host-context(.dark-theme) .location-info mat-icon {
      color: var(--primary-light);
    }

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

    .weather-card, .forecast-card {
      background-color: var(--card-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
      height: 100%;
      transition: all 0.3s ease;
    }
    
    :host-context(.dark-theme) .weather-card, 
    :host-context(.dark-theme) .forecast-card {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .weather-card:hover, .forecast-card:hover {
      transform: translateY(-5px);
      box-shadow: var(--shadow-lg);
    }
    
    :host-context(.dark-theme) .weather-card:hover, 
    :host-context(.dark-theme) .forecast-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.35);
    }

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
      background-color: var(--card-hover-dark);
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
    
    :host-context(.dark-theme) .detail-label {
      color: var(--text-tertiary-dark);
    }

    .detail-value {
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    
    :host-context(.dark-theme) .detail-value {
      color: var(--text-primary-dark);
    }

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
    
    :host-context(.dark-theme) .forecast-title {
      color: var(--text-primary-dark);
      border-bottom: 1px solid var(--border-dark);
    }

    .forecast-title mat-icon {
      color: var(--primary-color);
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
    
    :host-context(.dark-theme) .hourly-scroll {
      scrollbar-color: var(--primary-light) var(--card-dark);
    }

    .hourly-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .hourly-scroll::-webkit-scrollbar-track {
      background: var(--card-light);
      border-radius: var(--radius-full);
    }
    
    :host-context(.dark-theme) .hourly-scroll::-webkit-scrollbar-track {
      background: var(--card-dark);
    }

    .hourly-scroll::-webkit-scrollbar-thumb {
      background-color: var(--primary-light);
      border-radius: var(--radius-full);
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
      background-color: var(--card-hover-dark);
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
      border: 1px solid var(--border-light);
    }
    
    :host-context(.dark-theme) .error-container {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .error-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      color: var(--error-color);
      margin-bottom: 1rem;
    }
    
    :host-context(.dark-theme) .error-icon {
      color: var(--error-light);
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
      box-shadow: var(--shadow-md);
    }
    
    :host-context(.dark-theme) .retry-button {
      background-color: var(--primary-light);
      color: var(--background-dark);
    }
    
    :host-context(.dark-theme) .retry-button:hover {
      background-color: var(--primary-color);
      box-shadow: 0 4px 12px rgba(96, 165, 250, 0.4);
    }

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
  weatherData: HomeWeatherData | null = null;
  loading = true;
  error: string | null = null;
  cityName = 'New York';
  currentDate = new Date();
  hourlyForecast: HourlyForecast[] = [];
  temperatureUnit: 'celsius' | 'fahrenheit' = 'celsius';

  constructor(
    private weatherService: WeatherService,
    private cityService: CityService
  ) {
    // Initialize with the current unit from weather service
    this.temperatureUnit = this.weatherService.getUserSettings().units === 'metric' ? 'celsius' : 'fahrenheit';
  }

  ngOnInit() {
    this.cityService.city$.subscribe(city => {
      if (city) {
        this.cityName = city;
        this.loadWeatherData();
      } else {
        // Get default city from settings if available
        const settings = this.weatherService.getUserSettings();
        
        // Always refresh the temperature unit from latest settings
        this.temperatureUnit = settings.temperatureUnit;
        
        if (settings.defaultCity) {
          this.cityName = settings.defaultCity;
          this.loadWeatherData();
        } else {
          this.loadWeatherData();
        }
      }
    });
  }

  loadWeatherData() {
    this.loading = true;
    this.error = null;
    
    // Always get the latest settings before loading data
    const settings = this.weatherService.getUserSettings();
    this.temperatureUnit = settings.temperatureUnit;
    
    this.weatherService.getForecast(this.cityName).subscribe({
      next: (data) => {
        // Get current weather data
        this.weatherService.getCurrentWeather({ latitude: data.latitude, longitude: data.longitude }).subscribe({
          next: (currentWeather) => {
            this.weatherData = {
              cityName: this.cityName,
              temp_c: currentWeather.temperature,
              condition: currentWeather.condition,
              icon: currentWeather.icon,
              humidity: currentWeather.humidity,
              wind_kph: currentWeather.windSpeed,
              wind_dir: currentWeather.windDirection,
              precip_mm: currentWeather.precipitation,
              uv: currentWeather.uvIndex
            };
            this.hourlyForecast = data.hourly;
            this.loading = false;
          },
          error: (error) => {
            console.error('Error loading current weather:', error);
            this.error = 'Failed to load current weather data. Please try again.';
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Error loading weather data:', error);
        this.error = 'Failed to load weather data. Please try again.';
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