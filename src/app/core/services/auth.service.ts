import { Injectable, inject } from '@angular/core';
import { 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { FIREBASE_AUTH } from '../../app.config';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(FIREBASE_AUTH);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    // Subscribe to auth state changes
    this.auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user);
      this.currentUserSubject.next(user);
    });
  }

  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('Login successful:', userCredential.user);
      this.notificationService.showSuccess('Successfully logged in!');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Login error:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  async register(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      await updateProfile(userCredential.user, { displayName });
      console.log('Registration successful:', userCredential.user);
      this.notificationService.showSuccess('Account created successfully!');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Registration error:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      console.log('Google login successful:', userCredential.user);
      this.notificationService.showSuccess('Successfully logged in with Google!');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Google login error:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.notificationService.showSuccess('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset error:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      console.log('Logout successful');
      this.notificationService.showSuccess('Successfully logged out!');
      this.router.navigate(['/login']);
    } catch (error: any) {
      console.error('Logout error:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
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
      case 'auth/popup-closed-by-user':
        return 'Login popup was closed before completing the sign in.';
      case 'auth/cancelled-popup-request':
        return 'Multiple popup requests were made. Please try again.';
      case 'auth/popup-blocked':
        return 'The popup was blocked by the browser. Please allow popups for this site.';
      default:
        return 'An error occurred. Please try again.';
    }
  }
} 