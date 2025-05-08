import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { Observable, map, take, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseInitGuard implements CanActivate {
  constructor(
    private firebaseService: FirebaseService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.firebaseService.getInitializationStatus().pipe(
      take(1),
      tap(status => {
        if (status === 'error') {
          console.error('Firebase initialization failed');
          this.firebaseService.getErrorMessage().pipe(take(1)).subscribe(error => {
            console.error('Firebase error details:', error);
          });
        }
      }),
      map(status => {
        if (status === 'success') {
          return true;
        }
        if (status === 'error') {
          // Redirect to an error page or show error message
          this.router.navigate(['/error'], { 
            queryParams: { 
              message: 'Firebase initialization failed. Please try again later.' 
            }
          });
          return false;
        }
        // If still pending, wait for initialization
        return false;
      })
    );
  }
} 