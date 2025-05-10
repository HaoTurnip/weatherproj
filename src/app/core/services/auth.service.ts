import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { User, UserSettings } from '../models/user.model';
import { NotificationService } from './notification.service';
import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();
  userSettings$: Observable<UserSettings | null> = this.user$.pipe(
    switchMap(user => {
      if (user) {
        return this.firestore.doc<User>(`users/${user.uid}`).valueChanges().pipe(
          map(userData => userData?.settings || null)
        );
      }
      return from([null]);
    })
  );

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router,
    private notificationService: NotificationService
  ) {
    this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<User>(`users/${user.uid}`).valueChanges().pipe(
            map(userData => userData || null)
          );
        } else {
          return from([null]);
        }
      })
    ).subscribe(user => {
      this.userSubject.next(user);
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

  async signUp(email: string, password: string, displayName: string): Promise<void> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      if (userCredential.user) {
        await this.createUserProfile(userCredential.user.uid, {
          uid: userCredential.user.uid,
          email,
          displayName,
          photoURL: userCredential.user.photoURL || undefined
        });
      }
    } catch (error) {
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

  async loginWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await this.afAuth.signInWithPopup(provider);
      if (userCredential.user) {
        await this.createUserProfile(userCredential.user.uid, {
          uid: userCredential.user.uid,
          email: userCredential.user.email!,
          displayName: userCredential.user.displayName || userCredential.user.email!,
          photoURL: userCredential.user.photoURL || undefined
        });
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      this.notificationService.showError(this.getErrorMessage(error.code));
      throw error;
    }
  }

  private async createUserProfile(uid: string, userData: User): Promise<void> {
    const defaultSettings: UserSettings = {
      theme: 'light',
      temperatureUnit: 'celsius',
      notifications: true,
      language: 'en'
    };

    await this.firestore.collection('users').doc(uid).set({
      ...userData,
      settings: defaultSettings
    });
  }

  async updateUserSettings(settings: Partial<UserSettings>): Promise<void> {
    const user = await this.user$.pipe(take(1)).toPromise();
    if (user) {
      await this.firestore.collection('users').doc(user.uid).update({
        settings: settings
      });
    }
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
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

  login(email: string, password: string): Promise<void> {
    // Here you would typically make an API call to your backend
    // For now, we'll just simulate a successful login
    return new Promise((resolve) => {
      localStorage.setItem('isLoggedIn', 'true');
      this.userSubject.next({
        uid: '',
        email,
        displayName: '',
        photoURL: ''
      });
      resolve();
    });
  }

  signup(email: string, password: string): Promise<void> {
    // Here you would typically make an API call to your backend
    // For now, we'll just simulate a successful signup
    return new Promise((resolve) => {
      localStorage.setItem('isLoggedIn', 'true');
      this.userSubject.next({
        uid: '',
        email,
        displayName: '',
        photoURL: ''
      });
      resolve();
    });
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this.userSubject.value;
  }
} 