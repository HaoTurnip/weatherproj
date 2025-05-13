import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private citySubject = new BehaviorSubject<string>('New York');
  city$ = this.citySubject.asObservable();

  constructor() {
    // Load default city from localStorage on service initialization
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.defaultCity) {
        this.citySubject.next(settings.defaultCity);
      }
    }
  }

  setCity(city: string) {
    this.citySubject.next(city);
  }

  updateDefaultCity(city: string) {
    this.citySubject.next(city);
    // Update localStorage
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      settings.defaultCity = city;
      localStorage.setItem('userSettings', JSON.stringify(settings));
    }
  }
} 