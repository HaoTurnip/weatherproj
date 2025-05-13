import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../core/services/weather.service';
import { finalize } from 'rxjs';
import { MapOverlay } from '../../core/models/map.model';

declare global {
  interface Window {
    windyInit: any;
    L: any;
  }
}

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="map-container">
      <mat-card class="map-card">
        <mat-card-header>
          <mat-card-title>Interactive Weather Map</mat-card-title>
          <mat-card-subtitle>View detailed, interactive weather data from Windy.com</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="map-controls">
            <div class="control-group">
              <h3 class="control-label">Map Type</h3>
              <mat-button-toggle-group [(ngModel)]="selectedOverlay" (change)="changeOverlay()">
                <mat-button-toggle value="wind">Wind</mat-button-toggle>
                <mat-button-toggle value="temp">Temperature</mat-button-toggle>
                <mat-button-toggle value="pressure">Pressure</mat-button-toggle>
              </mat-button-toggle-group>
              <p class="overlay-note">Note: Only Wind, Temperature, and Pressure overlays are currently available with full support.</p>
            </div>

            <div class="control-group">
              <h3 class="control-label">Location</h3>
              <div class="location-input">
                <div class="search-field-wrapper">
                  <mat-icon class="search-icon">search</mat-icon>
                  <input 
                    type="text" 
                    [(ngModel)]="locationInput" 
                    placeholder="Enter city name for map" 
                    class="city-input"
                    (keyup.enter)="searchLocation()"
                  >
                  <button 
                    *ngIf="locationInput" 
                    mat-icon-button 
                    class="clear-button" 
                    (click)="locationInput = ''"
                  >
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
                <button 
                  mat-icon-button 
                  color="primary" 
                  class="search-button"
                  (click)="searchLocation()"
                  [disabled]="searchingLocation"
                >
                  <mat-icon *ngIf="!searchingLocation">search</mat-icon>
                  <mat-spinner diameter="20" *ngIf="searchingLocation"></mat-spinner>
                </button>
              </div>
            </div>
          </div>
          
          <div class="windy-map-container">
            <div id="windy" #windyMap></div>
            
            <div *ngIf="loading" class="loading-overlay">
              <mat-spinner diameter="50"></mat-spinner>
              <p class="loading-text">Loading map...</p>
            </div>
            
            <div *ngIf="error" class="error-overlay">
              <mat-icon class="error-icon">error_outline</mat-icon>
              <p class="error-text">{{ error }}</p>
              <button mat-raised-button color="primary" (click)="initMap()">Retry</button>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    /* Global styles for map component in dark mode */
    .dark-theme .map-container {
      color: var(--text-primary-dark);
    }
    
    .dark-theme .map-card {
      background-color: var(--card-dark) !important;
      border: 1px solid var(--border-dark) !important;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25) !important;
    }
    
    .dark-theme .map-card:hover {
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3) !important;
    }
    
    .dark-theme .map-card .mat-mdc-card-title {
      color: var(--text-primary-dark) !important;
    }
    
    .dark-theme .map-card .mat-mdc-card-subtitle {
      color: var(--text-secondary-dark) !important;
    }
    
    /* Control label styling for dark mode */
    .dark-theme .control-label {
      color: #ffffff !important;
    }
    
    .dark-theme .overlay-note {
      color: #7fd1de !important;
    }
    
    /* Button toggle group styling for dark mode */
    .dark-theme .mat-button-toggle-group {
      background-color: #1e293b !important;
      border: 1px solid #334155 !important;
      box-shadow: none !important;
      padding: 2px !important;
      border-radius: 50px !important;
      gap: 0 !important;
      display: flex !important;
    }
    
    .dark-theme .mat-button-toggle {
      background-color: transparent !important;
      color: #94a3b8 !important;
      border: none !important;
      border-radius: 50px !important;
      transition: all 0.2s ease !important;
      overflow: hidden !important;
      padding: 0 !important;
      margin: 0 2px !important;
    }
    
    .dark-theme .mat-button-toggle:not(.mat-button-toggle-checked):hover {
      background-color: #334155 !important;
      color: #e2e8f0 !important;
    }
    
    .dark-theme .mat-button-toggle-checked {
      background-color: #3b82f6 !important;
      color: #ffffff !important;
      font-weight: 500 !important;
    }
    
    .dark-theme .mat-button-toggle-button {
      color: inherit !important;
      padding: 6px 16px !important;
    }
    
    .dark-theme .mat-button-toggle-focus-overlay {
      background-color: transparent !important;
    }
    
    /* Error container styles */
    .dark-theme .error-container {
      background-color: var(--card-dark) !important;
      color: var(--text-primary-dark) !important;
      border: 1px solid var(--border-dark) !important;
    }
    
    .dark-theme .error-icon {
      color: var(--error-light) !important;
    }
    
    /* Location input dark mode specific styles - matching header */
    .dark-theme .location-input .search-field-wrapper {
      background: var(--card-dark) !important;
      border-color: var(--border-dark) !important;
    }
    
    .dark-theme .location-input .search-icon {
      color: var(--text-tertiary-dark) !important;
    }
    
    .dark-theme .location-input .city-input {
      background-color: transparent !important;
      color: var(--text-primary-dark) !important;
    }
    
    .dark-theme .location-input .city-input::placeholder {
      color: var(--text-tertiary-dark) !important;
    }
    
    .dark-theme .location-input .search-field-wrapper:focus-within {
      border-color: var(--primary-light) !important;
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2) !important;
    }
    
    .dark-theme .location-input .search-field-wrapper:hover:not(:focus-within) {
      border-color: var(--primary-light) !important;
      background-color: rgba(30, 41, 59, 0.8) !important;
    }
    
    .dark-theme .location-input button.mat-icon-button {
      color: var(--primary-light) !important;
    }
    
    .dark-theme .location-input button.mat-icon-button:hover:not([disabled]) {
      background-color: rgba(59, 130, 246, 0.2) !important;
    }
    
    .dark-theme .location-input mat-icon {
      color: var(--primary-light) !important;
    }

    .map-container {
      padding: 24px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .map-card {
      background: var(--card-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      margin-bottom: 24px;
      transition: all 0.3s ease;
      color: var(--text-primary);
      font-family: 'Inter', 'Roboto', 'Segoe UI', Arial, sans-serif;
      border: 1px solid var(--border-light);
    }
    
    .map-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-3px);
    }
    
    :host-context(.dark-theme) .map-card {
      background: var(--card-dark);
      color: var(--text-primary-dark);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
      border-color: var(--border-dark);
    }
    
    :host-context(.dark-theme) .map-card:hover {
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
    }
    
    .map-card .mat-mdc-card-title {
      color: var(--text-primary);
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .map-card .mat-mdc-card-subtitle {
      color: var(--text-secondary);
    }
    
    :host-context(.dark-theme) .map-card .mat-mdc-card-title {
      color: var(--text-primary-dark);
    }
    
    :host-context(.dark-theme) .map-card .mat-mdc-card-subtitle {
      color: var(--text-secondary-dark);
    }

    .map-controls {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 24px;
      align-items: flex-start;
      justify-content: space-between;
    }
    
    .control-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .control-label {
      font-size: 1rem;
      font-weight: 500;
      color: var(--text-primary);
      margin: 0;
    }
    
    .mat-button-toggle-group {
      background-color: #f1f5f9;
      border-radius: 50px;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
      padding: 2px;
      gap: 0;
      display: flex;
      flex-wrap: wrap;
    }
    
    .mat-button-toggle {
      border-radius: 50px !important;
      font-size: 14px;
      font-weight: 500;
      color: #64748b;
      transition: all 0.2s ease;
      border: none;
      background-color: transparent;
      padding: 0;
      margin: 0 2px;
      overflow: hidden;
    }
    
    .mat-button-toggle-checked {
      background-color: #3b82f6 !important;
      color: white !important;
      font-weight: 500;
    }
    
    .mat-button-toggle .mat-button-toggle-button {
      padding: 6px 16px;
    }
    
    .mat-button-toggle:not(.mat-button-toggle-checked):hover {
      background-color: #e2e8f0;
      color: #1e293b;
    }
    
    :host-context(.dark-theme) .mat-button-toggle-group {
      background-color: #1e293b;
      border-color: #334155;
    }
    
    :host-context(.dark-theme) .mat-button-toggle {
      color: #94a3b8;
    }
    
    :host-context(.dark-theme) .mat-button-toggle-checked {
      background-color: #3b82f6 !important;
      color: #ffffff !important;
    }
    
    :host-context(.dark-theme) .mat-button-toggle:not(.mat-button-toggle-checked):hover {
      background-color: #334155;
      color: #e2e8f0;
    }

    .windy-map-container {
      width: 100%;
      height: 600px;
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
      position: relative;
      transition: all 0.3s ease;
      border: 1px solid var(--border-light);
    }
    
    :host-context(.dark-theme) .windy-map-container {
      border-color: var(--border-dark);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
    }
    
    #windy {
      width: 100%;
      height: 100%;
    }
    
    .location-input {
      display: flex;
      align-items: center;
      gap: 8px;
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
      flex: 1;
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
    
    .search-icon {
      color: var(--text-tertiary);
      margin-right: 0.5rem;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      transition: color 0.2s ease;
    }
    
    .search-field-wrapper:hover .search-icon,
    .search-field-wrapper:focus-within .search-icon {
      color: var(--primary-color);
    }
    
    .city-input {
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
    
    .city-input::placeholder {
      color: var(--text-tertiary);
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
    
    :host-context(.dark-theme) .search-field-wrapper {
      background: var(--card-dark);
      border-color: var(--border-dark);
    }
    
    :host-context(.dark-theme) .city-input {
      color: var(--text-primary-dark);
    }
    
    :host-context(.dark-theme) .city-input::placeholder {
      color: var(--text-tertiary-dark);
    }
    
    :host-context(.dark-theme) .search-field-wrapper:focus-within {
      border-color: var(--primary-light);
      box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.2);
    }
    
    :host-context(.dark-theme) .search-field-wrapper:hover:not(:focus-within) {
      border-color: var(--primary-light);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      background-color: rgba(30, 41, 59, 0.8);
    }
    
    :host-context(.dark-theme) .search-field-wrapper:hover .search-icon,
    :host-context(.dark-theme) .search-field-wrapper:focus-within .search-icon {
      color: var(--primary-light);
    }
    
    :host-context(.dark-theme) .clear-button:hover mat-icon {
      color: var(--text-primary-dark);
    }
    
    .search-button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: var(--radius-full);
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .search-button:hover:not([disabled]) {
      background-color: var(--primary-dark);
      transform: translateY(-2px);
      box-shadow: var(--shadow-md);
    }
    
    .search-button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    :host-context(.dark-theme) .search-button {
      background-color: var(--primary-light);
      color: var(--background-dark);
    }
    
    :host-context(.dark-theme) .search-button:hover:not([disabled]) {
      background-color: var(--primary-color);
      box-shadow: 0 0 15px rgba(96, 165, 250, 0.4);
    }

    .loading-overlay, .error-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: rgba(255, 255, 255, 0.9);
      z-index: 1000;
      border-radius: var(--radius-lg);
    }
    
    :host-context(.dark-theme) .loading-overlay, 
    :host-context(.dark-theme) .error-overlay {
      background-color: rgba(15, 23, 42, 0.9);
    }
    
    .loading-text, .error-text {
      margin-top: 16px;
      font-size: 1.1rem;
      color: var(--text-primary);
      text-align: center;
    }
    
    :host-context(.dark-theme) .loading-text, 
    :host-context(.dark-theme) .error-text {
      color: var(--text-primary-dark);
    }
    
    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--error-color);
      margin-bottom: 16px;
    }
    
    :host-context(.dark-theme) .error-icon {
      color: var(--error-light);
    }
    
    @media (max-width: 768px) {
      .windy-map-container {
        height: 400px;
      }
      .map-container {
        padding: 12px;
      }
      .map-controls {
        flex-direction: column;
        align-items: stretch;
      }
    }

    .overlay-note {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-top: 4px;
      font-style: italic;
    }
    
    /* Dark theme selector is now in the template styles section */
    
    .location-input button.mat-icon-button {
      transition: all 0.3s ease;
    }
    
    .location-input button.mat-icon-button:hover:not([disabled]) {
      background-color: rgba(59, 130, 246, 0.1);
      transform: translateY(-1px);
    }
    
    :host-context(.dark-theme) .location-input button.mat-icon-button:hover:not([disabled]) {
      background-color: rgba(59, 130, 246, 0.2);
    }
  `]
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('windyMap') windyMapElement!: ElementRef;
  
  selectedOverlay: MapOverlay = 'wind';
  locationInput: string = '';
  loading = true;
  error: string | null = null;
  searchingLocation = false;
  
  // Default coordinates (Cairo, Egypt from the example)
  currentCoordinates = { lat: 30.112, lon: 31.397 };
  zoomLevel = 8;
  
  // Store references to Windy API components
  private windyAPI: any = null;
  private leaflet: any = null;
  private scriptElements: HTMLScriptElement[] = [];
  private initialized = false;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private weatherService: WeatherService,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  ngOnInit() {
    // Set up scripts for Windy API
    this.loadScripts();
    
    // Check for query parameters to set initial state
    this.route.queryParams.subscribe(params => {
      if (params['overlay'] && this.isValidOverlay(params['overlay'])) {
        this.selectedOverlay = params['overlay'] as MapOverlay;
      } else if (params['overlay']) {
        // If an invalid overlay is specified, default to wind
        this.selectedOverlay = 'wind';
      }
      
      if (params['lat'] && params['lon']) {
        this.currentCoordinates = {
          lat: parseFloat(params['lat']),
          lon: parseFloat(params['lon'])
        };
      }
      
      if (params['zoom']) {
        this.zoomLevel = parseInt(params['zoom']);
      }
      
      if (params['location']) {
        this.locationInput = params['location'];
      }
    });
  }

  ngAfterViewInit() {
    // Initialize the map after scripts have loaded
    this.checkScriptsLoaded();
  }

  ngOnDestroy() {
    // Clean up scripts when component is destroyed
    this.scriptElements.forEach(script => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    });
    
    // Clean up global objects if possible
    if (window.windyInit) {
      try {
        // Additional cleanup could be added here if Windy API provides it
      } catch (e) {
        console.error('Error cleaning up Windy API:', e);
      }
    }
  }

  private loadScripts() {
    // Create and load the Leaflet script
    const leafletScript = document.createElement('script');
    leafletScript.src = 'https://unpkg.com/leaflet@1.4.0/dist/leaflet.js';
    leafletScript.defer = true;
    leafletScript.onload = () => this.checkScriptsLoaded();
    leafletScript.onerror = () => this.handleScriptError();
    document.body.appendChild(leafletScript);
    this.scriptElements.push(leafletScript);
    
    // Create and load the Windy API script
    const windyScript = document.createElement('script');
    windyScript.src = 'https://api.windy.com/assets/map-forecast/libBoot.js';
    windyScript.defer = true;
    windyScript.onload = () => this.checkScriptsLoaded();
    windyScript.onerror = () => this.handleScriptError();
    document.body.appendChild(windyScript);
    this.scriptElements.push(windyScript);
  }

  private checkScriptsLoaded() {
    // Check if both scripts are loaded and the DOM element is ready
    if (window.windyInit && window.L && this.windyMapElement && !this.initialized) {
      this.initMap();
    }
  }

  private handleScriptError() {
    this.zone.run(() => {
      this.error = 'Failed to load map resources. Please check your internet connection and try again.';
      this.loading = false;
    });
  }

  initMap() {
    this.zone.run(() => {
      this.loading = true;
      this.error = null;
    });
    
    // Options for initializing the Windy map
    const options = {
      key: 'gCAnxyWARYrS8Pr4f8PpLua51KkZfssy', // Your API key
      verbose: false,
      lat: this.currentCoordinates.lat,
      lon: this.currentCoordinates.lon,
      zoom: this.zoomLevel,
      overlay: this.selectedOverlay,
      level: 'surface',
      timestamp: Math.round(new Date().getTime() / 1000),
      hourFormat: '24h'
    };

    // Initialize Windy API with the options
    try {
      if (!window.windyInit) {
        throw new Error('Windy API not loaded');
      }
      
      // Initialize the map
      window.windyInit(options, (api: any) => {
        // Store references to the API
        this.windyAPI = api;
        this.leaflet = window.L;
        this.initialized = true;
        
        // Extract the store and map from the API
        const { store, map, overlays } = api;
        
        // Set up listeners
        this.registerListeners(store, map);
        
        // Mark loading as complete
        this.zone.run(() => {
          this.loading = false;
        });
        
        // Update URL parameters
        this.updateUrlParams();
      });
    } catch (error) {
      console.error('Error initializing Windy map:', error);
      this.zone.run(() => {
        this.error = 'Failed to initialize weather map. Please try again later.';
        this.loading = false;
      });
    }
  }
  
  private registerListeners(store: any, map: any) {
    // Listen for map movement to update URL parameters
    map.on('moveend', () => {
      const center = map.getCenter();
      const zoom = map.getZoom();
      
      this.zone.run(() => {
        this.currentCoordinates = { 
          lat: center.lat, 
          lon: center.lng 
        };
        this.zoomLevel = zoom;
        this.updateUrlParams();
      });
    });
    
    // Add other listeners as needed
  }

  private isValidOverlay(overlay: string): boolean {
    const validOverlays: MapOverlay[] = ['wind', 'temp', 'pressure'];
    return validOverlays.includes(overlay as MapOverlay);
  }

  changeOverlay() {
    if (this.windyAPI && this.windyAPI.store) {
      // Change the overlay using the Windy API
      this.windyAPI.store.set('overlay', this.selectedOverlay);
      this.updateUrlParams();
    }
  }

  searchLocation() {
    if (!this.locationInput || this.locationInput.trim() === '') {
      return;
    }
    
    this.searchingLocation = true;
    
    this.weatherService.getCoordinatesForCity(this.locationInput)
      .pipe(finalize(() => this.zone.run(() => this.searchingLocation = false)))
      .subscribe({
        next: (coordinates) => {
          this.zone.run(() => {
            this.currentCoordinates = coordinates;
            
            // If Windy API is initialized, update the map position
            if (this.windyAPI && this.windyAPI.map) {
              this.windyAPI.map.setView([coordinates.lat, coordinates.lon], this.zoomLevel);
            }
            
            // Show success message
            this.snackBar.open(`Showing weather for ${this.locationInput}`, 'Close', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
            
            this.updateUrlParams();
          });
        },
        error: (error) => {
          console.error('Error getting coordinates:', error);
          this.zone.run(() => {
            this.snackBar.open(error.message || 'Location not found', 'Close', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          });
        }
      });
  }

  private updateUrlParams() {
    // Update URL to reflect current state
    const queryParams: any = {
      overlay: this.selectedOverlay,
      lat: this.currentCoordinates.lat.toFixed(4),
      lon: this.currentCoordinates.lon.toFixed(4),
      zoom: this.zoomLevel
    };
    
    if (this.locationInput) {
      queryParams.location = this.locationInput;
    }
    
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }
} 