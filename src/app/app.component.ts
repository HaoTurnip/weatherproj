import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, RouterOutlet } from '@angular/router';
import { WeatherService, WeatherData, HourlyForecast, DailyForecast } from './services/weather.service';
import { AuthService } from './core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    RouterModule,
    RouterOutlet,
    MatMenuModule,
    FormsModule
  ]
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  title = 'Weather App';
  currentWeather: WeatherData | null = null;
  hourlyForecast: HourlyForecast[] = [];
  dailyForecast: DailyForecast[] = [];
  loading = false;
  error: string | null = null;
  currentDate = new Date();
  isLoggedIn = false;
  searchQuery = '';

  // Expanded list of major cities with their coordinates
  private cities: { [key: string]: { lat: number, lon: number, name: string } } = {
    // North America
    'new york': { lat: 40.7128, lon: -74.0060, name: 'New York, NY' },
    'los angeles': { lat: 34.0522, lon: -118.2437, name: 'Los Angeles, CA' },
    'chicago': { lat: 41.8781, lon: -87.6298, name: 'Chicago, IL' },
    'toronto': { lat: 43.6532, lon: -79.3832, name: 'Toronto, Canada' },
    'miami': { lat: 25.7617, lon: -80.1918, name: 'Miami, FL' },
    
    // Europe
    'london': { lat: 51.5074, lon: -0.1278, name: 'London, UK' },
    'paris': { lat: 48.8566, lon: 2.3522, name: 'Paris, France' },
    'berlin': { lat: 52.5200, lon: 13.4050, name: 'Berlin, Germany' },
    'rome': { lat: 41.9028, lon: 12.4964, name: 'Rome, Italy' },
    'madrid': { lat: 40.4168, lon: -3.7038, name: 'Madrid, Spain' },
    'amsterdam': { lat: 52.3676, lon: 4.9041, name: 'Amsterdam, Netherlands' },
    
    // Asia
    'tokyo': { lat: 35.6762, lon: 139.6503, name: 'Tokyo, Japan' },
    'beijing': { lat: 39.9042, lon: 116.4074, name: 'Beijing, China' },
    'seoul': { lat: 37.5665, lon: 126.9780, name: 'Seoul, South Korea' },
    'singapore': { lat: 1.3521, lon: 103.8198, name: 'Singapore' },
    'dubai': { lat: 25.2048, lon: 55.2708, name: 'Dubai, UAE' },
    
    // Oceania
    'sydney': { lat: -33.8688, lon: 151.2093, name: 'Sydney, Australia' },
    'melbourne': { lat: -37.8136, lon: 144.9631, name: 'Melbourne, Australia' },
    'auckland': { lat: -36.8509, lon: 174.7645, name: 'Auckland, New Zealand' },
    
    // South America
    'rio de janeiro': { lat: -22.9068, lon: -43.1729, name: 'Rio de Janeiro, Brazil' },
    'buenos aires': { lat: -34.6037, lon: -58.3816, name: 'Buenos Aires, Argentina' },
    'santiago': { lat: -33.4489, lon: -70.6693, name: 'Santiago, Chile' },
    
    // Africa
    'cape town': { lat: -33.9249, lon: 18.4241, name: 'Cape Town, South Africa' },
    'cairo': { lat: 30.0444, lon: 31.2357, name: 'Cairo, Egypt' },
    'nairobi': { lat: -1.2921, lon: 36.8219, name: 'Nairobi, Kenya' }
  };

  constructor(
    private weatherService: WeatherService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => this.isLoggedIn = isLoggedIn
    );
  }

  ngOnInit() {
    // Default to New York coordinates
    this.getWeatherData(40.7128, -74.0060, 'New York, NY');
  }

  getWeatherData(latitude: number, longitude: number, cityName: string) {
    this.loading = true;
    this.error = null;

    // Get current weather
    this.weatherService.getCurrentWeather(latitude, longitude).subscribe({
      next: (data) => {
        this.currentWeather = data;
        this.currentWeather.cityName = cityName;
      },
      error: (error) => {
        this.error = 'Failed to load current weather data';
        console.error('Error fetching current weather:', error);
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });

    // Get hourly forecast
    this.weatherService.getHourlyForecast(latitude, longitude).subscribe({
      next: (data) => {
        this.hourlyForecast = data;
      },
      error: (error) => {
        this.error = 'Failed to load hourly forecast';
        console.error('Error fetching hourly forecast:', error);
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });

    // Get daily forecast
    this.weatherService.getDailyForecast(latitude, longitude).subscribe({
      next: (data) => {
        this.dailyForecast = data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load daily forecast';
        console.error('Error fetching daily forecast:', error);
        this.loading = false;
        this.snackBar.open(this.error, 'Close', { duration: 5000 });
      }
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const city = input.value.toLowerCase().trim();
    
    const cityData = this.cities[city];
    if (cityData) {
      this.getWeatherData(cityData.lat, cityData.lon, cityData.name);
    } else {
      this.error = 'City not found. Please try another city from our supported locations.';
      this.snackBar.open(this.error, 'Close', { duration: 5000 });
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  logout() {
    this.authService.logout();
  }
}
