import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { HomeComponent } from './features/home/home.component';
import { WeatherService } from './core/services/weather.service';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    <div class="app-wrapper">
      <app-header (searchCity)="onSearchCity($event)"></app-header>
      <div class="main-content">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .welcome-message {
      text-align: center;
      padding: 20px;
    }
    .app-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: var(--background-light);
    }
    :host-context(.dark-theme) .app-wrapper {
      background-color: var(--background-dark);
    }
    .main-content {
      padding-top: 135px; /* Account for both header (72px) and navbar height (~55px with margins) */
      margin-top: 0;
      min-height: calc(100vh - 300px);
      flex: 1;
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden; /* Prevent horizontal scrolling */
    }
    :host {
      display: block;
      min-height: 100vh;
    }
  `]
})
export class AppComponent implements OnInit {
  isDarkMode = false;
  title = 'Weather App';
  loading = false;
  error: string | null = null;
  isLoggedIn = false;
  searchQuery = '';

  constructor(
    private weatherService: WeatherService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Load settings from localStorage on app startup
    this.loadUserSettings();

    // Also listen to auth state changes to load user settings when logged in
    this.authService.user$.subscribe(user => {
      if (user) {
        // User logged in, their settings will be loaded in the settings component
        console.log('User logged in, settings will be loaded');
      } else {
        // User logged out, load from localStorage
        this.loadUserSettings();
      }
    });
  }

  private loadUserSettings() {
    try {
      const storedSettings = localStorage.getItem('userSettings');
      if (storedSettings) {
        const settings = JSON.parse(storedSettings);
        console.log('Loading settings from localStorage:', settings);
        this.weatherService.updateSettings(settings);

        // Ensure the settings are immediately saved back to localStorage
        // This fixes a potential issue where settings might not persist
        localStorage.setItem('userSettings', JSON.stringify(settings));
      } else {
        console.log('No settings found in localStorage');
        // Save default settings to localStorage so they're available on refresh
        const defaultSettings = this.weatherService.getUserSettings();
        localStorage.setItem('userSettings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error);
    }
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
  }

  logout() {
    this.isLoggedIn = false;
  }

  onSearchCity(city: string) {
    // No longer needed here
  }
}
