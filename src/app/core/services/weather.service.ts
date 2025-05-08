import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_mph: number;
    precip_in: number;
  };
}

export interface ForecastData {
  location: {
    name: string;
    region: string;
    country: string;
  };
  current: {
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_mph: number;
    precip_in: number;
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_f: number;
        mintemp_f: number;
        condition: {
          text: string;
          icon: string;
        };
        daily_chance_of_rain: number;
        avghumidity: number;
        maxwind_mph: number;
      };
    }>;
  };
}

export interface WeatherAlert {
  id: string;
  type: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.weatherApiKey;
  private baseUrl = environment.weatherApiBaseUrl;
  private http = inject(HttpClient);

  getCurrentWeather(location: string): Observable<WeatherData> {
    return this.http.get<WeatherData>(`${this.baseUrl}/current.json`, {
      params: {
        key: this.apiKey,
        q: location,
        aqi: 'no'
      }
    }).pipe(
      catchError(error => {
        console.error('Error fetching current weather:', error);
        throw new Error('Failed to fetch current weather data');
      })
    );
  }

  getForecast(location: string): Observable<ForecastData> {
    return this.http.get<ForecastData>(`${this.baseUrl}/forecast.json`, {
      params: {
        key: this.apiKey,
        q: location,
        days: '5',
        aqi: 'no',
        alerts: 'yes'
      }
    }).pipe(
      catchError(error => {
        console.error('Error fetching forecast:', error);
        throw new Error('Failed to fetch forecast data');
      })
    );
  }

  getAlerts(location: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/alerts.json`, {
      params: {
        key: this.apiKey,
        q: location
      }
    }).pipe(
      catchError(error => {
        console.error('Error fetching alerts:', error);
        throw new Error('Failed to fetch weather alerts');
      })
    );
  }

  getMapOverlay(type: 'temperature' | 'precipitation' | 'wind' | 'clouds'): Observable<string> {
    const mapUrl = `${this.baseUrl}/maps/v1/weather/${type}/0/0/0.png?key=${this.apiKey}&lang=en`;
    return of(mapUrl).pipe(
      catchError(error => {
        console.error('Error fetching map overlay:', error);
        throw new Error('Failed to load weather map');
      })
    );
  }
} 