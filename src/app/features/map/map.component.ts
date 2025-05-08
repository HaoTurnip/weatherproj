import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { WeatherService } from '../../core/services/weather.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Weather Map</h1>
        <mat-button-toggle-group [(ngModel)]="selectedOverlay" (change)="updateMap()" class="bg-white dark:bg-gray-800">
          <mat-button-toggle value="temperature">
            <mat-icon>thermostat</mat-icon>
            Temperature
          </mat-button-toggle>
          <mat-button-toggle value="precipitation">
            <mat-icon>water_drop</mat-icon>
            Precipitation
          </mat-button-toggle>
          <mat-button-toggle value="wind">
            <mat-icon>air</mat-icon>
            Wind
          </mat-button-toggle>
          <mat-button-toggle value="clouds">
            <mat-icon>cloud</mat-icon>
            Clouds
          </mat-button-toggle>
        </mat-button-toggle-group>
      </div>

      @if (loading) {
        <div class="flex justify-center items-center h-96">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (error) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> {{ error }}</span>
        </div>
      } @else {
        <mat-card class="overflow-hidden">
          <div class="relative w-full h-96">
            <img [src]="mapUrl" alt="Weather Map" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" *ngIf="!mapUrl">
              <p class="text-white text-lg">Select a map overlay to view weather data</p>
            </div>
          </div>
        </mat-card>
      }
    </div>
  `,
  styles: []
})
export class MapComponent implements OnInit {
  selectedOverlay: 'temperature' | 'precipitation' | 'wind' | 'clouds' = 'temperature';
  mapUrl: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

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
} 