import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { WeatherService, WeatherAlert } from '../../core/services/weather.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Weather Alerts</h1>

      @if (loading) {
        <div class="flex justify-center items-center h-64">
          <mat-spinner></mat-spinner>
        </div>
      } @else if (error) {
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong class="font-bold">Error!</strong>
          <span class="block sm:inline"> {{ error }}</span>
        </div>
      } @else if (alerts && alerts.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (alert of alerts; track alert.id) {
            <mat-card class="p-4 bg-white dark:bg-gray-800 shadow-lg">
              <div class="flex items-start">
                <mat-icon class="text-red-500 mr-4" [class]="getSeverityIcon(alert.severity)">
                  {{ getSeverityIcon(alert.severity) }}
                </mat-icon>
                <div class="flex-1">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {{ alert.title }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-300 mb-4">
                    {{ alert.description }}
                  </p>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    <p>Type: {{ alert.type }}</p>
                    <p>Severity: {{ alert.severity | titlecase }}</p>
                    <p>Start: {{ alert.startTime | date:'medium' }}</p>
                    <p>End: {{ alert.endTime | date:'medium' }}</p>
                  </div>
                </div>
              </div>
            </mat-card>
          }
        </div>
      } @else {
        <div class="text-center py-12">
          <mat-icon class="text-6xl text-gray-400 dark:text-gray-600 mb-4">notifications_off</mat-icon>
          <h2 class="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Active Alerts</h2>
          <p class="text-gray-500 dark:text-gray-400">There are currently no weather alerts for your location.</p>
        </div>
      }
    </div>
  `,
  styles: []
})
export class AlertsComponent implements OnInit {
  alerts: WeatherAlert[] = [];
  loading = false;
  error: string | null = null;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.loading = true;
    this.error = null;

    this.weatherService.getAlerts('London').subscribe({
      next: (data) => {
        this.alerts = data.alerts || [];
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load weather alerts. Please try again later.';
        this.loading = false;
        console.error('Alerts error:', error);
      }
    });
  }

  getSeverityIcon(severity: string): string {
    switch (severity.toLowerCase()) {
      case 'extreme':
        return 'warning';
      case 'severe':
        return 'error';
      case 'moderate':
        return 'info';
      default:
        return 'notifications';
    }
  }
} 