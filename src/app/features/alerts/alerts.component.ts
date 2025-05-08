import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService } from '../../core/services/auth.service';
import { NewAlertDialogComponent } from './new-alert-dialog.component';
import { Alert } from '../../core/models/alert.model';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="alerts-container">
      <div class="alerts-header">
        <div class="header-content">
          <h1>Weather Alerts</h1>
          <p class="subtitle">Stay informed about severe weather conditions in your area</p>
        </div>
        <button mat-raised-button color="primary" (click)="openNewAlertDialog()" class="create-alert-btn">
          <mat-icon>add</mat-icon>
          Create Alert
        </button>
      </div>

      @if (loading) {
        <div class="loading-container">
          <mat-spinner diameter="40"></mat-spinner>
          <p>Loading alerts...</p>
        </div>
      } @else if (alerts.length === 0) {
        <div class="no-alerts">
          <mat-icon class="no-alerts-icon">notifications_off</mat-icon>
          <h2>No Active Alerts</h2>
          <p>There are currently no active weather alerts in your area.</p>
          <button mat-raised-button color="primary" (click)="openNewAlertDialog()">
            Create First Alert
          </button>
        </div>
      } @else {
        <div class="alerts-grid">
          @for (alert of alerts; track alert.id) {
            <mat-card class="alert-card" [class.active]="isAlertActive(alert)">
              <div class="alert-header" [class]="'severity-' + alert.severity">
                <div class="alert-type">
                  <mat-icon>{{ getWeatherIcon(alert.type) }}</mat-icon>
                  <span>{{ alert.type }}</span>
                </div>
                <div class="alert-severity">
                  <mat-chip [color]="getSeverityColor(alert.severity)" selected>
                    {{ alert.severity | titlecase }}
                  </mat-chip>
                </div>
              </div>

              <mat-card-content>
                <h3 class="alert-title">{{ alert.title }}</h3>
                <p class="alert-description">{{ alert.description }}</p>
                
                <div class="alert-details">
                  <div class="detail-item">
                    <mat-icon>location_on</mat-icon>
                    <span>{{ alert.location }}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>schedule</mat-icon>
                    <span>{{ formatDateRange(alert.startTime, alert.endTime) }}</span>
                  </div>
                </div>

                <div class="alert-stats">
                  <div class="stat-item">
                    <mat-icon>arrow_upward</mat-icon>
                    <span>{{ alert.upvotes || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <mat-icon>arrow_downward</mat-icon>
                    <span>{{ alert.downvotes || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <mat-icon>comment</mat-icon>
                    <span>{{ alert.comments?.length || 0 }}</span>
                  </div>
                </div>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button color="primary" (click)="vote(alert.id!, 'up')" [disabled]="!isLoggedIn || !alert.id">
                  <mat-icon>arrow_upward</mat-icon>
                  Upvote
                </button>
                <button mat-button color="warn" (click)="vote(alert.id!, 'down')" [disabled]="!isLoggedIn || !alert.id">
                  <mat-icon>arrow_downward</mat-icon>
                  Downvote
                </button>
                <button mat-button (click)="viewDetails(alert.id!)" [disabled]="!alert.id">
                  <mat-icon>info</mat-icon>
                  Details
                </button>
              </mat-card-actions>
            </mat-card>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .alerts-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .alerts-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding-bottom: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .header-content h1 {
      margin: 0;
      font-size: 2.5rem;
      color: #1a237e;
    }

    .subtitle {
      margin: 8px 0 0;
      color: #666;
      font-size: 1.1rem;
    }

    .create-alert-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 24px;
      font-size: 1rem;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 48px;
      color: #666;
    }

    .no-alerts {
      text-align: center;
      padding: 48px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .no-alerts-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #9e9e9e;
      margin-bottom: 16px;
    }

    .alerts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 24px;
    }

    .alert-card {
      transition: transform 0.2s, box-shadow 0.2s;
      border-radius: 12px;
      overflow: hidden;
    }

    .alert-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .alert-card.active {
      border-left: 4px solid #4caf50;
    }

    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f5f5f5;
    }

    .alert-header.severity-extreme {
      background: #ffebee;
    }

    .alert-header.severity-severe {
      background: #fff3e0;
    }

    .alert-header.severity-moderate {
      background: #e8f5e9;
    }

    .alert-header.severity-minor {
      background: #e3f2fd;
    }

    .alert-type {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }

    .alert-title {
      margin: 16px 0 8px;
      font-size: 1.25rem;
      color: #1a237e;
    }

    .alert-description {
      color: #666;
      margin-bottom: 16px;
      line-height: 1.5;
    }

    .alert-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin: 16px 0;
      padding: 16px;
      background: #f5f5f5;
      border-radius: 8px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #666;
    }

    .alert-stats {
      display: flex;
      gap: 16px;
      margin: 16px 0;
      padding: 8px 0;
      border-top: 1px solid #e0e0e0;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
    }

    mat-card-actions {
      padding: 8px 16px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #e0e0e0;
    }

    mat-card-actions button {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    @media (max-width: 768px) {
      .alerts-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }

      .alerts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AlertsComponent implements OnInit {
  private dialog = inject(MatDialog);
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  alerts: Alert[] = [];
  loading = true;
  error: string | null = null;
  isLoggedIn = false;

  constructor() {
    this.authService.isLoggedIn$.subscribe(
      (isLoggedIn: boolean) => this.isLoggedIn = isLoggedIn
    );
  }

  ngOnInit() {
    this.loadAlerts();
  }

  loadAlerts() {
    this.loading = true;
    this.error = null;

    this.firebaseService.getAlerts().then(
      (alerts: Alert[]) => {
        this.alerts = alerts;
        this.loading = false;
      }
    ).catch((error: string) => {
      console.error('Error loading alerts:', error);
      this.snackBar.open('Failed to load alerts', 'Close', { duration: 3000 });
      this.loading = false;
      this.error = error;
    });
  }

  openNewAlertDialog() {
    const dialogRef = this.dialog.open(NewAlertDialogComponent, {
      width: '600px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        this.loadAlerts();
      }
    });
  }

  async vote(alertId: string | undefined, voteType: 'up' | 'down') {
    if (!alertId) {
      console.error('Cannot vote: Alert ID is undefined');
      return;
    }

    if (!this.isLoggedIn) {
      this.snackBar.open('Please sign in to vote', 'Sign In', {
        duration: 5000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: '/alerts',
            message: 'Please sign in to vote on alerts'
          }
        });
      });
      return;
    }

    try {
      await this.firebaseService.voteOnAlert(alertId, voteType);
      this.loadAlerts();
    } catch (error) {
      console.error('Error voting on alert:', error);
      this.snackBar.open('Failed to vote on alert', 'Close', {
        duration: 5000
      });
    }
  }

  viewDetails(alertId: string | undefined) {
    if (!alertId) {
      console.error('Cannot view details: Alert ID is undefined');
      return;
    }
    this.router.navigate(['/alerts', alertId]);
  }

  getWeatherIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Thunderstorm': 'thunderstorm',
      'Rain': 'water_drop',
      'Snow': 'ac_unit',
      'Fog': 'cloud',
      'Wind': 'air',
      'Heat': 'wb_sunny',
      'Cold': 'ac_unit',
      'Flood': 'water'
    };
    return icons[type] || 'warning';
  }

  getSeverityColor(severity: string): 'primary' | 'accent' | 'warn' {
    const colors: { [key: string]: 'primary' | 'accent' | 'warn' } = {
      'extreme': 'warn',
      'severe': 'accent',
      'moderate': 'primary',
      'minor': 'primary'
    };
    return colors[severity] || 'primary';
  }

  isAlertActive(alert: Alert): boolean {
    const now = new Date();
    return new Date(alert.startTime) <= now && new Date(alert.endTime) >= now;
  }

  formatDateRange(start: Date, end: Date): string {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const options: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  }
} 