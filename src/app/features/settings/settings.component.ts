import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface UserSettings {
  location: string;
  units: 'metric' | 'imperial';
  darkMode: boolean;
  highContrast: boolean;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
    FormsModule,
    MatDividerModule,
  ],
  template: `
    <div class="settings-container">
      <mat-card class="settings-card" [class.dark-theme]="(isDarkMode$ | async)">
        <mat-card-content>
          <div class="settings-header">
            <h2 class="settings-title">User Settings</h2>
            <p class="settings-subtitle">Manage your preferences</p>
          </div>
          <mat-divider class="settings-divider"></mat-divider>
          <form class="settings-form" (ngSubmit)="saveSettings()">
            <mat-form-field appearance="outline" class="settings-field">
              <mat-label>Default Location</mat-label>
              <input matInput [(ngModel)]="settings.location" name="location" placeholder="Enter city name">
            </mat-form-field>

            <mat-form-field appearance="outline" class="settings-field">
              <mat-label>Units</mat-label>
              <mat-select [(ngModel)]="settings.units" name="units">
                <mat-option value="metric">Metric (°C, km/h)</mat-option>
                <mat-option value="imperial">Imperial (°F, mph)</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="settings-toggles">
              <mat-slide-toggle [(ngModel)]="settings.darkMode" name="darkMode" (change)="onThemeChange()">
                Dark Mode
              </mat-slide-toggle>
              <mat-slide-toggle [(ngModel)]="settings.highContrast" name="highContrast">
                High Contrast Mode
              </mat-slide-toggle>
            </div>

            <div class="settings-actions">
              <button mat-raised-button color="primary" type="submit" class="save-button">
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 500px;
      margin: 40px auto;
      padding: 0 16px;
    }
    .settings-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 20px rgba(30, 64, 175, 0.10);
      color: #222;
      font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
      padding: 32px 28px 24px 28px;
      transition: background 0.3s, color 0.3s;
    }
    .dark-theme.settings-card {
      background: #232a34;
      color: #f4f6fb;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    .settings-header {
      margin-bottom: 8px;
      text-align: left;
    }
    .settings-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 2px 0;
      color: #1976d2;
    }
    .dark-theme .settings-title {
      color: #90caf9;
    }
    .settings-subtitle {
      font-size: 1.1rem;
      color: #666;
      margin: 0 0 8px 0;
      font-weight: 500;
    }
    .dark-theme .settings-subtitle {
      color: #b0bec5;
    }
    .settings-divider {
      margin-bottom: 18px;
    }
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 22px;
    }
    .settings-field {
      width: 100%;
    }
    .settings-toggles {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin-bottom: 8px;
    }
    .settings-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 8px;
    }
    .save-button {
      border-radius: 999px;
      font-weight: 600;
      font-size: 1rem;
      padding: 8px 28px;
      box-shadow: 0 2px 8px rgba(30, 64, 175, 0.08);
      transition: background 0.2s, color 0.2s;
    }
    @media (max-width: 600px) {
      .settings-card {
        padding: 18px 6px 12px 6px;
      }
      .settings-title {
        font-size: 1.3rem;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    location: 'Washington, USA',
    units: 'imperial',
    darkMode: false,
    highContrast: false,
  };
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    // Subscribe to theme changes to update settings
    this.isDarkMode$.subscribe(isDark => {
      this.settings.darkMode = isDark;
    });
    // Load settings from Firestore if authenticated, else from localStorage
    const user = this.authService.getCurrentUser();
    if (user) {
      const cloudSettings = await this.firebaseService.getUserSettings(user.uid);
      if (cloudSettings) {
        this.settings = { ...this.settings, ...cloudSettings };
      }
    } else {
      const local = localStorage.getItem('userSettings');
      if (local) {
        this.settings = { ...this.settings, ...JSON.parse(local) };
      }
    }
  }

  onThemeChange() {
    this.themeService.toggleTheme();
  }

  async saveSettings() {
    const user = this.authService.getCurrentUser();
    if (user) {
      await this.firebaseService.setUserSettings(user.uid, this.settings);
      this.snackBar.open('Settings saved to your account!', 'Close', { duration: 3000 });
    } else {
      localStorage.setItem('userSettings', JSON.stringify(this.settings));
      this.snackBar.open('Settings saved locally!', 'Close', { duration: 3000 });
    }
  }
} 