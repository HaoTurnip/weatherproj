import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CityService {
  private citySubject = new BehaviorSubject<string>('New York');
  city$ = this.citySubject.asObservable();

  setCity(city: string) {
    this.citySubject.next(city);
  }
} 