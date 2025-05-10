export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  settings?: UserSettings;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  temperatureUnit: 'celsius' | 'fahrenheit';
  defaultCity?: string;
  notifications: boolean;
  language: string;
} 