import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
  AuthError
} from 'firebase/auth';
import { Observable, from, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user = new BehaviorSubject<User | null>(null);

  constructor(private firebaseService: FirebaseService) {
    // Listen for auth state changes
    this.firebaseService.getAuth().onAuthStateChanged(user => {
      this.user.next(user);
    });
  }

  private handleAuthError(error: AuthError): string {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered.';
      case 'auth/invalid-email':
        return 'Invalid email address.';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled. Please contact support.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use a stronger password.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/wrong-password':
        return 'Incorrect password.';
      default:
        return 'An error occurred. Please try again.';
    }
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(
      this.firebaseService.getAuth(),
      email,
      password
    )).pipe(
      map(result => result.user),
      catchError(error => throwError(() => this.handleAuthError(error)))
    );
  }

  register(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(
      this.firebaseService.getAuth(),
      email,
      password
    )).pipe(
      map(result => result.user),
      catchError(error => throwError(() => this.handleAuthError(error)))
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.firebaseService.getAuth()));
  }

  isAuthenticated(): Observable<boolean> {
    return this.user.pipe(map(user => !!user));
  }

  getCurrentUser(): Observable<User | null> {
    return this.user.asObservable();
  }
} 