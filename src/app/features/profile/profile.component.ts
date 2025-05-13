import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { Alert } from '../../core/models/alert.model';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatDividerModule,
    SkeletonLoaderComponent
  ],
  template: `
    <div class="profile-container">
      @if (loading) {
        <app-skeleton-loader [lines]="[100, 80, 60, 40]" />
      } @else {
        <mat-card class="profile-card">
          <mat-card-header>
            <div class="profile-header">
              <div class="user-info">
                <h1>{{ user?.displayName || 'User Profile' }}</h1>
                <p class="email">{{ user?.email }}</p>
              </div>
              <button mat-raised-button color="primary" (click)="onSignOut()">
                <mat-icon>logout</mat-icon>
                Sign Out
              </button>
            </div>
          </mat-card-header>

          <mat-card-content>
            <mat-tab-group>
              <mat-tab label="My Alerts">
                <div class="alerts-list">
                  @for (alert of userAlerts; track alert.id) {
                    <mat-card class="alert-card">
                      <mat-card-header>
                        <mat-card-title>{{ alert.title }}</mat-card-title>
                        <mat-card-subtitle>
                          {{ alert.startTime | date:'medium' }}
                        </mat-card-subtitle>
                      </mat-card-header>
                      <mat-card-content>
                        <p>{{ alert.description }}</p>
                        <div class="alert-meta">
                          <mat-chip color="primary" selected>
                            {{ alert.type }}
                          </mat-chip>
                          <mat-chip [color]="getSeverityColor(alert.severity)" selected>
                            {{ alert.severity }}
                          </mat-chip>
                          <span class="location">
                            <mat-icon>location_on</mat-icon>
                            {{ alert.location }}
                          </span>
                        </div>
                      </mat-card-content>
                      <mat-card-actions>
                        <button mat-button color="primary" (click)="onEditAlert(alert)">
                          <mat-icon>edit</mat-icon>
                          Edit
                        </button>
                        @if (alert.id) {
                          <button mat-button color="warn" (click)="onDeleteAlert(alert.id)">
                            <mat-icon>delete</mat-icon>
                            Delete
                          </button>
                        }
                      </mat-card-actions>
                    </mat-card>
                  }
                  @if (userAlerts.length === 0) {
                    <p class="no-alerts">You haven't created any alerts yet.</p>
                  }
                </div>
              </mat-tab>

              <mat-tab label="Activity">
                <div class="activity-list">
                  @for (activity of userActivity; track activity.id) {
                    <mat-card class="activity-card">
                      <mat-card-content>
                        <div class="activity-header">
                          <mat-icon>{{ getActivityIcon(activity.type) }}</mat-icon>
                          <span class="activity-type">{{ activity.type }}</span>
                          <span class="activity-time">{{ activity.timestamp | date:'medium' }}</span>
                        </div>
                        <p>{{ activity.description }}</p>
                      </mat-card-content>
                    </mat-card>
                  }
                  @if (userActivity.length === 0) {
                    <p class="no-activity">No recent activity.</p>
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 24px;
    }

    .profile-card {
      margin-bottom: 24px;
      background: var(--card-light, #f8fafc);
      border: 1px solid var(--border-light, #e2e8f0);
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      transition: all 0.3s ease;
    }

    :host-context(.dark-theme) .profile-card {
      background: var(--card-dark, #1e293b);
      color: var(--text-primary-dark, #f8fafc);
      border-color: var(--border-dark, #334155);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 16px;
    }

    .user-info h1 {
      margin: 0;
      font-size: 24px;
      color: #333;
    }

    :host-context(.dark-theme) .user-info h1 {
      color: #f8fafc;
    }

    .email {
      color: #666;
      margin: 4px 0 0;
    }

    :host-context(.dark-theme) .email {
      color: #b0bec5;
    }

    .alerts-list, .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .alert-card {
      margin-bottom: 16px;
      background: var(--card-light, #f8fafc);
      border: 1px solid var(--border-light, #e2e8f0);
      border-radius: 8px;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      transition: all 0.3s ease;
    }

    :host-context(.dark-theme) .alert-card {
      background: #232a34;
      color: #f4f6fb;
      border: 1px solid #2d3440;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    .alert-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-top: 16px;
    }

    .location {
      display: flex;
      align-items: center;
      color: #666;
      font-size: 14px;
    }

    :host-context(.dark-theme) .location {
      color: #b0bec5;
    }

    .location mat-icon {
      font-size: 16px;
      margin-right: 4px;
    }

    .activity-card {
      margin-bottom: 16px;
      background: var(--card-light, #f8fafc);
      border: 1px solid var(--border-light, #e2e8f0);
      border-radius: 8px;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      transition: all 0.3s ease;
    }
    
    :host-context(.dark-theme) .activity-card {
      background: #232a34;
      color: #f4f6fb;
      border: 1px solid #2d3440;
      box-shadow: 0 2px 8px rgba(0,0,0,0.25);
    }

    .activity-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .activity-type {
      font-weight: 500;
      color: #1976d2;
    }
    
    :host-context(.dark-theme) .activity-type {
      color: #90caf9;
    }

    .activity-time {
      color: #666;
      font-size: 14px;
      margin-left: auto;
    }
    
    :host-context(.dark-theme) .activity-time {
      color: #b0bec5;
    }

    .no-alerts, .no-activity {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 32px;
    }
    
    :host-context(.dark-theme) .no-alerts,
    :host-context(.dark-theme) .no-activity {
      color: #b0bec5;
    }

    /* Custom Search/Input Styles */
    .search-field-wrapper {
      display: flex;
      align-items: center;
      background: var(--card-light, #f8fafc);
      border: 1px solid var(--border-light, #e2e8f0);
      border-radius: var(--radius-full, 9999px);
      padding: 0.5rem 0.875rem;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      margin: 0.75rem 0;
      width: 100%;
    }

    .search-field-wrapper:focus-within {
      border-color: var(--primary-color, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }

    :host-context(.dark-theme) .search-field-wrapper {
      background: var(--card-dark, #1e293b);
      border-color: var(--border-dark, #334155);
    }

    :host-context(.dark-theme) .search-field-wrapper:focus-within {
      border-color: var(--primary-light, #60a5fa);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }

    .search-icon {
      color: var(--text-tertiary, #64748b);
      margin-right: 0.5rem;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    :host-context(.dark-theme) .search-icon {
      color: var(--text-tertiary-dark, #94a3b8);
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.9rem;
      color: var(--text-primary, #334155);
      padding: 0.4rem 0;
      font-family: inherit;
      width: 100%;
    }

    :host-context(.dark-theme) .search-input {
      color: var(--text-primary-dark, #f8fafc);
    }

    .search-input::placeholder {
      color: var(--text-tertiary, #64748b);
    }

    :host-context(.dark-theme) .search-input::placeholder {
      color: var(--text-tertiary-dark, #94a3b8);
    }

    /* Custom Chip styling */
    :host-context(.dark-theme) .mat-mdc-chip {
      background-color: rgba(255, 255, 255, 0.1);
    }

    :host-context(.dark-theme) .mat-mdc-chip.mat-primary {
      background-color: rgba(25, 118, 210, 0.5);
    }

    :host-context(.dark-theme) .mat-mdc-chip.mat-accent {
      background-color: rgba(255, 64, 129, 0.5);
    }

    :host-context(.dark-theme) .mat-mdc-chip.mat-warn {
      background-color: rgba(244, 67, 54, 0.5);
    }

    /* Button styling */
    button[mat-raised-button][color="primary"] {
      background-color: var(--primary-color, #3b82f6);
    }

    :host-context(.dark-theme) button[mat-raised-button][color="primary"] {
      background-color: var(--primary-light, #60a5fa);
    }

    :host-context(.dark-theme) button[mat-button][color="primary"] {
      color: var(--primary-light, #60a5fa);
    }

    :host-context(.dark-theme) button[mat-button][color="warn"] {
      color: #ff8a65;
    }

    /* Tab styling */
    :host-context(.dark-theme) .mat-mdc-tab-header {
      background-color: rgba(30, 41, 59, 0.8);
    }

    :host-context(.dark-theme) .mat-mdc-tab-label-content {
      color: #f8fafc;
    }

    @media (max-width: 600px) {
      .profile-container {
        padding: 16px;
      }

      .profile-header {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .alert-meta {
        flex-wrap: wrap;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: any;
  userAlerts: Alert[] = [];
  userActivity: any[] = [];
  loading = true;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {
    this.loadUserData();
  }

  async loadUserData() {
    try {
      this.loading = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (currentUser) {
        this.user = currentUser;
        this.userAlerts = (await this.firebaseService.getUserAlerts(currentUser.uid)).map(alert => ({
          ...alert,
          startTime: this.isFirestoreTimestamp(alert.startTime) ? alert.startTime.toDate() : alert.startTime,
          endTime: this.isFirestoreTimestamp(alert.endTime) ? alert.endTime.toDate() : alert.endTime,
          createdAt: this.isFirestoreTimestamp(alert.createdAt) ? alert.createdAt.toDate() : alert.createdAt,
          updatedAt: this.isFirestoreTimestamp(alert.updatedAt) ? alert.updatedAt.toDate() : alert.updatedAt
        }));
        this.userActivity = (await this.firebaseService.getUserActivity(currentUser.uid)).map(activity => ({
          ...activity,
          timestamp: this.isFirestoreTimestamp(activity.timestamp) ? activity.timestamp.toDate() : activity.timestamp
        }));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.loading = false;
    }
  }

  isFirestoreTimestamp(obj: any): obj is { toDate: () => Date } {
    return obj && typeof obj === 'object' && typeof obj.toDate === 'function';
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

  getActivityIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'alert_created': 'add_alert',
      'alert_edited': 'edit',
      'alert_deleted': 'delete',
      'comment_added': 'comment',
      'profile_updated': 'person'
    };
    return icons[type] || 'info';
  }

  async onSignOut() {
    try {
      await this.authService.signOut();
      // Navigate to home or login page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }

  onEditAlert(alert: Alert) {
    // TODO: Do this at some point???
  }

  async onDeleteAlert(alertId: string) {
    try {
      await this.firebaseService.deleteAlert(alertId);
      this.userAlerts = this.userAlerts.filter(a => a.id !== alertId);
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  }
} 