import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';

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
    FormsModule,
  ],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h1>
      
      <mat-card class="bg-white dark:bg-gray-800">
        <mat-card-content class="p-6">
          <form class="space-y-6">
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
              <mat-slide-toggle [(ngModel)]="settings.darkMode" name="darkMode">
                Dark Mode
              </mat-slide-toggle>

              <mat-slide-toggle [(ngModel)]="settings.highContrast" name="highContrast">
                High Contrast Mode
              </mat-slide-toggle>
            </div>

            <div class="flex justify-end">
              <button 
                type="submit"
                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Save Changes
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [],
})
export class SettingsComponent {
  settings: UserSettings = {
    location: 'Washington, USA',
    units: 'imperial',
    darkMode: false,
    highContrast: false,
  };
} 