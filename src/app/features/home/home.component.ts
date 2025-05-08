import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WeatherService, WeatherData } from '../../core/services/weather.service';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { WeatherConditionPipe } from '../../shared/pipes/weather-condition.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    TemperaturePipe,
    WeatherConditionPipe
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Current Weather</h1>
      <mat-card class="bg-white dark:bg-gray-800">
        <mat-card-content class="p-6">
          @if (loading) {
            <div class="flex justify-center items-center py-8">
              <mat-spinner diameter="48"></mat-spinner>
            </div>
          } @else if (error) {
            <div class="text-center text-red-600 dark:text-red-400 py-4">
              {{ error }}
            </div>
          } @else if (weather) {
            <div class="text-center">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                {{ weather.location.name }}, {{ weather.location.region }}
              </h2>
              <div class="flex items-center justify-center mb-4">
                <img [src]="weather.current.condition.icon" [alt]="weather.current.condition.text" class="w-24 h-24">
              </div>
              <div class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                {{ weather.current.temp_f | temperature }}
              </div>
              <div class="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {{ weather.current.condition.text | weatherCondition }}
              </div>
              <div class="grid grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div>
                  <div class="font-semibold">Humidity</div>
                  <div>{{ weather.current.humidity }}%</div>
                </div>
                <div>
                  <div class="font-semibold">Wind</div>
                  <div>{{ weather.current.wind_mph }} mph</div>
                </div>
                <div>
                  <div class="font-semibold">Precipitation</div>
                  <div>{{ weather.current.precip_in }} in</div>
                </div>
              </div>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  weather: WeatherData | null = null;
  loading = true;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // For demo purposes, using a default location
    this.loadWeather('London');
  }

  private loadWeather(location: string) {
    this.loading = true;
    this.error = null;

    this.weatherService.getCurrentWeather(location).subscribe({
      next: (data) => {
        this.weather = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load weather data. Please try again later.';
        this.loading = false;
        console.error('Error loading weather:', err);
      }
    });
  }
} 