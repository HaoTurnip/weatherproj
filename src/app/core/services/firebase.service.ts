import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  private auth = getAuth(this.app);
  
  private initializationStatus = new BehaviorSubject<'pending' | 'success' | 'error'>('success');
  private errorMessage = new BehaviorSubject<string>('');

  constructor() {
    console.log('Firebase initialized with:', {
      projectId: environment.firebase.projectId,
      authDomain: environment.firebase.authDomain
    });
  }

  getAuth() {
    return this.auth;
  }

  getInitializationStatus(): Observable<'pending' | 'success' | 'error'> {
    return this.initializationStatus.asObservable();
  }

  getErrorMessage(): Observable<string> {
    return this.errorMessage.asObservable();
  }
} 