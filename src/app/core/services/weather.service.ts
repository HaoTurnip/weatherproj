import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, of, switchMap, catchError } from 'rxjs';
import { WeatherData, HourlyForecast, DailyForecast } from '../models/weather.model';
import { ForecastData } from '../models/weather.model';

import { Observable, map } from 'rxjs';
import { WeatherData, HourlyForecast, DailyForecast, ForecastData } from '../models/weather.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private userSettings: {
    units: 'metric' | 'imperial';
    defaultCity?: string;
  } = {
    units: 'metric',
    defaultCity: ''
  };

  constructor(private http: HttpClient) {}

  updateSettings(settings: { units: 'metric' | 'imperial'; defaultCity?: string }) {
    this.userSettings = { ...this.userSettings, ...settings };
    // If there's a default city, update the current weather
    if (settings.defaultCity) {
      this.getCurrentWeather(settings.defaultCity).subscribe();
    }
  }

  getCurrentWeather(location: string | { latitude: number; longitude: number }): Observable<WeatherData> {
    let params: any = {
      key: environment.weatherApiKey,
      aqi: 'yes',
      units: this.userSettings.units
    };

    if (typeof location === 'string') {
      params.q = location;
    } else {
      params.q = `${location.latitude},${location.longitude}`;
    }

    return this.http.get<any>(`${environment.weatherApiBaseUrl}/current.json`, { params }).pipe(
      map(response => ({
        temperature: response.current.temp_c,
        condition: response.current.condition.text,
        icon: response.current.condition.icon,
        humidity: response.current.humidity,
        windSpeed: response.current.wind_kph,
        windDirection: response.current.wind_dir,
        precipitation: response.current.precip_mm,
        uvIndex: response.current.uv,
        cityName: response.location.name
      }))
    );
  }

  getForecast(location: string | { latitude: number; longitude: number }, days: number = 3): Observable<ForecastData> {
    let params: any = {
      key: environment.weatherApiKey,
      days: days.toString(),
      aqi: 'yes',
      alerts: 'yes',
      units: this.userSettings.units
    };

    if (typeof location === 'string') {
      params.q = location;
    } else {
      params.q = `${location.latitude},${location.longitude}`;
    }

    return this.http.get<any>(`${environment.weatherApiBaseUrl}/forecast.json`, { params }).pipe(
      map(response => ({
        cityName: response.location.name,
        latitude: response.location.lat,
        longitude: response.location.lon,
        hourly: response.forecast.forecastday.flatMap((day: any) => 
          day.hour.map((hour: any) => ({
            time: hour.time,
            temperature: hour.temp_c,
            condition: hour.condition.text,
            icon: hour.condition.icon,
            humidity: hour.humidity,
            windSpeed: hour.wind_kph,
            windDirection: hour.wind_dir,
            precipitation: hour.precip_mm,
            uvIndex: hour.uv
          }))
        ),
        daily: response.forecast.forecastday.map((day: any) => ({
          day: new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
          date: day.date,
          high: day.day.maxtemp_c,
          low: day.day.mintemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon
        }))
      }))
    );
  }

  /**
   * Gets coordinates for a given city name.
   * This is a public method that can be used directly for the map feature
   */
  getCoordinatesForCity(cityName: string): Observable<{ lat: number; lon: number }> {
    const geocodingUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1`;
    
    return this.http.get(geocodingUrl).pipe(
      map((response: any) => {
        if (response.results && response.results.length > 0) {
          return {
            lat: response.results[0].latitude,
            lon: response.results[0].longitude
          };
        }
        throw new Error('City not found');
      }),
      catchError(error => {
        console.error('Error getting coordinates for city:', error);
        throw new Error('Unable to find location. Please try a different city name.');
      })
      
      
  getHourlyForecast(latitude: number, longitude: number): Observable<HourlyForecast[]> {
    const params = {
      key: environment.weatherApiKey,
      q: `${latitude},${longitude}`,
      days: '1',
      aqi: 'no'
    };
    return this.http.get<any>(`${environment.weatherApiBaseUrl}/forecast.json`, { params }).pipe(
      map(response => 
        response.forecast.forecastday[0].hour.map((hour: any) => ({
          time: hour.time,
          temperature: hour.temp_c,
          condition: hour.condition.text,
          icon: hour.condition.icon,
          humidity: hour.humidity,
          windSpeed: hour.wind_kph,
          windDirection: hour.wind_dir,
          precipitation: hour.precip_mm,
          uvIndex: hour.uv
        }))
      )
    );
  }

  getDailyForecast(latitude: number, longitude: number): Observable<DailyForecast[]> {
    const params = {
      key: environment.weatherApiKey,
      q: `${latitude},${longitude}`,
      days: '3',
      aqi: 'no'
    };
    return this.http.get<any>(`${environment.weatherApiBaseUrl}/forecast.json`, { params }).pipe(
      map(response => 
        response.forecast.forecastday.map((day: any) => ({
          day: new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
          date: day.date,
          high: day.day.maxtemp_c,
          low: day.day.mintemp_c,
          condition: day.day.condition.text,
          icon: day.day.condition.icon
        }))
      )
    );
  }


  getMapOverlay(type: 'temperature' | 'precipitation' | 'wind' | 'clouds'): Observable<any> {
    const params = {
      key: environment.weatherApiKey,
      q: 'auto:ip', // Use IP-based location for the map center
      aqi: 'no'
    };

    return this.http.get<any>(`${environment.weatherApiBaseUrl}/forecast.json`, { params }).pipe(
      map(response => {
        const location = response.location;
        const forecast = response.forecast.forecastday[0];
        
        switch (type) {
          case 'temperature':
            return {
              type: 'temperature',
              data: forecast.hour.map((hour: any) => ({
                time: hour.time,
                value: hour.temp_c,
                location: { lat: location.lat, lon: location.lon }
              }))
            };
          case 'precipitation':
            return {
              type: 'precipitation',
              data: forecast.hour.map((hour: any) => ({
                time: hour.time,
                value: hour.precip_mm,
                location: { lat: location.lat, lon: location.lon }
              }))
            };
          case 'wind':
            return {
              type: 'wind',
              data: forecast.hour.map((hour: any) => ({
                time: hour.time,
                speed: hour.wind_kph,
                direction: hour.wind_dir,
                location: { lat: location.lat, lon: location.lon }
              }))
            };
          case 'clouds':
            return {
              type: 'clouds',
              data: forecast.hour.map((hour: any) => ({
                time: hour.time,
                value: hour.cloud,
                location: { lat: location.lat, lon: location.lon }
              }))
            };
          default:
            throw new Error(`Unsupported overlay type: ${type}`);
        }
      })
    );
  }
} 