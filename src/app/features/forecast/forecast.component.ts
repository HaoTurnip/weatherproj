import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WeatherService, ForecastData } from '../../core/services/weather.service';
import { TemperaturePipe } from '../../shared/pipes/temperature.pipe';
import { WeatherConditionPipe } from '../../shared/pipes/weather-condition.pipe';

@Component({
  selector: 'app-forecast',
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
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">5-Day Forecast</h1>

      @if (loading) {
        <div class="flex justify-center items-center h-64">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (error) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> {{ error }}</span>
        </div>
      } @else if (forecast) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          @for (day of forecast.forecastday; track day.date) {
            <mat-card class="p-4 bg-white dark:bg-gray-800 shadow-lg">
              <div class="text-center">
                <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {{ day.date | date:'EEE, MMM d' }}
                </h3>
                <img [src]="day.day.condition.icon" [alt]="day.day.condition.text" class="w-16 h-16 mx-auto mb-2">
                <p class="text-gray-600 dark:text-gray-300 mb-2">
                  {{ day.day.condition.text | weatherCondition }}
                </p>
                <div class="space-y-1">
                  <p class="text-gray-900 dark:text-white">
                    High: {{ day.day.maxtemp_f | temperature }}
                  </p>
                  <p class="text-gray-900 dark:text-white">
                    Low: {{ day.day.mintemp_f | temperature }}
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    Rain: {{ day.day.daily_chance_of_rain }}%
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    Humidity: {{ day.day.avghumidity }}%
                  </p>
                  <p class="text-gray-600 dark:text-gray-300">
                    Wind: {{ day.day.maxwind_mph }} mph
                  </p>
                </div>
              </div>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: []
})
export class ForecastComponent implements OnInit {
  forecast: ForecastData | null = null;
  loading = false;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

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
      error: (error) => {
        this.error = 'Failed to load forecast data. Please try again later.';
        this.loading = false;
        console.error('Forecast error:', error);
      }
    });
  }
} 