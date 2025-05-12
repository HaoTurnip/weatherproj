import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { Comment } from '../../core/models/alert.model';

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
          <p class="subtitle">Stay informed about severe weather conditions</p>
        </div>
        @if (authService.isLoggedIn()) {
          <button mat-raised-button color="primary" (click)="openNewAlertDialog()" class="create-alert-btn">
            <mat-icon>add_circle</mat-icon>
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
          <p>There are currently no active weather alerts .</p>
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
                    <mat-icon>place</mat-icon>
                    <span>{{ alert.location }}</span>
                  </div>
                  <div class="detail-item">
                    <mat-icon>access_time</mat-icon>
                    <span>{{ formatDateRange(alert.startTime, alert.endTime) }}</span>
                  </div>
                </div>

                <div class="alert-stats">
                  <div class="stat-item">
                    <mat-icon>thumb_up</mat-icon>
                    <span>{{ alert.upvotes || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <mat-icon>thumb_down</mat-icon>
                    <span>{{ alert.downvotes || 0 }}</span>
                  </div>
                  <div class="stat-item">
                    <mat-icon>chat</mat-icon>
                    <span>{{ comments[alert.id!] ? comments[alert.id!].length : 0 }}</span>
                  </div>
                </div>

                <ng-container *ngIf="alert.id && showComments[alert.id!]">
                  <ng-container *ngIf="authService.user$ | async as user; else commentCardLoggedOut">
                    <app-comment-card
                      [comments]="comments[alert.id] || []"
                      [currentUserId]="user.uid"
                      [isAuthenticated]="!!user"
                      (addComment)="onAddComment(alert.id!, $event)"
                      (deleteComment)="onDeleteComment(alert.id!, $event)"
                    />
                  </ng-container>
                  <ng-template #commentCardLoggedOut>
                    <app-comment-card
                      [comments]="comments[alert.id] || []"
                      [currentUserId]="''"
                      [isAuthenticated]="false"
                      (addComment)="onAddComment(alert.id!, $event)"
                      (deleteComment)="onDeleteComment(alert.id!, $event)"
                    />
                  </ng-template>
                </ng-container>
              </mat-card-content>

              <mat-card-actions>
                <button mat-button color="primary" (click)="vote(alert.id!, 'up')" [disabled]="!authService.isLoggedIn() || !alert.id">
                  <mat-icon>thumb_up</mat-icon>
                  Upvote
                </button>
                <button mat-button color="warn" (click)="vote(alert.id!, 'down')" [disabled]="!authService.isLoggedIn() || !alert.id">
                  <mat-icon>thumb_down</mat-icon>
                  Downvote
                </button>
                <button mat-button class="comments-btn" (click)="toggleComments(alert.id!)" [disabled]="!alert.id">
                  <mat-icon>{{ showComments[alert.id!] ? 'comment_off' : 'comment' }}</mat-icon>
                  {{ showComments[alert.id!] ? 'Hide Comments' : 'Show Comments' }}
                </button>
                @if (authService.isLoggedIn() && alert.userId === authService.getCurrentUser()?.uid) {
                  <button mat-button color="warn" (click)="onDeleteAlert(alert.id!)">
                    <mat-icon>delete_outline</mat-icon>
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
    :host-context(.dark-theme) .alerts-header {
      border-bottom: 1px solid #333a4d;
    }

    .header-content h1 {
      margin: 0;
      font-size: 2.5rem;
      color: #1a237e;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    :host-context(.dark-theme) .header-content h1 {
      color: #f8fafc;
    }

    .subtitle {
      margin: 8px 0 0;
      color: #666;
      font-size: 1.1rem;
      font-weight: 500;
    }
    :host-context(.dark-theme) .subtitle {
      color: #cbd5e1;
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
    :host-context(.dark-theme) .alert-card {
      background: #1e293b;
      color: #f8fafc;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    :host-context(.dark-theme) .alert-card.active {
      border-left: 5px solid #f59e0b;
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
      background: #d32f2f ;
      color: #fff ;
    }
    :host-context(.dark-theme) .alert-severity mat-chip[ng-reflect-color="warn"],
    :host-context(.dark-theme) .alert-severity mat-chip.severity-extreme {
      background: #ff5252 ;
      color: #fff ;
    }
    .alert-severity mat-chip[ng-reflect-color="accent"],
    .alert-severity mat-chip.severity-severe {
      background: #f57c00 ;
      color: #fff ;
      border-radius: 20px ;
      padding: 2px 12px ;
      font-weight: 600 ;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) ;
    }
    :host-context(.dark-theme) .alert-severity mat-chip[ng-reflect-color="accent"],
    :host-context(.dark-theme) .alert-severity mat-chip.severity-severe {
      background: #ffb300 ;
      color: #232a34 ;
      border-radius: 20px ;
      padding: 2px 12px ;
      font-weight: 600 ;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2) ;
    }
    .alert-severity mat-chip[ng-reflect-color="primary"],
    .alert-severity mat-chip.severity-moderate {
      background: #1976d2 ;
      color: #fff ;
    }
    :host-context(.dark-theme) .alert-severity mat-chip[ng-reflect-color="primary"],
    :host-context(.dark-theme) .alert-severity mat-chip.severity-moderate {
      background: #90caf9 ;
      color: #232a34 ;
    }
    .alert-severity mat-chip[ng-reflect-color="basic"],
    .alert-severity mat-chip.severity-minor {
      background: #388e3c ;
      color: #fff ;
    }
    :host-context(.dark-theme) .alert-severity mat-chip[ng-reflect-color="basic"],
    :host-context(.dark-theme) .alert-severity mat-chip.severity-minor {
      background: #81c784 ;
      color: #232a34 ;
    }

    .alert-title {
      margin: 0 0 8px 0;
      font-size: 1.3rem;
      font-weight: 600;
      color: #1e293b;
    }
    :host-context(.dark-theme) .alert-title {
      color: #f8fafc;
    }

    .alert-description {
      margin: 0 0 16px 0;
      color: #475569;
      line-height: 1.5;
    }
    :host-context(.dark-theme) .alert-description {
      color: #cbd5e1;
    }

    .alert-details {
      display: flex;
      gap: 18px;
      margin: 10px 0 8px 0;
      color: #64748b;
      font-size: 1.05rem;
      font-weight: 500;
    }
    .alert-details .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 0;
    }
    :host-context(.dark-theme) .alert-details {
      color: #94a3b8;
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
    :host-context(.dark-theme) .alert-stats {
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
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 36px;
    }
    mat-card-actions button mat-icon {
      font-size: 18px;
      height: 18px;
      width: 18px;
      margin-right: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :host-context(.dark-theme) mat-card-actions button {
      background: #232a34;
      color: #ffb74d;
      border: 1.5px solid #ffb74d;
    }

    /* Comments button specific styles */
    mat-card-actions button.comments-btn {
      position: relative;
      overflow: hidden;
    }
    
    mat-card-actions button.comments-btn::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(255,255,255,0.1);
      top: 0;
      left: -100%;
      transition: all 0.3s ease;
    }
    
    mat-card-actions button.comments-btn:hover::after {
      left: 0;
    }

    /* Comment section transition */
    app-comment-card {
      display: block;
      animation: slideDown 0.3s ease-out;
      margin-top: 16px;
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
    }

    :host-context(.dark-theme) app-comment-card {
      border-top: 1px solid #333a4d;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .no-alerts {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 48px 24px;
      background: #fff;
      border-radius: 18px;
      margin-top: 24px;
    }
    :host-context(.dark-theme) .no-alerts {
      background: #1e293b;
    }

    .no-alerts-icon {
      font-size: 48px;
      color: #cbd5e1;
      margin-bottom: 16px;
    }
    :host-context(.dark-theme) .no-alerts-icon {
      color: #64748b;
    }

    .no-alerts h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #1e293b;
    }
    :host-context(.dark-theme) .no-alerts h2 {
      color: #f8fafc;
    }

    .no-alerts p {
      color: #64748b;
      margin-bottom: 24px;
      max-width: 500px;
    }
    :host-context(.dark-theme) .no-alerts p {
      color: #94a3b8;
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

    /* Global icon styling */
    mat-icon {
      font-family: 'Material Icons';
      font-weight: normal;
      font-style: normal;
      font-size: 24px;
      line-height: 1;
      letter-spacing: normal;
      text-transform: none;
      display: inline-block;
      white-space: nowrap;
      word-wrap: normal;
      direction: ltr;
      -webkit-font-feature-settings: 'liga';
      -webkit-font-smoothing: antialiased;
    }

    .detail-item mat-icon,
    .stat-item mat-icon,
    .alert-type mat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `]
})
export class AlertsComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  loading = true;
  error: string | null = null;
  comments: { [key: string]: Comment[] } = {};
  private commentSubscriptions: { [key: string]: Subscription } = {};
  showComments: { [key: string]: boolean } = {}; // Track which alerts have expanded comments

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

  ngOnDestroy() {
    // Clean up all comment subscriptions
    Object.values(this.commentSubscriptions).forEach(sub => sub.unsubscribe());
  }

  async loadAlerts() {
    try {
      this.loading = true;
      this.error = null;
      this.alerts = await this.firebaseService.getAlerts();
      this.filteredAlerts = [...this.alerts];

      // Initialize showComments for all alerts to false
      this.alerts.forEach(alert => {
        if (alert.id) {
          this.showComments[alert.id] = false;
        }
      });

      // Only load comments if authenticated
      if (this.authService.isLoggedIn()) {
        // Clean up existing subscriptions
        Object.values(this.commentSubscriptions).forEach(sub => sub.unsubscribe());
        this.commentSubscriptions = {};

        // Set up real-time listeners for each alert's comments
        for (const alert of this.alerts) {
          if (alert.id) {
            this.commentSubscriptions[alert.id] = this.firebaseService.getComments(alert.id)
              .subscribe(comments => {
                this.comments[alert.id!] = comments;
              });
          }
        }
      } else {
        this.comments = {}; // Clear comments if not authenticated
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

  onFilterChange(filters: any) {
    if (!filters) {
      this.filteredAlerts = [...this.alerts];
      return;
    }

    let result = [...this.alerts];

    // Filter by search query (title or description)
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(alert => 
        alert.title.toLowerCase().includes(query) || 
        alert.description.toLowerCase().includes(query)
      );
    }

    // Filter by type
    if (filters.selectedType) {
      result = result.filter(alert => alert.type === filters.selectedType);
    }

    // Filter by severity
    if (filters.selectedSeverity) {
      result = result.filter(alert => alert.severity === filters.selectedSeverity);
    }

    // Sort results
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'date-desc':
          result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          break;
        case 'date-asc':
          result.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB;
          });
          break;
        case 'severity-desc':
          result.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity));
          break;
        case 'severity-asc':
          result.sort((a, b) => this.getSeverityWeight(a.severity) - this.getSeverityWeight(b.severity));
          break;
      }
    }

    this.filteredAlerts = result;
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

  getWeatherIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'Thunderstorm': 'flash_on',
      'Rain': 'opacity',
      'Snow': 'ac_unit',
      'Fog': 'cloud',
      'Wind': 'air',
      'Heat': 'wb_sunny',
      'Cold': 'ac_unit',
      'Flood': 'waves'
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

  toggleComments(alertId: string) {
    this.showComments[alertId] = !this.showComments[alertId];
  }

  isAlertOwner(alert: Alert): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!currentUser && alert.userId === currentUser.uid;
  }
} 