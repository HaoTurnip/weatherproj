import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapComponent } from './map.component';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { WeatherService } from '../../core/services/weather.service';
import { By } from '@angular/platform-browser';

// Mock global objects needed by the component
declare global {
  interface Window {
    windyInit: any;
    L: any;
  }
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;
  let router: Router;
  let mockActivatedRoute: any;
  let weatherServiceSpy: jasmine.SpyObj<WeatherService>;
  
  // Mock Windy API and Leaflet
  const mockWindyAPI = {
    store: {
      set: jasmine.createSpy('set')
    },
    map: {
      setView: jasmine.createSpy('setView'),
      getCenter: () => ({ lat: 30.112, lng: 31.397 }),
      getZoom: () => 8,
      on: jasmine.createSpy('on')
    }
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    weatherServiceSpy = jasmine.createSpyObj('WeatherService', ['getCoordinatesForCity']);
    
    // Set up the mock windy init function
    window.windyInit = jasmine.createSpy('windyInit').and.callFake((options, callback) => {
      callback(mockWindyAPI);
    });
    
    // Set up the mock leaflet
    window.L = {};
    
    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        FormsModule,
        MatCardModule,
        MatButtonToggleModule,
        MatIconModule,
        MatButtonModule,
        MatSnackBarModule,
        MapComponent
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: WeatherService, useValue: weatherServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    
    // Spy on component methods
    spyOn(component, 'initMap').and.callThrough();
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should attempt to load Windy scripts on init', () => {
    // Create a script element for tracking script creation
    const scriptElements = document.querySelectorAll('script');
    const leafletScripts = Array.from(scriptElements).filter(script => 
      script.src.includes('leaflet'));
    const windyScripts = Array.from(scriptElements).filter(script => 
      script.src.includes('windy'));
    
    // Verify scripts were created
    expect(leafletScripts.length).toBeGreaterThan(0);
    expect(windyScripts.length).toBeGreaterThan(0);
  });

  it('should change overlay when map type is changed', () => {
    // Manually set the Windy API to the component since we mocked it
    component['windyAPI'] = mockWindyAPI;
    
    // Change the overlay
    component.selectedOverlay = 'temp';
    component.changeOverlay();
    
    // Verify the API store was called to set the overlay
    expect(mockWindyAPI.store.set).toHaveBeenCalledWith('overlay', 'temp');
  });

  it('should update map position when location search is successful', () => {
    // Manually set the Windy API to the component since we mocked it
    component['windyAPI'] = mockWindyAPI;
    
    // Set up the search mock
    component.locationInput = 'London';
    weatherServiceSpy.getCoordinatesForCity.and.returnValue(of({ 
      lat: 51.5074, 
      lon: 0.1278 
    }));
    
    // Perform the search
    component.searchLocation();
    
    // Verify the map position was updated
    expect(mockWindyAPI.map.setView).toHaveBeenCalledWith([51.5074, 0.1278], jasmine.any(Number));
  });

  it('should update URL parameters when map changes', () => {
    // Trigger a map change
    component['updateUrlParams']();
    
    // Verify router navigation was called
    expect((router.navigate as jasmine.Spy).calls.mostRecent().args[1]).toEqual(
      jasmine.objectContaining({
        queryParams: jasmine.objectContaining({
          overlay: jasmine.any(String),
          lat: jasmine.any(String),
          lon: jasmine.any(String),
          zoom: jasmine.any(Number)
        })
      })
    );
  });
}); 