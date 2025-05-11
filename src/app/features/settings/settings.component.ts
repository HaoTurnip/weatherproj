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
import { Observable } from 'rxjs';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/services/auth.service';
import { FirebaseService } from '../../core/services/firebase.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule,
  ],
  encapsulation: ViewEncapsulation.None,
  template: `
    <style>
      /* Global dark mode text styles for the settings page */
      .dark-theme .settings-container {
        color: var(--text-primary-dark);
      }
      
      .dark-theme .settings-container .form-label,
      .dark-theme .settings-container .settings-subtitle,
      .dark-theme .settings-container .toggle-description {
        color: var(--text-secondary-dark) !important;
      }
      
      .dark-theme .settings-container .search-input,
      .dark-theme .settings-container .select-input,
      .dark-theme .settings-container .settings-title {
        color: var(--text-primary-dark) !important;
      }
      
      /* Dark mode specific styles for Default Location input */
      .dark-theme .search-field-wrapper {
        background-color: var(--card-dark) !important;
        border-color: var(--border-dark) !important;
      }
      
      .dark-theme .search-icon {
        color: var(--text-tertiary-dark) !important;
      }
      
      .dark-theme .search-input {
        background-color: transparent !important;
        color: var(--text-primary-dark) !important;
      }
      
      .dark-theme .search-field-wrapper:focus-within {
        border-color: var(--primary-light) !important;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
      }
      
      /* Dark mode specific styles for Units dropdown */
      .dark-theme .select-input {
        background-color: var(--card-dark) !important;
        border-color: var(--border-dark) !important;
        color: var(--text-primary-dark) !important;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23f8fafc'><path d='M0 3 L6 9 L12 3 Z'/></svg>") !important;
      }
      
      .dark-theme .select-input:focus {
        border-color: var(--primary-light) !important;
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
      }
      
      .dark-theme .select-input option {
        background-color: var(--background-dark) !important;
        color: var(--text-primary-dark) !important;
      }
      
      /* Dark mode toggle text styles */
      .dark-theme .settings-toggles .mat-mdc-slide-toggle .mdc-form-field label,
      .dark-theme .settings-toggles .mat-slide-toggle-content {
        color: var(--text-primary-dark) !important;
      }
      
      .settings-toggles .mat-mdc-slide-toggle .mdc-form-field label,
      .settings-toggles .mat-slide-toggle-content {
        color: var(--text-primary) !important;
      }

      /* Additional styles for toggle switches in dark theme */
      .dark-theme .mat-mdc-slide-toggle .mdc-switch {
        border-color: var(--primary-light);
      }

      .dark-theme .mat-mdc-slide-toggle .mdc-switch__handle {
        background-color: var(--primary-light);
      }

      /* Improve focus states */
      .dark-theme .mat-mdc-slide-toggle:focus-within .mdc-switch {
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
      }
      
      /* Fix select dropdown arrow in dark mode */
      .dark-theme .select-input {
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23f8fafc'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
      }
      
      /* Ensure placeholder text is visible in dark mode */
      .dark-theme .search-input::placeholder {
        color: var(--text-tertiary-dark) !important;
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
      .dark-theme .select-input,
      .dark-theme .toggle-switch,
      .dark-theme .save-button,
      .dark-theme .cancel-button {
        transition: all 0.3s ease;
      }
      
      /* Card hover effect in dark mode */
      .dark-theme .settings-card:hover {
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.5);
      }

      /* Fix dark mode form input text colors */
      .dark-theme .form-group input,
      .dark-theme .form-group select,
      .dark-theme .form-group textarea {
        color: var(--text-primary-dark);
      }

      /* Specific dark mode styling for units select */
      .select-input {
        width: 100%;
        padding: 12px 16px;
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        color: var(--text-primary);
        font-size: 1rem;
        outline: none;
        cursor: pointer;
        background-color: var(--card-light);
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
        background-repeat: no-repeat;
        background-position: right 12px center;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        padding-right: 30px;
        transition: all 0.2s ease;
      }
      
      .select-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
        transform: translateY(-1px);
      }
      
      .select-input:hover {
        border-color: var(--primary-color);
        box-shadow: var(--shadow-sm);
      }
      
      :host-context(.dark-theme) .select-input {
        background-color: var(--card-dark);
        border-color: var(--border-dark);
        color: var(--text-primary-dark);
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23f8fafc'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
      }
      
      :host-context(.dark-theme) .select-input:focus {
        border-color: var(--primary-light);
        box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
      }
      
      :host-context(.dark-theme) .select-input:hover {
        border-color: var(--primary-light);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
        background-color: rgba(30, 41, 59, 0.8);
      }

      /* Fix dropdown option colors in dark mode */
      :host-context(.dark-theme) select option {
        background-color: var(--background-dark);
        color: var(--text-primary-dark);
      }
      
      /* Improve form labels in dark mode */
      .form-label {
        font-size: 0.95rem;
        font-weight: 500;
        color: var(--text-secondary);
        margin-bottom: 4px;
        transition: color 0.2s ease;
      }
      
      :host-context(.dark-theme) .form-label {
        color: var(--text-secondary-dark);
      }
    </style>
    <div class="settings-container">
      <div class="settings-card">
        <div class="settings-header">
          <h2 class="settings-title">User Settings</h2>
          <p class="settings-subtitle">Manage your weather app preferences</p>
        </div>
        <div class="settings-divider"></div>
        <form class="settings-form" (ngSubmit)="saveSettings()">
          <div class="form-group">
            <label class="form-label">Default Location</label>
            <div class="search-field-wrapper">
              <mat-icon class="search-icon">search</mat-icon>
              <input 
                class="search-input" 
                [(ngModel)]="settings.location" 
                name="location" 
                placeholder="Enter city name"
              >
              <button 
                *ngIf="settings.location" 
                type="button"
                class="clear-button" 
                (click)="clearLocation()" 
                aria-label="Clear location"
              >
                <mat-icon>close</mat-icon>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Units</label>
            <select class="select-input" [(ngModel)]="settings.units" name="units">
              <option value="metric">Metric (°C, km/h)</option>
              <option value="imperial">Imperial (°F, mph)</option>
            </select>
          </div>

          <div class="settings-toggles">
            <div class="toggle-group">
              <mat-slide-toggle [(ngModel)]="settings.darkMode" name="darkMode" (change)="onThemeChange()" color="primary" class="toggle-switch">
                Dark Mode
              </mat-slide-toggle>
              <p class="toggle-description">Switch between light and dark theme</p>
            </div>
            
            <div class="toggle-group">
              <mat-slide-toggle [(ngModel)]="settings.highContrast" name="highContrast" color="primary" class="toggle-switch">
                High Contrast Mode
              </mat-slide-toggle>
              <p class="toggle-description">Increase contrast for better readability</p>
            </div>
          </div>

          <div class="settings-actions">
            <button type="button" class="cancel-button" (click)="resetSettings()">
              Reset
            </button>
            <button type="submit" class="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 0 16px;
    }
    
    .settings-card {
      background: var(--card-light);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-md);
      color: var(--text-primary);
      font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
      padding: 32px 28px 24px 28px;
      transition: all 0.3s ease;
      border: 1px solid var(--border-light);
    }
    
    :host-context(.dark-theme) .settings-card {
      background: var(--card-dark);
      color: var(--text-primary-dark);
      border-color: var(--border-dark);
    }
    
    .settings-header {
      margin-bottom: 24px;
      text-align: left;
    }
    
    .settings-title {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 10px 0;
      color: var(--primary-color);
    }
    
    :host-context(.dark-theme) .settings-title {
      color: var(--primary-light);
    }
    
    .settings-subtitle {
      font-size: 1.1rem;
      color: var(--text-secondary);
      margin: 0;
      font-weight: 500;
    }
    
    :host-context(.dark-theme) .settings-subtitle {
      color: var(--text-secondary-dark);
    }
    
    .settings-divider {
      height: 1px;
      background-color: var(--border-light);
      margin-bottom: 24px;
    }
    
    :host-context(.dark-theme) .settings-divider {
      background-color: var(--border-dark);
    }
    
    .settings-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .form-label {
      font-size: 0.95rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    
    :host-context(.dark-theme) .form-label {
      color: var(--text-secondary-dark);
    }
    
    .toggle-group {
      margin-bottom: 16px;
    }
    
    /* Toggle switch specific styles */
    .toggle-switch {
      margin-bottom: 4px;
    }
    
    .toggle-switch.mat-mdc-slide-toggle {
      --mdc-switch-selected-track-color: var(--primary-color);
      --mdc-switch-selected-handle-color: var(--primary-color);
      --mdc-switch-selected-icon-color: white;
      --mdc-switch-unselected-track-color: rgba(0, 0, 0, 0.15);
      --mdc-switch-unselected-handle-color: white;
      --mdc-switch-unselected-icon-color: var(--text-secondary);
    }
    
    :host-context(.dark-theme) .toggle-switch.mat-mdc-slide-toggle {
      --mdc-switch-selected-track-color: var(--primary-light);
      --mdc-switch-selected-handle-color: var(--primary-light);
      --mdc-switch-selected-icon-color: var(--background-dark);
      --mdc-switch-unselected-track-color: rgba(255, 255, 255, 0.15);
      --mdc-switch-unselected-handle-color: var(--card-dark);
      --mdc-switch-unselected-icon-color: var(--text-secondary-dark);
    }
    
    .toggle-description {
      font-size: 0.9rem;
      color: var(--text-tertiary);
      margin: 4px 0 0 32px;
    }
    
    :host-context(.dark-theme) .toggle-description {
      color: var(--text-tertiary-dark);
    }
    
    .settings-toggles {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .settings-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      margin-top: 16px;
    }
    
    .save-button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--radius-full);
      font-weight: 600;
      font-size: 0.95rem;
      padding: 10px 24px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .save-button:hover {
      background-color: var(--primary-dark);
      transform: translateY(-1px);
      box-shadow: var(--shadow-md);
    }
    
    :host-context(.dark-theme) .save-button {
      background-color: var(--primary-light);
      color: var(--background-dark);
    }
    
    :host-context(.dark-theme) .save-button:hover {
      background-color: var(--primary-color);
      box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
    }
    
    .cancel-button {
      background-color: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      font-weight: 500;
      font-size: 0.95rem;
      padding: 10px 24px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .cancel-button:hover {
      background-color: var(--card-hover-light);
      transform: translateY(-1px);
    }
    
    :host-context(.dark-theme) .cancel-button {
      color: var(--text-secondary-dark);
      border-color: var(--border-dark);
    }
    
    :host-context(.dark-theme) .cancel-button:hover {
      background-color: var(--card-hover-dark);
      box-shadow: 0 0 10px rgba(30, 41, 59, 0.4);
    }
    
    /* Search field styles - matching header component */
    .search-field-wrapper {
      display: flex;
      align-items: center;
      background: var(--card-light);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-full);
      padding: 0.5rem 0.875rem;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm);
      width: 100%;
    }

    .search-field-wrapper:focus-within {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }
    
    .search-field-wrapper:hover:not(:focus-within) {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-sm);
    }

    :host-context(.dark-theme) .search-field-wrapper {
      background: var(--card-dark);
      border-color: var(--border-dark);
    }

    :host-context(.dark-theme) .search-field-wrapper:focus-within {
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    :host-context(.dark-theme) .search-field-wrapper:hover:not(:focus-within) {
      border-color: var(--primary-light);
      background-color: rgba(30, 41, 59, 0.8);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }

    .search-icon {
      color: var(--text-tertiary);
      margin-right: 0.5rem;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      transition: color 0.2s ease;
    }
    
    :host-context(.dark-theme) .search-field-wrapper:hover .search-icon,
    :host-context(.dark-theme) .search-field-wrapper:focus-within .search-icon {
      color: var(--primary-light);
    }
    
    .search-field-wrapper:hover .search-icon,
    .search-field-wrapper:focus-within .search-icon {
      color: var(--primary-color);
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

    :host-context(.dark-theme) .search-input {
      color: var(--text-primary-dark);
    }

    .search-input::placeholder {
      color: var(--text-tertiary);
    }

    :host-context(.dark-theme) .search-input::placeholder {
      color: var(--text-tertiary-dark);
    }

    .clear-button {
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 0;
      margin-left: 0.5rem;
      flex-shrink: 0;
    }

    .clear-button mat-icon {
      font-size: 1.1rem;
      width: 1.1rem;
      height: 1.1rem;
      color: var(--text-tertiary);
      transition: color 0.2s ease;
    }

    .clear-button:hover mat-icon {
      color: var(--text-primary);
    }

    :host-context(.dark-theme) .clear-button:hover mat-icon {
      color: var(--text-primary-dark);
    }
    
    .select-input {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      color: var(--text-primary);
      font-size: 1rem;
      outline: none;
      cursor: pointer;
      background-color: var(--card-light);
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2364748b'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
      background-repeat: no-repeat;
      background-position: right 12px center;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      padding-right: 30px;
      transition: all 0.2s ease;
    }
    
    .select-input:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }
    
    .select-input:hover {
      border-color: var(--primary-color);
      box-shadow: var(--shadow-sm);
    }
    
    :host-context(.dark-theme) .select-input {
      background-color: var(--card-dark);
      border-color: var(--border-dark);
      color: var(--text-primary-dark);
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%23f8fafc'><path d='M0 3 L6 9 L12 3 Z'/></svg>");
    }
    
    :host-context(.dark-theme) .select-input:focus {
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    :host-context(.dark-theme) .select-input:hover {
      border-color: var(--primary-light);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
    
    @media (max-width: 600px) {
      .settings-card {
        padding: 24px 16px;
        border-radius: var(--radius-xl);
      }
      
      .settings-title {
        font-size: 1.5rem;
      }
      
      .settings-subtitle {
        font-size: 1rem;
      }
      
      .settings-actions {
        flex-direction: column-reverse;
        gap: 12px;
      }
      
      .save-button, .cancel-button {
        width: 100%;
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

  resetSettings() {
    this.settings = {
      location: 'Washington, USA',
      units: 'imperial',
      darkMode: false,
      highContrast: false,
    };
  }

  clearLocation() {
    this.settings.location = '';
  }
} 