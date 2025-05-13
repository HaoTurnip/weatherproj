export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  uvIndex: number;
  cityName?: string;
}

/**
 * Home component specific weather data interface with different property names
 */
export interface HomeWeatherData {
  cityName: string;
  temp_c: number;
  condition: string;
  icon: string;
  humidity: number;
  wind_kph: number;
  wind_dir: string;
  precip_mm: number;
  uv: number;
  feelsLike?: number;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  precipitation: number;
  uvIndex: number;
}

export interface DailyForecast {
  day: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
}

export interface ForecastData {
  cityName: string;
  latitude: number;
  longitude: number;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
} 