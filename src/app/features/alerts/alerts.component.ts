import { Component, OnInit } from '@angular/core';
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
import { ConfirmDialogComponent } from '../../core/components/confirm-dialog/confirm-dialog.component';
import { FilterBarComponent } from '../../shared/components/filter-bar/filter-bar.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { CommentCardComponent } from '../../shared/components/comment-card/comment-card.component';

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
    MatProgressSpinnerModule,
    FilterBarComponent,
    SkeletonLoaderComponent,
    CommentCardComponent
  ],
  template: `
    <div class="alerts-container">
      <div class="alerts-header">
        <div class="header-content">
          <h1>Weather Alerts</h1>
          <p class="subtitle">Stay informed about severe weather conditions in your area</p>
        </div>
        @if (authService.isLoggedIn()) {
          <button mat-raised-button color="primary" (click)="openNewAlertDialog()" class="create-alert-btn">
            <mat-icon>add</mat-icon>
            Create Alert
          </button>
        }
      </div>

      <app-filter-bar (filterChange)="onFilterChange($event)" />

      @if (loading) {
        <div class="skeleton-list">
          @for (i of [1,2,3]; track i) {
            <app-skeleton-loader [lines]="[100, 80, 60]" />
          }
        </div>
      } @else if (alerts.length === 0) {
        <div class="no-alerts">
          <mat-icon class="no-alerts-icon">notifications_off</mat-icon>
          <h2>No Active Alerts</h2>
          <p>There are currently no active weather alerts in your area.</p>
          @if (authService.isLoggedIn()) {
            <button mat-raised-button color="primary" (click)="openNewAlertDialog()">
              Create First Alert
            </button>
          }
        </div>
      } @else {
        <div class="alerts-list">
          @for (alert of filteredAlerts; track alert.id) {
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
                    <span>{{ comments[alert.id!]?.length || 0 }}</span>
                  </div>
                </div>

                @if (alert.id) {
                  <app-comment-card
                    [comments]="comments[alert.id] || []"
                    [currentUserId]="authService.getCurrentUser()?.uid || ''"
                    (addComment)="onAddComment(alert.id!, $event)"
                    (deleteComment)="onDeleteComment(alert.id!, $event)"
                  />
                }
              </mat-card-content>

              <mat-card-actions>
                <button mat-button color="primary" (click)="vote(alert.id!, 'up')" [disabled]="!authService.isLoggedIn() || !alert.id">
                  <mat-icon>arrow_upward</mat-icon>
                  Upvote
                </button>
                <button mat-button color="warn" (click)="vote(alert.id!, 'down')" [disabled]="!authService.isLoggedIn() || !alert.id">
                  <mat-icon>arrow_downward</mat-icon>
                  Downvote
                </button>
                <button mat-button (click)="viewDetails(alert.id!)" [disabled]="!alert.id">
                  <mat-icon>info</mat-icon>
                  Details
                </button>
                @if (authService.isLoggedIn() && alert.userId === authService.getCurrentUser()?.uid) {
                  <button mat-button color="warn" (click)="onDeleteAlert(alert.id!)">
                    <mat-icon>delete</mat-icon>
                    Delete
                  </button>
                }
              </mat-card-actions>
            </mat-card>
          }
          @if (filteredAlerts.length === 0) {
            <p class="no-alerts">No alerts found.</p>
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
    .dark-theme .alerts-header {
      border-bottom: 1px solid #333a4d;
    }

    .header-content h1 {
      margin: 0;
      font-size: 2.5rem;
      color: #1a237e;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .dark-theme .header-content h1 {
      color: #90caf9;
    }

    .subtitle {
      margin: 8px 0 0;
      color: #666;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .dark-theme .subtitle {
      color: #b0bec5;
    }

    .create-alert-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 28px;
      font-size: 1.1rem;
      font-weight: 600;
      border-radius: 999px;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
      transition: background 0.2s, color 0.2s;
    }
    .create-alert-btn mat-icon {
      font-size: 1.3rem;
    }

    .skeleton-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .alerts-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .alert-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 20px rgba(30, 64, 175, 0.10);
      transition: box-shadow 0.3s, background 0.3s, color 0.3s;
      color: #222;
      font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
      padding-bottom: 8px;
    }
    .alert-card.active {
      border-left: 5px solid #e67e22;
    }
    .alert-card:hover {
      box-shadow: 0 8px 24px rgba(30, 64, 175, 0.16);
    }
    .dark-theme .alert-card {
      background: #232a34;
      color: #f4f6fb;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    .dark-theme .alert-card.active {
      border-left: 5px solid #ffb74d;
    }

    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px 0 20px;
      border-radius: 18px 18px 0 0;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .alert-type {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.1rem;
      font-weight: 600;
      color: #1976d2;
    }
    .alert-type mat-icon {
      font-size: 1.5rem;
    }
    .alert-severity mat-chip[ng-reflect-color="warn"],
    .alert-severity mat-chip.severity-extreme {
      background: #d32f2f !important;
      color: #fff !important;
    }
    .dark-theme .alert-severity mat-chip[ng-reflect-color="warn"],
    .dark-theme .alert-severity mat-chip.severity-extreme {
      background: #ff5252 !important;
      color: #fff !important;
    }
    .alert-severity mat-chip[ng-reflect-color="accent"],
    .alert-severity mat-chip.severity-severe {
      background: #f57c00 !important;
      color: #fff !important;
    }
    .dark-theme .alert-severity mat-chip[ng-reflect-color="accent"],
    .dark-theme .alert-severity mat-chip.severity-severe {
      background: #ffb300 !important;
      color: #232a34 !important;
    }
    .alert-severity mat-chip[ng-reflect-color="primary"],
    .alert-severity mat-chip.severity-moderate {
      background: #1976d2 !important;
      color: #fff !important;
    }
    .dark-theme .alert-severity mat-chip[ng-reflect-color="primary"],
    .dark-theme .alert-severity mat-chip.severity-moderate {
      background: #90caf9 !important;
      color: #232a34 !important;
    }
    .alert-severity mat-chip[ng-reflect-color="basic"],
    .alert-severity mat-chip.severity-minor {
      background: #388e3c !important;
      color: #fff !important;
    }
    .dark-theme .alert-severity mat-chip[ng-reflect-color="basic"],
    .dark-theme .alert-severity mat-chip.severity-minor {
      background: #81c784 !important;
      color: #232a34 !important;
    }

    .alert-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 12px 0 4px 0;
      color: #1a237e;
    }
    .dark-theme .alert-title {
      color: #90caf9;
    }
    .alert-description {
      color: #555;
      font-size: 1.08rem;
      margin-bottom: 8px;
      font-weight: 500;
    }
    .dark-theme .alert-description {
      color: #cfd8dc;
    }
    .alert-details {
      display: flex;
      gap: 18px;
      margin: 10px 0 8px 0;
      color: #666;
      font-size: 1.05rem;
      font-weight: 500;
    }
    .alert-details .detail-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .dark-theme .alert-details {
      color: #b0bec5;
    }
    .alert-stats {
      display: flex;
      gap: 18px;
      margin: 8px 0 0 0;
      color: #888;
      font-size: 1rem;
      font-weight: 500;
    }
    .alert-stats .stat-item {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .dark-theme .alert-stats {
      color: #b0bec5;
    }
    mat-card-actions {
      display: flex;
      gap: 10px;
      padding: 0 20px 12px 20px;
      margin-top: 8px;
    }
    mat-card-actions button {
      border-radius: 999px;
      font-weight: 600;
      font-size: 1rem;
      padding: 6px 18px;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
      transition: background 0.2s, color 0.2s;
    }
    mat-card-actions button mat-icon {
      font-size: 1.2rem;
      margin-right: 4px;
    }
    .dark-theme mat-card-actions button {
      background: #232a34;
      color: #ffb74d;
      border: 1.5px solid #ffb74d;
    }
    .no-alerts {
      text-align: center;
      color: #888;
      margin: 32px 0;
      font-size: 1.2rem;
    }
    .no-alerts-icon {
      font-size: 3rem;
      color: #b0bec5;
      margin-bottom: 8px;
    }
    .dark-theme .no-alerts {
      color: #b0bec5;
    }
    .dark-theme .no-alerts-icon {
      color: #90caf9;
    }
    @media (max-width: 900px) {
      .alerts-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      .alerts-list {
        gap: 12px;
      }
      .alert-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 6px;
      }
      mat-card-actions {
        flex-direction: column;
        gap: 8px;
        padding: 0 10px 12px 10px;
      }
    }
    @media (max-width: 600px) {
      .alerts-container {
        padding: 10px;
      }
      .header-content h1 {
        font-size: 1.5rem;
      }
      .alert-title {
        font-size: 1.1rem;
      }
      .alert-card {
        padding-bottom: 0;
      }
    }
  `]
})
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  loading = true;
  error: string | null = null;
  comments: { [key: string]: any[] } = {};

  constructor(
    public authService: AuthService,
    private firebaseService: FirebaseService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAlerts();
  }

  async loadAlerts() {
    try {
      this.loading = true;
      this.error = null;
      this.alerts = await this.firebaseService.getAlerts();
      this.filteredAlerts = [...this.alerts];
      
      // Load comments for each alert
      for (const alert of this.alerts) {
        if (alert.id) {
          this.comments[alert.id] = await this.firebaseService.getComments(alert.id);
        }
      }
    } catch (error) {
      console.error('Error loading alerts:', error);
      this.snackBar.open('Failed to load alerts. Please try again.', 'Close', {
        duration: 5000
      });
    } finally {
      this.loading = false;
    }
  }

  onFilterChange(filters: {
    search: string;
    type: string;
    severity: string;
    sortBy: string;
  }) {
    this.filteredAlerts = this.alerts.filter(alert => {
      const matchesSearch = !filters.search || 
        alert.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        alert.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        alert.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesType = !filters.type || alert.type === filters.type;
      const matchesSeverity = !filters.severity || alert.severity === filters.severity;

      return matchesSearch && matchesType && matchesSeverity;
    });

    // Sort alerts
    this.filteredAlerts.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date-desc':
          return b.startTime.getTime() - a.startTime.getTime();
        case 'date-asc':
          return a.startTime.getTime() - b.startTime.getTime();
        case 'severity-desc':
          return this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity);
        case 'severity-asc':
          return this.getSeverityWeight(a.severity) - this.getSeverityWeight(b.severity);
        default:
          return 0;
      }
    });
  }

  getSeverityWeight(severity: string): number {
    const weights: { [key: string]: number } = {
      extreme: 4,
      severe: 3,
      moderate: 2,
      minor: 1
    };
    return weights[severity] || 0;
  }

  getSeverityColor(severity: string): string {
    const colors: { [key: string]: string } = {
      extreme: 'warn',
      severe: 'accent',
      moderate: 'primary',
      minor: 'basic'
    };
    return colors[severity] || 'basic';
  }

  openNewAlertDialog() {
    const dialogRef = this.dialog.open(NewAlertDialogComponent, {
      width: '600px',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
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

    if (!this.authService.isLoggedIn()) {
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

  async onDeleteAlert(alertId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Alert',
        message: 'Are you sure you want to delete this alert? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.firebaseService.deleteAlert(alertId);
          this.alerts = this.alerts.filter(a => a.id !== alertId);
          this.filteredAlerts = this.filteredAlerts.filter(a => a.id !== alertId);
          this.snackBar.open('Alert deleted successfully', 'Close', {
            duration: 3000
          });
        } catch (error) {
          console.error('Error deleting alert:', error);
          this.snackBar.open('Failed to delete alert. Please try again.', 'Close', {
            duration: 5000
          });
        }
      }
    });
  }

  async onAddComment(alertId: string, content: string) {
    if (!this.authService.isLoggedIn()) {
      this.snackBar.open('Please sign in to comment', 'Sign In', {
        duration: 5000
      }).onAction().subscribe(() => {
        this.router.navigate(['/login'], {
          queryParams: {
            returnUrl: '/alerts',
            message: 'Please sign in to comment on alerts'
          }
        });
      });
      return;
    }

    try {
      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('No user found');
      }

      await this.firebaseService.addComment(alertId, {
        alertId,
        userId: currentUser.uid,
        userName: currentUser.displayName || 'Anonymous',
        content
      });

      // Refresh comments
      this.comments[alertId] = await this.firebaseService.getComments(alertId);
      this.snackBar.open('Comment added successfully', 'Close', {
        duration: 3000
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      this.snackBar.open('Failed to add comment', 'Close', {
        duration: 5000
      });
    }
  }

  async onDeleteComment(alertId: string, commentId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment? This action cannot be undone.'
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.firebaseService.deleteComment(alertId, commentId);
          this.comments[alertId] = await this.firebaseService.getComments(alertId);
          this.snackBar.open('Comment deleted successfully', 'Close', {
            duration: 3000
          });
        } catch (error) {
          console.error('Error deleting comment:', error);
          this.snackBar.open('Failed to delete comment', 'Close', {
            duration: 5000
          });
        }
      }
    });
  }
} 