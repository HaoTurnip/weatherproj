import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { WeatherService, WeatherAlert } from '../../core/services/weather.service';
import { ThemeService } from '../../core/services/theme.service';

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
          <mat-spinner class="text-primary"></mat-spinner>
        </div>
      } @else if (error) {
        <div class="error-card" [class.dark]="(isDarkMode$ | async)">
          <mat-icon class="error-icon">error_outline</mat-icon>
          <div class="error-content">
            <strong class="error-title">Error!</strong>
            <span class="error-message">{{ error }}</span>
          </div>
        </div>
      } @else if (alerts && alerts.length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          @for (alert of alerts; track alert.id) {
            <mat-card class="alert-card" [class.dark]="(isDarkMode$ | async)">
              <div class="flex items-start">
                <mat-icon class="severity-icon" [class]="getSeverityClass(alert.severity)">
                  {{ getSeverityIcon(alert.severity) }}
                </mat-icon>
                <div class="flex-1">
                  <h3 class="alert-title">
                    {{ alert.title }}
                  </h3>
                  <p class="alert-description">
                    {{ alert.description }}
                  </p>
                  <div class="alert-details">
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
        <div class="no-alerts" [class.dark]="(isDarkMode$ | async)">
          <mat-icon class="no-alerts-icon">notifications_off</mat-icon>
          <h2 class="no-alerts-title">No Active Alerts</h2>
          <p class="no-alerts-message">There are currently no weather alerts for your location.</p>
        </div>
      }
    </div>
  `,
  styles: [`
    h1 {
      color: var(--text-primary);
      transition: color 0.3s ease;
    }

    .dark h1 {
      color: white;
    }

    .alert-card {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
      color: white;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .alert-card.dark {
      background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
    }

    .severity-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      margin-right: 16px;
      margin-top: 4px;
    }

    .severity-extreme {
      color: #ef4444;
    }

    .severity-severe {
      color: #f97316;
    }

    .severity-moderate {
      color: #fbbf24;
    }

    .severity-minor {
      color: #60a5fa;
    }

    .alert-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .alert-description {
      margin-bottom: 1rem;
      opacity: 0.9;
    }

    .alert-details {
      font-size: 0.875rem;
      opacity: 0.8;
    }

    .error-card {
      background: linear-gradient(135deg, #fee2e2, #fecaca);
      color: #991b1b;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 16px;
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
      margin-bottom: 4px;
    }

    .error-message {
      font-size: 0.875rem;
    }

    .no-alerts {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
      color: white;
      border-radius: 12px;
      padding: 48px 24px;
      text-align: center;
      transition: all 0.3s ease;
    }

    .no-alerts.dark {
      background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
    }

    .no-alerts-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      margin-bottom: 16px;
      opacity: 0.8;
    }

    .no-alerts-title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .no-alerts-message {
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
export class AlertsComponent implements OnInit {
  alerts: WeatherAlert[] = [];
  loading = false;
  error: string | null = null;
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private weatherService: WeatherService,
    private themeService: ThemeService
  ) {}

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

  getSeverityClass(severity: string): string {
    return `severity-${severity.toLowerCase()}`;
  }
} 