import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, forkJoin, of, switchMap } from 'rxjs';
import { WeatherData, HourlyForecast, DailyForecast } from '../models/weather.model';
import { ForecastData } from '../models/weather.model';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private baseUrl = 'https://api.open-meteo.com/v1';

  constructor(private http: HttpClient) {}

  getCurrentWeather(latitude: number, longitude: number): Observable<WeatherData> {
    const url = `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,weather_code,uv_index`;
    
    return this.http.get(url).pipe(
      map((response: any) => {
        const current = response.current;
        return {
          temperature: current.temperature_2m,
          condition: this.getWeatherCondition(current.weather_code),
          icon: this.getWeatherIcon(current.weather_code),
          humidity: current.relative_humidity_2m,
          windSpeed: current.wind_speed_10m,
          windDirection: this.getWindDirection(current.wind_direction_10m),
          precipitation: current.precipitation,
          uvIndex: current.uv_index
        };
      })
    );
  }

  getHourlyForecast(latitude: number, longitude: number): Observable<HourlyForecast[]> {
    const url = `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,wind_direction_10m,precipitation,uv_index`;
    
    return this.http.get(url).pipe(
      map((response: any) => {
        const hourly = response.hourly;
        return hourly.time.map((time: string, index: number) => ({
          time: new Date(time).toLocaleTimeString([], { hour: 'numeric' }),
          temperature: hourly.temperature_2m[index],
          condition: this.getWeatherCondition(hourly.weather_code[index]),
          icon: this.getWeatherIcon(hourly.weather_code[index]),
          humidity: hourly.relative_humidity_2m[index],
          windSpeed: hourly.wind_speed_10m[index],
          windDirection: this.getWindDirection(hourly.wind_direction_10m[index]),
          precipitation: hourly.precipitation[index],
          uvIndex: hourly.uv_index[index]
        })).slice(0, 24);
      })
    );
  }

  getDailyForecast(latitude: number, longitude: number): Observable<DailyForecast[]> {
    const url = `${this.baseUrl}/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code,temperature_2m_max,temperature_2m_min`;
    
    return this.http.get(url).pipe(
      map((response: any) => {
        const daily = response.daily;
        return daily.time.map((time: string, index: number) => ({
          day: new Date(time).toLocaleDateString([], { weekday: 'short' }),
          high: daily.temperature_2m_max[index],
          low: daily.temperature_2m_min[index],
          condition: this.getWeatherCondition(daily.weather_code[index]),
          icon: this.getWeatherIcon(daily.weather_code[index])
        })).slice(0, 5);
      })
    );
  }

  private getWeatherCondition(code: number): string {
    const conditions: { [key: number]: string } = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing Rime Fog',
      51: 'Light Drizzle',
      53: 'Moderate Drizzle',
      55: 'Dense Drizzle',
      61: 'Slight Rain',
      63: 'Moderate Rain',
      65: 'Heavy Rain',
      71: 'Slight Snow',
      73: 'Moderate Snow',
      75: 'Heavy Snow',
      77: 'Snow Grains',
      80: 'Slight Rain Showers',
      81: 'Moderate Rain Showers',
      82: 'Violent Rain Showers',
      85: 'Slight Snow Showers',
      86: 'Heavy Snow Showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with Slight Hail',
      99: 'Thunderstorm with Heavy Hail'
    };
    return conditions[code] || 'Unknown';
  }

  private getWeatherIcon(code: number): string {
    const icons: { [key: number]: string } = {
      0: 'assets/weather-icons/clear.svg',
      1: 'assets/weather-icons/clear.svg',
      2: 'assets/weather-icons/partly-cloudy.svg',
      3: 'assets/weather-icons/cloudy.svg',
      45: 'assets/weather-icons/cloudy.svg',
      48: 'assets/weather-icons/cloudy.svg',
      51: 'assets/weather-icons/rain.svg',
      53: 'assets/weather-icons/rain.svg',
      55: 'assets/weather-icons/rain.svg',
      61: 'assets/weather-icons/rain.svg',
      63: 'assets/weather-icons/rain.svg',
      65: 'assets/weather-icons/rain.svg',
      71: 'assets/weather-icons/rain.svg',
      73: 'assets/weather-icons/rain.svg',
      75: 'assets/weather-icons/rain.svg',
      77: 'assets/weather-icons/rain.svg',
      80: 'assets/weather-icons/rain.svg',
      81: 'assets/weather-icons/rain.svg',
      82: 'assets/weather-icons/rain.svg',
      85: 'assets/weather-icons/rain.svg',
      86: 'assets/weather-icons/rain.svg',
      95: 'assets/weather-icons/rain.svg',
      96: 'assets/weather-icons/rain.svg',
      99: 'assets/weather-icons/rain.svg'
    };
    return icons[code] || 'assets/weather-icons/clear.svg';
  }

  private getWindDirection(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
  }

  private getCoordinatesForCity(cityName: string): Observable<{ lat: number; lon: number }> {
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
      })
    );
  }

  getForecast(cityName: string): Observable<ForecastData> {
    return this.getCoordinatesForCity(cityName).pipe(
      switchMap(coords => 
        forkJoin({
          hourly: this.getHourlyForecast(coords.lat, coords.lon),
          daily: this.getDailyForecast(coords.lat, coords.lon)
        }).pipe(
          map(({ hourly, daily }) => ({
            cityName,
            hourly,
            daily
          }))
        )
      )
    );
  }

  getMapOverlay(overlayType: string): Observable<any> {
    // Stub: return dummy overlay
    return of({ overlayType, url: 'https://example.com/overlay.png' });
  }
} 