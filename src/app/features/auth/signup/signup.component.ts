import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RouterModule
  ],
  template: `
    <div class="signup-container">
      <mat-card class="signup-card">
        <mat-card-header>
          <mat-card-title>Create Account</mat-card-title>
          <mat-card-subtitle>Join our weather community</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="displayName" placeholder="Enter your full name">
              <mat-icon matSuffix>person</mat-icon>
              @if (signupForm.get('displayName')?.hasError('required') && signupForm.get('displayName')?.touched) {
                <mat-error>Name is required</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-icon matSuffix>email</mat-icon>
              @if (signupForm.get('email')?.hasError('required') && signupForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (signupForm.get('email')?.hasError('email') && signupForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (signupForm.get('password')?.hasError('required') && signupForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
              @if (signupForm.get('password')?.hasError('minlength') && signupForm.get('password')?.touched) {
                <mat-error>Password must be at least 6 characters</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput formControlName="confirmPassword" [type]="hidePassword ? 'password' : 'text'">
              @if (signupForm.hasError('passwordMismatch') && signupForm.get('confirmPassword')?.touched) {
                <mat-error>Passwords do not match</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="loading">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Create Account
              }
            </button>
          </form>

          <mat-divider class="divider">or</mat-divider>

          <button mat-stroked-button class="full-width google-btn" (click)="signupWithGoogle()" [disabled]="loading">
            <img src="assets/google-logo.svg" alt="Google logo" class="google-logo">
            Continue with Google
          </button>
        </mat-card-content>

        <mat-card-footer>
          <p class="login-link">
            Already have an account? <a routerLink="/login">Sign in</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .signup-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
      background: #f4f6fb;
      transition: background 0.3s;
    }
    .dark-theme .signup-container {
      background: #181c23;
    }
    .signup-card {
      max-width: 420px;
      width: 100%;
      padding: 2.5rem;
      border-radius: 18px;
      box-shadow: 0 4px 20px rgba(30, 64, 175, 0.10);
      background: #fff;
      color: #222;
      font-family: 'Roboto', 'Segoe UI', Arial, sans-serif;
      transition: background 0.3s, color 0.3s;
    }
    .dark-theme .signup-card {
      background: #232a34;
      color: #f4f6fb;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }
    mat-card-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    mat-card-title {
      font-size: 2rem;
      color: #1976d2;
      margin-bottom: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .dark-theme mat-card-title {
      color: #90caf9;
    }
    mat-card-subtitle {
      color: #666;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .dark-theme mat-card-subtitle {
      color: #b0bec5;
    }
    .full-width {
      width: 100%;
      margin-bottom: 1.5rem;
    }
    mat-form-field {
      margin-bottom: 1.25rem;
    }
    .divider {
      margin: 2rem 0;
      text-align: center;
      color: #888;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .divider::before,
    .divider::after {
      content: '';
      display: inline-block;
      width: 35%;
      height: 1px;
      background: #e0e0e0;
      vertical-align: middle;
      margin: 0 1rem;
    }
    .dark-theme .divider {
      color: #b0bec5;
    }
    .dark-theme .divider::before,
    .dark-theme .divider::after {
      background: #333a4d;
    }
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 0.75rem 1.5rem;
      border: 1.5px solid #e0e0e0;
      background: #fff;
      border-radius: 999px;
      font-weight: 600;
      font-size: 1rem;
      transition: background-color 0.2s, border 0.2s;
    }
    .google-btn:hover {
      background-color: #f4f6fb;
      border-color: #1976d2;
    }
    .dark-theme .google-btn {
      background: #232a34;
      color: #90caf9;
      border: 1.5px solid #333a4d;
    }
    .dark-theme .google-btn:hover {
      background: #181c23;
      border-color: #90caf9;
    }
    .google-logo {
      width: 20px;
      height: 20px;
    }
    .login-link {
      text-align: center;
      margin-top: 2rem;
      color: #888;
      font-size: 0.95rem;
    }
    .login-link a {
      color: #1976d2;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    .login-link a:hover {
      color: #1557b0;
    }
    .dark-theme .login-link {
      color: #b0bec5;
    }
    .dark-theme .login-link a {
      color: #90caf9;
    }
    @media (max-width: 600px) {
      .signup-card {
        padding: 1.2rem;
      }
      mat-card-title {
        font-size: 1.3rem;
      }
    }
  `]
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  signupForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor() {
    this.signupForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password?.value !== confirmPassword?.value) {
      confirmPassword?.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }
  }

  async onSubmit() {
    if (this.signupForm.valid) {
      this.loading = true;
      try {
        const { email, password, displayName } = this.signupForm.value;
        await this.authService.signUp(email, password, displayName);
        this.router.navigate(['/']);
      } catch (error: any) {
        this.snackBar.open(error.message || 'Failed to create account', 'Close', {
          duration: 5000
        });
      } finally {
        this.loading = false;
      }
    }
  }

  async signupWithGoogle() {
    this.loading = true;
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to sign up with Google', 'Close', {
        duration: 5000
      });
    } finally {
      this.loading = false;
    }
  }
} 