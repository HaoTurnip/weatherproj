import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      /* Global styles for map component in dark mode */
      .dark-theme .map-container {
        color: var(--text-primary-dark);
      }
      
      .dark-theme .map-card {
        background-color: var(--card-dark) !important;
        border: 1px solid var(--border-dark) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
      }
      
      .dark-theme .map-card:hover {
        box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3) !important;
      }
      
      .dark-theme .map-card .mat-mdc-card-title {
        color: var(--text-primary-dark) !important;
      }
      
      .dark-theme .map-card .mat-mdc-card-subtitle {
        color: var(--text-secondary-dark) !important;
      }
      
      /* Button toggle group styling for dark mode */
      .dark-theme .mat-button-toggle-group {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        gap: 12px !important;
        display: flex !important;
      }
      
      .dark-theme .mat-button-toggle {
        background: var(--card-hover-dark) !important;
        color: var(--text-secondary-dark) !important;
        border: 2px solid transparent !important;
        border-radius: var(--radius-lg) !important;
        min-width: 120px !important;
        transition: all 0.3s ease !important;
        overflow: hidden !important;
      }
      
      .dark-theme .mat-button-toggle:not(.mat-button-toggle-checked):hover {
        background: var(--card-dark) !important;
        color: var(--text-primary-dark) !important;
        border-color: var(--border-dark) !important;
      }
      
      .dark-theme .mat-button-toggle-checked {
        background: rgba(96, 165, 250, 0.2) !important;
        color: var(--primary-light) !important;
        border-color: var(--primary-light) !important;
        font-weight: 600 !important;
      }
      
      .dark-theme .mat-button-toggle-button {
        color: inherit !important;
        display: block !important;
        padding: 8px 16px !important;
      }
      
      .dark-theme .mat-button-toggle-focus-overlay {
        background-color: transparent !important;
      }
      
      /* Map image styles */
      .dark-theme .map-image {
        background-color: var(--card-dark) !important;
        border: 1px solid var(--border-dark) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
      }
      
      /* Error container styles */
      .dark-theme .error-container {
        background-color: var(--card-dark) !important;
        color: var(--text-primary-dark) !important;
        border: 1px solid var(--border-dark) !important;
      }
      
      .dark-theme .error-icon {
        color: var(--error-light) !important;
      }
    </style>
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
      background: var(--card-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      margin-bottom: 24px;
      transition: all 0.3s ease;
      color: var(--text-primary);
      font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
      border: 1px solid var(--border-light);
    }
    
    .map-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-3px);
    }
    
    :host-context(.dark-theme) .map-card {
      background: var(--card-dark);
      color: var(--text-primary-dark);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      border-color: var(--border-dark);
    }
    
    :host-context(.dark-theme) .map-card:hover {
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
    }
    
    .map-card .mat-mdc-card-title {
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .map-card .mat-mdc-card-subtitle {
      color: var(--text-secondary);
    }
    
    :host-context(.dark-theme) .map-card .mat-mdc-card-title {
      color: var(--text-primary-dark);
    }
    
    :host-context(.dark-theme) .map-card .mat-mdc-card-subtitle {
      color: var(--text-secondary-dark);
    }

    .map-controls {
      margin-bottom: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    
    .mat-button-toggle-group {
      background: transparent;
      border-radius: var(--radius-lg);
      border: none;
      gap: 12px;
      display: flex;
    }
    
    .mat-button-toggle {
      border-radius: var(--radius-lg) !important;
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-secondary);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      overflow: hidden;
      background: var(--card-hover-light);
      min-width: 120px;
    }
    
    .mat-button-toggle-checked {
      background: var(--primary-color-light) !important;
      color: var(--primary-color) !important;
      border-color: var(--primary-color) !important;
      font-weight: 600;
    }
    
    .mat-button-toggle .mat-button-toggle-button {
      display: block;
      padding: 8px 16px;
    }
    
    .mat-button-toggle:not(.mat-button-toggle-checked):hover {
      background: var(--card-light);
      color: var(--text-primary);
      border-color: var(--border-light);
    }
    
    :host-context(.dark-theme) .mat-button-toggle-group {
      background: transparent;
    }
    
    :host-context(.dark-theme) .mat-button-toggle {
      background: var(--card-hover-dark);
      color: var(--text-secondary-dark);
    }
    
    :host-context(.dark-theme) .mat-button-toggle-checked {
      background: rgba(96, 165, 250, 0.2) !important;
      color: var(--primary-light) !important;
      border-color: var(--primary-light) !important;
    }
    
    :host-context(.dark-theme) .mat-button-toggle:not(.mat-button-toggle-checked):hover {
      background: var(--card-dark);
      color: var(--text-primary-dark);
      border-color: var(--border-dark);
    }

    .map-image {
      width: 100%;
      height: 600px;
      background: var(--card-hover-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      margin-bottom: 8px;
      transition: all 0.3s ease;
      border: 1px solid var(--border-light);
    }
    
    :host-context(.dark-theme) .map-image {
      background: var(--card-dark);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
      border-color: var(--border-dark);
    }
    
    .map-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: var(--radius-lg);
    }

    .error-container {
      text-align: center;
      padding: 48px;
      background: var(--card-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      box-shadow: var(--shadow-md);
      border: 1px solid var(--border-light);
    }
    
    :host-context(.dark-theme) .error-container {
      background: var(--card-dark);
      color: var(--text-primary-dark);
      border-color: var(--border-dark);
    }
    
    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--error-color);
      margin-bottom: 16px;
    }
    
    :host-context(.dark-theme) .error-icon {
      color: var(--error-light);
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