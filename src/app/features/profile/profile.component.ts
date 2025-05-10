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

    .email {
      color: #666;
      margin: 4px 0 0;
    }

    .alerts-list, .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 16px 0;
    }

    .alert-card {
      margin-bottom: 16px;
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

    .location mat-icon {
      font-size: 16px;
      margin-right: 4px;
    }

    .activity-card {
      margin-bottom: 16px;
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

    .activity-time {
      color: #666;
      font-size: 14px;
      margin-left: auto;
    }

    .no-alerts, .no-activity {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 32px;
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
        this.userAlerts = await this.firebaseService.getUserAlerts(currentUser.uid);
        this.userActivity = await this.firebaseService.getUserActivity(currentUser.uid);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      this.loading = false;
    }
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
    // Implement edit alert logic
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