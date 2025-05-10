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
  selector: 'app-login',
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
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title>Welcome Back</mat-card-title>
          <mat-card-subtitle>Sign in to your account</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="Enter your email">
              <mat-icon matSuffix>email</mat-icon>
              @if (loginForm.get('email')?.hasError('required') && loginForm.get('email')?.touched) {
                <mat-error>Email is required</mat-error>
              }
              @if (loginForm.get('email')?.hasError('email') && loginForm.get('email')?.touched) {
                <mat-error>Please enter a valid email</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" [type]="hidePassword ? 'password' : 'text'">
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
              @if (loginForm.get('password')?.hasError('required') && loginForm.get('password')?.touched) {
                <mat-error>Password is required</mat-error>
              }
            </mat-form-field>

            <div class="forgot-password">
              <a routerLink="/forgot-password">Forgot Password?</a>
            </div>

            <button mat-raised-button color="primary" class="full-width" type="submit" [disabled]="loading">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Sign In
              }
            </button>
          </form>

          <mat-divider class="divider">or</mat-divider>

          <button mat-stroked-button class="full-width google-btn" (click)="loginWithGoogle()" [disabled]="loading">
            <img src="assets/google-logo.svg" alt="Google logo" class="google-logo">
            Continue with Google
          </button>
        </mat-card-content>

        <mat-card-footer>
          <p class="signup-link">
            Don't have an account? <a routerLink="/signup">Sign up</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      padding: 2rem;
      background: #f4f6fb;
      transition: background 0.3s;
    }
    .dark-theme .login-container {
      background: #181c23;
    }
    .login-card {
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
    .dark-theme .login-card {
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
    .forgot-password {
      text-align: right;
      margin: -0.75rem 0 1.5rem;
    }
    .forgot-password a {
      color: #1976d2;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s ease;
    }
    .forgot-password a:hover {
      color: #1557b0;
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
    .signup-link {
      text-align: center;
      margin-top: 2rem;
      color: #888;
      font-size: 0.95rem;
    }
    .signup-link a {
      color: #1976d2;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.2s;
    }
    .signup-link a:hover {
      color: #1557b0;
    }
    .dark-theme .signup-link {
      color: #b0bec5;
    }
    .dark-theme .signup-link a {
      color: #90caf9;
    }
    @media (max-width: 600px) {
      .login-card {
        padding: 1.2rem;
      }
      mat-card-title {
        font-size: 1.3rem;
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      this.loading = true;
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.signIn(email, password);
        this.router.navigate(['/']);
      } catch (error: any) {
        this.snackBar.open(error.message || 'Failed to sign in', 'Close', {
          duration: 5000
        });
      } finally {
        this.loading = false;
      }
    }
  }

  async loginWithGoogle() {
    this.loading = true;
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.snackBar.open(error.message || 'Failed to sign in with Google', 'Close', {
        duration: 5000
      });
    } finally {
      this.loading = false;
    }
  }
} 