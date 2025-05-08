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
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
      
      <mat-card class="settings-card" [class.dark]="(isDarkMode$ | async)">
        <mat-card-content class="p-6">
          <form class="space-y-6" (ngSubmit)="saveSettings()">
            <mat-form-field class="w-full">
              <mat-label>Default Location</mat-label>
              <input matInput [(ngModel)]="settings.location" name="location" placeholder="Enter city name">
            </mat-form-field>

            <mat-form-field class="w-full">
              <mat-label>Units</mat-label>
              <mat-select [(ngModel)]="settings.units" name="units">
                <mat-option value="metric">Metric (°C, km/h)</mat-option>
                <mat-option value="imperial">Imperial (°F, mph)</mat-option>
              </mat-select>
            </mat-form-field>

            <div class="space-y-4">
              <mat-slide-toggle [(ngModel)]="settings.darkMode" name="darkMode" (change)="onThemeChange()">
                Dark Mode
              </mat-slide-toggle>

              <mat-slide-toggle [(ngModel)]="settings.highContrast" name="highContrast">
                High Contrast Mode
              </mat-slide-toggle>
            </div>

            <div class="flex justify-end">
              <button 
                mat-raised-button 
                color="primary" 
                type="submit"
                class="save-button"
              >
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .settings-card {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
      color: white;
      border-radius: 12px;
      padding: 24px;
      transition: all 0.3s ease;
    }

    .settings-card.dark {
      background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
    }

    .settings-card .mat-mdc-form-field {
      color: white;
    }

    .settings-card .mat-mdc-form-field-label {
      color: rgba(255, 255, 255, 0.8);
    }

    .settings-card .mat-mdc-form-field-outline {
      color: rgba(255, 255, 255, 0.3);
    }

    .settings-card .mat-mdc-input-element {
      color: white;
    }

    .settings-card .mat-mdc-select-value {
      color: white;
    }

    .settings-card .mat-mdc-select-arrow {
      color: white;
    }

    .settings-card .mat-mdc-slide-toggle {
      color: white;
    }

    .settings-card .mat-mdc-slide-toggle-label {
      color: white;
    }

    .save-button {
      background-color: white;
      color: var(--primary-blue);
    }

    .save-button:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }

    h1 {
      color: var(--text-primary);
      transition: color 0.3s ease;
    }

    .dark h1 {
      color: white;
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

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Subscribe to theme changes to update settings
    this.isDarkMode$.subscribe(isDark => {
      this.settings.darkMode = isDark;
    });
  }

  onThemeChange() {
    this.themeService.toggleTheme();
  }

  saveSettings() {
    // Save settings to local storage or backend
    localStorage.setItem('userSettings', JSON.stringify(this.settings));
    // You can also emit an event or call a service to update settings
  }
} 