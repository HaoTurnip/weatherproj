import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../core/services/theme.service';
import { Observable, firstValueFrom, filter } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { WeatherService } from '../../core/services/weather.service';
import { CityService } from '../../services/city.service';

interface UserSettings {
  location: string;
  units: 'metric' | 'imperial';
  defaultCity?: string;
  notifications: boolean;
  temperatureUnit: 'celsius' | 'fahrenheit';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatSlideToggleModule,
    MatButtonModule,
    FormsModule,
    MatDividerModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="settings-container">
      <mat-card class="settings-card">
        <mat-card-header>
          <mat-card-title>Settings</mat-card-title>
          <div class="greeting" *ngIf="userName">Welcome, {{userName}}!</div>
        </mat-card-header>

        <mat-card-content>
          <form (ngSubmit)="saveSettings()" #settingsForm="ngForm">
            <!-- Location Settings -->
            <div class="settings-section">
              <h3>Location Settings</h3>
              <div class="search-field-wrapper">
                <span class="search-icon">
                  <mat-icon>location_on</mat-icon>
                </span>
                <input
                  class="search-input"
                  [(ngModel)]="settings.defaultCity"
                  name="defaultCity"
                  placeholder="Enter your default city"
                />
              </div>
            </div>

            <!-- Units Settings -->
            <div class="settings-section">
              <h3>Units</h3>
              <div class="search-field-wrapper">
                <span class="search-icon">
                  <mat-icon>thermostat</mat-icon>
                </span>
                <select 
                  class="search-input" 
                  [(ngModel)]="settings.units" 
                  name="units"
                >
                  <option value="metric">Celsius (°C)</option>
                  <option value="imperial">Fahrenheit (°F)</option>
                </select>
              </div>
            </div>

            <mat-divider></mat-divider>

            <!-- Notifications -->
            <div class="settings-section">
              <h3>Notifications</h3>
              <mat-slide-toggle
                [(ngModel)]="settings.notifications"
                name="notifications"
              >
                <span class="toggle-description">Enable Weather Alerts (<--this doesn't actually send notifications - just use it as a fidget toy?)</span>
              </mat-slide-toggle>
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
                class="reset-button"
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
      color: #7c8bba;
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

    .greeting {
      font-size: 1.2rem;
      font-weight: 500;
      margin-bottom: 1rem;
      margin-left: 1rem;
      color: #7c8bba;
    }

    /* Custom Search/Input Styles */
    .search-container {
      flex: 0 1 350px;
      margin: 0 auto;
      padding: 0;
      display: flex;
      justify-content: center;
      position: absolute;
      left: 50%;
      transform: translateX(-54%);
    }

    .search-field-wrapper {
      display: flex;
      align-items: center;
      background: var(--card-light);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      padding: 0.5rem 0.875rem;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
      margin: 0.75rem 0;
      width: 100%;
    }

    .search-field-wrapper:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }

    :host-context(.dark-theme) .search-field-wrapper {
      background: var(--card-dark);
      border-color: var(--border-dark);
    }

    :host-context(.dark-theme) .search-input {
      color: rgb(124, 139, 186);
    }

    :host-context(.dark-theme) .search-field-wrapper:focus-within {
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }

    :host-context(.dark-theme) .toggle-description   {
      color: rgba(248, 250, 252, 0.8);
    }

    :host-context(.dark-theme) .reset-button   {
      color: rgba(248, 250, 252, 0.8);
      background-color: rgba(26, 28, 30, 0.8);
    }

    :host-context(.dark-theme) .reset-button:hover {
      background-color: rgb(0, 0, 0);
    }
    

    .search-icon {
      color: var(--text-tertiary);
      margin-right: 0.5rem;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.9rem;
      color: var(--text-primary);
      padding: 0.4rem 0;
      font-family: inherit;
      width: 100%;
    }

    /* Custom Select Styling */
    select.search-input {
      appearance: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 0.7rem center;
      background-size: 0.8rem;
      padding-right: 2rem;
    }

    /* Global dark mode text styles for the settings page */
    .dark-theme .settings-container {
      color: var(--text-primary-dark);
    }

    .dark-theme .settings-container .form-label,
    .dark-theme .settings-container .settings-subtitle,
    .dark-theme .settings-container .toggle-description {
      color: var(--text-secondary-dark);
    }

    .dark-theme .settings-container .search-input,
    .dark-theme .settings-container .select-input,
    .dark-theme .settings-container .settings-title {
      color: var(--text-primary-dark);
    }

    /* Dark mode specific styles for Default Location input */
    .dark-theme .search-field-wrapper {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
    }

    .dark-theme .search-icon {
      color: var(--text-tertiary-dark);
    }

    .dark-theme .search-input {
      background-color: transparent;
      color: rgb(124, 139, 186);
    }

    .dark-theme select.search-input {
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23f8fafc'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
    }

    /* Dark mode toggle text styles */
    .dark-theme .settings-toggles .mat-mdc-slide-toggle .mdc-form-field label,
    .dark-theme .settings-toggles .mat-slide-toggle-content {
      color: var(--text-primary-dark);
    }

    .settings-toggles .mat-mdc-slide-toggle .mdc-form-field label,
    .settings-toggles .mat-slide-toggle-content {
      color: var(--text-primary);
    }

    /* Additional styles for toggle switches in dark theme */
    .dark-theme .mat-mdc-slide-toggle .mdc-switch {
      border-color: var(--primary-light);
    }

    /* Improve focus states */
    .dark-theme .mat-mdc-slide-toggle:focus-within .mdc-switch {
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }

    /* Ensure placeholder text is visible in dark mode */
    .dark-theme .search-input::placeholder {
      color: #7c8bba;
    }

    /* Enhance dark mode styling for entire settings page */
    .dark-theme .settings-card {
      background: var(--card-dark);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      border-color: var(--border-dark);
    }

    /* Dark mode animations and transitions */
    .dark-theme .settings-card,
    .dark-theme .search-field-wrapper,
    .dark-theme .toggle-switch,
    .dark-theme .save-button,
    .dark-theme .cancel-button {
      transition: all 0.3s ease;
    }

    /* Card hover effect in dark mode */
    .dark-theme .settings-card:hover {
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: UserSettings = {
    location: '',
    units: 'metric',
    defaultCity: '',
    notifications: true,
    temperatureUnit: 'celsius'
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
      // No need to update settings.darkMode since we removed it
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
      // Convert units to proper temperatureUnit format
      let settingsToSave = { ...this.settings };

      // Add temperatureUnit based on units
      settingsToSave.temperatureUnit = settingsToSave.units === 'metric' ? 'celsius' : 'fahrenheit';

      const user = await firstValueFrom(this.authService.user$.pipe(filter(u => !!u)));
      console.log('User in saveSettings:', user);
      if (user) {
        try {
          console.log('Saving to Firebase:', settingsToSave);
          await this.firebaseService.setUserSettings(user.uid, settingsToSave);
          console.log('Saved to Firebase');
          this.snackBar.open('Settings saved to your account!', 'Close', { duration: 3000 });
        } catch (firebaseError) {
          console.error('Error saving to Firebase:', firebaseError);
          this.snackBar.open('Error saving to Firebase. Please try again.', 'Close', { duration: 3000 });
        }
      } else {
        try {
          console.log('Saving to localStorage:', settingsToSave);
          localStorage.setItem('userSettings', JSON.stringify(settingsToSave));
          this.snackBar.open('Settings saved locally!', 'Close', { duration: 3000 });
        } catch (localError) {
          console.error('Error saving to localStorage:', localError);
          this.snackBar.open('Error saving to localStorage. Please try again.', 'Close', { duration: 3000 });
        }
      }

      // Update weather service with new settings
      this.weatherService.updateSettings(settingsToSave);
      // Update city service if default city is set
      if (settingsToSave.defaultCity) {
        this.cityService.updateDefaultCity(settingsToSave.defaultCity);
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
      defaultCity: '',
      notifications: true,
      temperatureUnit: 'celsius'
    };
    this.weatherService.updateSettings(this.settings);
  }
}
