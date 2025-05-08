import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WeatherService } from '../../core/services/weather.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Weather Map</h1>
          <p class="text-gray-600 dark:text-gray-400">View global weather patterns and conditions</p>
        </div>
        <div class="flex flex-col gap-4 w-full md:w-auto">
          <div class="controls-wrapper">
            <mat-button-toggle-group [(ngModel)]="selectedOverlay" (change)="updateMap()" class="map-controls">
          <mat-button-toggle value="temperature">
            <mat-icon>thermostat</mat-icon>
                <span>Temperature</span>
          </mat-button-toggle>
          <mat-button-toggle value="precipitation">
            <mat-icon>water_drop</mat-icon>
                <span>Precipitation</span>
          </mat-button-toggle>
          <mat-button-toggle value="wind">
            <mat-icon>air</mat-icon>
                <span>Wind</span>
          </mat-button-toggle>
          <mat-button-toggle value="clouds">
            <mat-icon>cloud</mat-icon>
                <span>Clouds</span>
          </mat-button-toggle>
        </mat-button-toggle-group>
            <button mat-raised-button color="primary" (click)="updateMap()" [disabled]="loading" class="refresh-button">
              <mat-icon>refresh</mat-icon>
              <span>Refresh Map</span>
            </button>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner class="text-primary"></mat-spinner>
          <p class="loading-text">Loading weather map...</p>
        </div>
      } @else if (error) {
        <div class="error-card" [class.dark]="(isDarkMode$ | async)">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <div class="error-content">
            <strong class="error-title">Error!</strong>
            <span class="error-message">{{ error }}</span>
          </div>
        </div>
      } @else {
        <mat-card class="map-card" [class.dark]="(isDarkMode$ | async)">
          <div class="map-container">
            @if (mapUrl) {
              <img [src]="mapUrl" alt="Weather Map" class="map-image">
              <div class="map-overlay">
                <div class="map-info">
                  <h3 class="map-title">{{ getMapTitle() }}</h3>
                  <p class="map-description">{{ getMapDescription() }}</p>
                </div>
              </div>
            } @else {
              <div class="no-map" [class.dark]="(isDarkMode$ | async)">
                <mat-icon class="no-map-icon">map_off</mat-icon>
                <h2 class="no-map-title">No Map Data</h2>
                <p class="no-map-message">Select a map overlay to view weather data</p>
            </div>
            }
          </div>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .controls-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: var(--card-light);
      padding: 1rem;
      border-radius: 12px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .dark .controls-wrapper {
      background: var(--card-dark);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .map-controls {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      background: transparent;
      border: none;
    }

    .mat-button-toggle {
      background: var(--surface-light);
      color: var(--text-primary);
      border: 1px solid var(--border-light);
      border-radius: 8px !important;
      margin: 0 4px;
      transition: all 0.3s ease;
    }

    .dark .mat-button-toggle {
      background: var(--surface-dark);
      color: var(--text-light);
      border-color: var(--border-dark);
    }

    .mat-button-toggle-checked {
      background: var(--primary-blue) !important;
      color: white !important;
      border-color: var(--primary-blue) !important;
    }

    .dark .mat-button-toggle-checked {
      background: var(--light-blue) !important;
    }

    .mat-button-toggle-group {
      border: none;
    }

    .refresh-button {
      width: 100%;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: var(--primary-blue);
      color: white;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .dark .refresh-button {
      background: var(--light-blue);
    }

    .refresh-button:hover {
      opacity: 0.9;
    }

    .refresh-button:disabled {
      opacity: 0.5;
    }

    .map-card {
      background: var(--card-light);
      border-radius: 12px;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .dark .map-card {
      background: var(--card-dark);
    }

    .map-container {
      position: relative;
      width: 100%;
      height: 600px;
      border-radius: 8px;
      overflow: hidden;
    }

    .map-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .map-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 1rem;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
      color: white;
    }

    .map-info {
      max-width: 600px;
    }

    .map-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .map-description {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 600px;
      gap: 1rem;
    }

    .loading-text {
      color: var(--text-primary);
      font-size: 1.125rem;
    }

    .dark .loading-text {
      color: var(--text-light);
    }

    .error-card {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #991b1b;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
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
      margin-bottom: 0.25rem;
    }

    .error-message {
      font-size: 0.875rem;
    }

    .no-map {
      background: var(--card-light);
      color: var(--text-primary);
      border-radius: 12px;
      padding: 3rem 1.5rem;
      text-align: center;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .dark .no-map {
      background: var(--card-dark);
      color: var(--text-light);
    }

    .no-map-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 1rem;
      opacity: 0.8;
    }

    .no-map-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .no-map-message {
      opacity: 0.8;
    }

    .text-primary {
      color: var(--primary-blue);
    }

    .dark .text-primary {
      color: var(--light-blue);
    }
  `]
})
export class MapComponent implements OnInit {
  selectedOverlay: 'temperature' | 'precipitation' | 'wind' | 'clouds' = 'temperature';
  mapUrl: string | null = null;
  loading = false;
  error: string | null = null;
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private weatherService: WeatherService,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.updateMap();
  }

  updateMap() {
    this.loading = true;
    this.error = null;

    this.weatherService.getMapOverlay(this.selectedOverlay).subscribe({
      next: (url) => {
        this.mapUrl = url;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load weather map. Please try again later.';
        this.loading = false;
        console.error('Map error:', error);
      }
    });
  }

  getMapTitle(): string {
    switch (this.selectedOverlay) {
      case 'temperature':
        return 'Global Temperature Map';
      case 'precipitation':
        return 'Global Precipitation Map';
      case 'wind':
        return 'Global Wind Map';
      case 'clouds':
        return 'Global Cloud Coverage Map';
      default:
        return 'Weather Map';
    }
  }

  getMapDescription(): string {
    switch (this.selectedOverlay) {
      case 'temperature':
        return 'Shows current temperature patterns across the globe';
      case 'precipitation':
        return 'Displays precipitation and rainfall patterns worldwide';
      case 'wind':
        return 'Illustrates wind speed and direction globally';
      case 'clouds':
        return 'Shows cloud coverage and distribution worldwide';
      default:
        return 'Select a map overlay to view weather data';
    }
  }
} 