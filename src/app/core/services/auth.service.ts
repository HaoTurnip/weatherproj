import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';
import { GoogleAuthProvider } from 'firebase/auth';

interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private notificationService: NotificationService
  ) {
    // Subscribe to auth state changes
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUserSubject.next({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || ''
        });
      } else {
        this.currentUserSubject.next(null);
      }
    });
  }

  async signIn(email: string, password: string): Promise<User> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      if (!result.user) {
        throw new Error('No user returned from sign in');
      }
      this.notificationService.showSuccess('Successfully logged in!');
      this.router.navigate(['/']);
      return {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || ''
      };
    } catch (error: any) {
      console.error('Error signing in:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  async signUp(email: string, password: string, displayName: string): Promise<User> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (!result.user) {
        throw new Error('No user returned from sign up');
      }
      
      // Update the user's display name
      await result.user.updateProfile({ displayName });
      
      this.notificationService.showSuccess('Account created successfully!');
      this.router.navigate(['/']);
      return {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || ''
      };
    } catch (error: any) {
      console.error('Error signing up:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.afAuth.signOut();
      this.notificationService.showSuccess('Successfully logged out!');
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Error signing out:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  async loginWithGoogle(): Promise<User> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await this.afAuth.signInWithPopup(provider);
      if (!result.user) {
        throw new Error('No user returned from Google sign in');
      }
      this.notificationService.showSuccess('Successfully logged in with Google!');
      this.router.navigate(['/']);
      return {
        uid: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || '',
        photoURL: result.user.photoURL || ''
      };
    } catch (error: any) {
      console.error('Google login error:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(
      map(user => !!user)
    );
  }

  async resetPassword(email: string): Promise<void> {
    try {
      await this.afAuth.sendPasswordResetEmail(email);
      this.notificationService.showSuccess('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return 'Invalid email or password';
      case 'auth/email-already-in-use':
        return 'Email is already in use';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Operation not allowed';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email address but different sign-in credentials';
      case 'auth/invalid-action-code':
        return 'Invalid or expired password reset link';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later';
      default:
        return 'An error occurred. Please try again.';
    }
  }
} 