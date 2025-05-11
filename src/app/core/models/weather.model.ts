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
  hourly: HourlyForecast[];
  daily: DailyForecast[];
} 