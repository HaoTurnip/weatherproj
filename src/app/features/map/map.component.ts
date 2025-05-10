import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WeatherService } from '../../core/services/weather.service';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

type MapOverlayType = 'temperature' | 'precipitation' | 'wind' | 'clouds';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="map-container">
      @if (loading) {
        <div class="skeleton-container">
          <app-skeleton-loader [lines]="[100, 80, 60]" />
        </div>
      } @else if (error) {
        <div class="error-container">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <h2>Error Loading Weather Map</h2>
          <p>{{ error }}</p>
          <button mat-raised-button color="primary" (click)="loadMapOverlay()">
            Retry
          </button>
        </div>
      } @else {
        <mat-card class="map-card">
          <mat-card-header>
            <mat-card-title>Weather Map</mat-card-title>
            <mat-card-subtitle>Select overlay type to view different weather conditions</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="map-controls">
              <mat-button-toggle-group [(ngModel)]="selectedOverlay" (change)="onOverlayChange()">
                <mat-button-toggle value="temperature">Temperature</mat-button-toggle>
                <mat-button-toggle value="precipitation">Precipitation</mat-button-toggle>
                <mat-button-toggle value="wind">Wind</mat-button-toggle>
                <mat-button-toggle value="clouds">Clouds</mat-button-toggle>
              </mat-button-toggle-group>
            </div>
            <div class="map-image">
              <img [src]="mapUrl" [alt]="selectedOverlay + ' overlay'" *ngIf="mapUrl">
            </div>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .map-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .map-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 20px rgba(30, 64, 175, 0.10);
      margin-bottom: 24px;
      transition: background 0.3s, color 0.3s, box-shadow 0.3s;
      color: #222;
      font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
    }
    .map-card:hover {
      box-shadow: 0 8px 24px rgba(30, 64, 175, 0.16);
    }
    .dark-theme .map-card {
      background: #232a34;
      color: #f4f6fb;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }

    .map-controls {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .mat-button-toggle-group {
      background: #f4f6fb;
      border-radius: 999px;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
      padding: 4px 8px;
      gap: 4px;
      font-weight: 500;
    }
    .mat-button-toggle-checked {
      background: #1976d2 !important;
      color: #fff !important;
      border-radius: 999px !important;
      font-weight: 700;
    }
    .mat-button-toggle {
      border-radius: 999px !important;
      font-size: 1rem;
      font-weight: 500;
      color: #1976d2;
      transition: background 0.2s, color 0.2s;
    }
    .mat-button-toggle:not(.mat-button-toggle-checked):hover {
      background: #e3eafc;
      color: #1976d2;
    }
    .dark-theme .mat-button-toggle-group {
      background: #232a34;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.18);
    }
    .dark-theme .mat-button-toggle {
      color: #90caf9;
    }
    .dark-theme .mat-button-toggle-checked {
      background: #90caf9 !important;
      color: #232a34 !important;
    }

    .map-image {
      width: 100%;
      height: 600px;
      background: #f5f5f5;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
      margin-bottom: 8px;
      transition: background 0.3s;
    }
    .dark-theme .map-image {
      background: #232a34;
      box-shadow: 0 2px 8px rgba(0,0,0,0.18);
    }
    .map-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 16px;
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
      .map-image {
        height: 400px;
      }
      .map-container {
        padding: 12px;
      }
    }
  `]
})
export class MapComponent implements OnInit {
  selectedOverlay: MapOverlayType = 'temperature';
  mapUrl: string | null = null;
  loading = true;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadMapOverlay();
  }

  loadMapOverlay() {
    this.loading = true;
    this.error = null;

    this.weatherService.getMapOverlay(this.selectedOverlay).subscribe({
      next: (url: string) => {
        this.mapUrl = url;
        this.loading = false;
      },
      error: (error: Error) => {
        console.error('Error loading map overlay:', error);
        this.error = 'Failed to load weather map. Please try again.';
        this.loading = false;
      }
    });
  }

  onOverlayChange() {
    this.loadMapOverlay();
  }
} 