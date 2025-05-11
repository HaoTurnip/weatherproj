import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { Observable, firstValueFrom, filter } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { WeatherService } from '../../core/services/weather.service';
import { CityService } from '../../services/city.service';

interface UserSettings {
  location: string;
  units: 'metric' | 'imperial';
  darkMode: boolean;
  highContrast: boolean;
  defaultCity?: string;
  notifications: boolean;
  language: string;
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
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div *ngIf="userName" class="greeting">Hello, {{ userName }}!</div>
    <div class="settings-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>User Settings</mat-card-title>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="saveSettings()" #settingsForm="ngForm">
            <!-- Location Settings -->
            <div class="settings-section">
              <h3>Location Settings</h3>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Default Location</mat-label>
                <input
                  matInput
                  [(ngModel)]="settings.defaultCity"
                  name="defaultCity"
                  placeholder="Enter your default city"
                  required
                />
                <mat-icon matSuffix>location_on</mat-icon>
              </mat-form-field>
            </div>

            <mat-divider></mat-divider>

            <!-- Units Settings -->
            <div class="settings-section">
              <h3>Units</h3>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Temperature Unit</mat-label>
                <mat-select [(ngModel)]="settings.units" name="units">
                  <mat-option value="metric">Celsius (°C)</mat-option>
                  <mat-option value="imperial">Fahrenheit (°F)</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-divider></mat-divider>

            <!-- Appearance Settings -->
            <div class="settings-section">
              <h3>Appearance</h3>
              <mat-slide-toggle
                [(ngModel)]="settings.darkMode"
                name="darkMode"
                (change)="onThemeChange()"
              >
                Dark Mode
              </mat-slide-toggle>

              <mat-slide-toggle
                [(ngModel)]="settings.highContrast"
                name="highContrast"
              >
                High Contrast
              </mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <!-- Notifications -->
            <div class="settings-section">
              <h3>Notifications</h3>
              <mat-slide-toggle
                [(ngModel)]="settings.notifications"
                name="notifications"
              >
                Enable Weather Alerts
              </mat-slide-toggle>
            </div>

            <mat-divider></mat-divider>

            <!-- Language -->
            <div class="settings-section">
              <h3>Language</h3>
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Language</mat-label>
                <mat-select [(ngModel)]="settings.language" name="language">
                  <mat-option value="en">English</mat-option>
                  <mat-option value="es">Español</mat-option>
                  <mat-option value="fr">Français</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="settings-actions">
              <button
                mat-raised-button
                color="primary"
                type="submit"
                [disabled]="!settingsForm.form.valid"
              >
                Save Settings
              </button>
              <button
                mat-button
                type="button"
                (click)="resetSettings()"
              >
                Reset to Default
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .settings-section {
      margin: 1.5rem 0;
    }

    .settings-section h3 {
      margin-bottom: 1rem;
      color: #333;
    }

    .full-width {
      width: 100%;
    }

    .settings-actions {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
    }

    mat-divider {
      margin: 1.5rem 0;
    }

    mat-slide-toggle {
      display: block;
      margin: 1rem 0;
    }

    .greeting { font-size: 1.2rem; font-weight: 500; margin-bottom: 1rem; color: #2c3e50; }
  `]
})
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    location: '',
    units: 'metric',
    darkMode: false,
    highContrast: false,
    defaultCity: '',
    notifications: true,
    language: 'en'
  };
  isDarkMode$ = this.themeService.isDarkMode$;
  userName: string | null = null;

  constructor(
    private themeService: ThemeService,
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private weatherService: WeatherService,
    private cityService: CityService,
    private snackBar: MatSnackBar
  ) {}

  async ngOnInit() {
    // Subscribe to theme changes
    this.isDarkMode$.subscribe(isDark => {
      this.settings.darkMode = isDark;
    });

    // Wait for the first non-null user
    const user = await firstValueFrom(this.authService.user$.pipe(filter(u => !!u)));
    if (user) {
      this.userName = user.displayName || user.email || null;
      const cloudSettings = await this.firebaseService.getUserSettings(user.uid);
      if (cloudSettings) {
        this.settings = { ...this.settings, ...cloudSettings };
        this.weatherService.updateSettings(this.settings);
        if (this.settings.defaultCity) {
          this.cityService.updateDefaultCity(this.settings.defaultCity);
        }
      }
    } else {
      // Load from localStorage if not authenticated
      const local = localStorage.getItem('userSettings');
      if (local) {
        this.settings = { ...this.settings, ...JSON.parse(local) };
        this.weatherService.updateSettings(this.settings);
        if (this.settings.defaultCity) {
          this.cityService.updateDefaultCity(this.settings.defaultCity);
        }
      }
    }
  }

  onThemeChange() {
    this.themeService.toggleTheme();
  }

  async saveSettings() {
    console.log('saveSettings called');
    try {
      const user = await firstValueFrom(this.authService.user$.pipe(filter(u => !!u)));
      console.log('User in saveSettings:', user);
      if (user) {
        try {
          console.log('Saving to Firebase:', this.settings);
          await this.firebaseService.setUserSettings(user.uid, this.settings);
          console.log('Saved to Firebase');
          this.snackBar.open('Settings saved to your account!', 'Close', { duration: 3000 });
        } catch (firebaseError) {
          console.error('Error saving to Firebase:', firebaseError);
          this.snackBar.open('Error saving to Firebase. Please try again.', 'Close', { duration: 3000 });
        }
      } else {
        try {
          console.log('Saving to localStorage:', this.settings);
          localStorage.setItem('userSettings', JSON.stringify(this.settings));
          this.snackBar.open('Settings saved locally!', 'Close', { duration: 3000 });
        } catch (localError) {
          console.error('Error saving to localStorage:', localError);
          this.snackBar.open('Error saving to localStorage. Please try again.', 'Close', { duration: 3000 });
        }
      }

      // Update weather service with new settings
      this.weatherService.updateSettings(this.settings);
      // Update city service if default city is set
      if (this.settings.defaultCity) {
        this.cityService.updateDefaultCity(this.settings.defaultCity);
      }
    } catch (error) {
      console.error('Error in saveSettings (outer catch):', error);
      this.snackBar.open('Error saving settings. Please try again.', 'Close', { duration: 3000 });
    }
  }

  resetSettings() {
    this.settings = {
      location: '',
      units: 'metric',
      darkMode: false,
      highContrast: false,
      defaultCity: '',
      notifications: true,
      language: 'en'
    };
    this.weatherService.updateSettings(this.settings);
  }
} 