import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../../core/services/theme.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    RouterLink
  ],
  template: `
    <div class="auth-container">
      <mat-card class="signup-card">
        <mat-card-header>
          <mat-card-title class="text-2xl font-bold mb-6">Create Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <div class="search-field-wrapper">
              <span class="search-icon">
                <mat-icon>person</mat-icon>
              </span>
              <input matInput class="search-input" formControlName="displayName" placeholder="Full Name" required>
            </div>
            
            <div class="search-field-wrapper">
              <span class="search-icon">
                <mat-icon>email</mat-icon>
              </span>
              <input matInput class="search-input" type="email" formControlName="email" placeholder="Email" required>
            </div>
            
            <div class="search-field-wrapper">
              <span class="search-icon">
                <mat-icon>lock</mat-icon>
              </span>
              <input matInput class="search-input" type="password" formControlName="password" placeholder="Password" required>
            </div>
            
            <div class="search-field-wrapper">
              <span class="search-icon">
                <mat-icon>lock_outline</mat-icon>
              </span>
              <input matInput class="search-input" type="password" formControlName="confirmPassword" placeholder="Confirm Password" required>
            </div>
            
            <button mat-raised-button color="primary" type="submit" class="w-full" [disabled]="!form.valid">
              Sign Up
            </button>
          </form>

          <mat-divider class="my-6"></mat-divider>

          <button mat-stroked-button color="primary" (click)="loginWithGoogle()" class="w-full">
            <mat-icon>google</mat-icon>
            <span class="ml-2">Sign up with Google</span>
          </button>

          <div class="mt-4 text-center">
            <span>Already have an account? </span>
            <a routerLink="/login" class="text-primary">Login</a>
          </div>

          @if (error) {
            <div class="text-red-500 mt-4">{{ error }}</div>
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: var(--bg-light,rgba(241, 245, 249, 0));
      padding: 1rem;
    }

    :host-context(.dark-theme) .auth-container {
      background-color: var(--bg-dark, #0f172a);
    }

    .signup-card {
      background: white;
      color: var(--text-primary);
      border-radius: 12px;
      padding: 24px;
      width: 100%;
      max-width: 400px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    :host-context(.dark-theme) .signup-card {
      background: var(--card-dark, #1e293b);
      color: white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    }

    /* Custom Search/Input Styles */
    .search-field-wrapper {
      display: flex;
      align-items: center;
      background: var(--card-light, #f8fafc);
      border: 1px solid var(--border-light, #e2e8f0);
      border-radius: var(--radius-full, 9999px);
      padding: 0.5rem 0.875rem;
      transition: all 0.2s ease;
      box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      margin: 0.75rem 0;
      width: 100%;
    }

    .search-field-wrapper:focus-within {
      border-color: var(--primary-color, #3b82f6);
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
      transform: translateY(-1px);
    }

    :host-context(.dark-theme) .search-field-wrapper {
      background: var(--card-dark, #1e293b);
      border-color: var(--border-dark, #334155);
    }

    .search-icon {
      color: var(--text-tertiary, #64748b);
      margin-right: 0.5rem;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    :host-context(.dark-theme) .search-icon {
      color: var(--text-tertiary-dark, #94a3b8);
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 0.9rem;
      color: var(--text-primary, #334155);
      padding: 0.4rem 0;
      font-family: inherit;
      width: 100%;
    }

    :host-context(.dark-theme) .search-input {
      color: var(--text-primary-dark, #f8fafc);
    }

    .search-input::placeholder {
      color: var(--text-tertiary, #64748b);
    }

    :host-context(.dark-theme) .search-input::placeholder {
      color: var(--text-tertiary-dark, #94a3b8);
    }

    /* Button styling */
    button[mat-raised-button] {
      background-color: var(--primary-color, #3b82f6);
      color: white;
    }

    :host-context(.dark-theme) button[mat-raised-button] {
      background-color: var(--primary-light, #60a5fa);
    }

    button[mat-stroked-button] {
      border-color: var(--primary-color, #3b82f6);
      color: var(--primary-color, #3b82f6);
    }

    :host-context(.dark-theme) button[mat-stroked-button] {
      border-color: var(--primary-light, #60a5fa);
      color: var(--primary-light, #60a5fa);
    }

    button[mat-button] {
      color: var(--primary-color, #3b82f6);
    }

    :host-context(.dark-theme) button[mat-button] {
      color: var(--primary-light, #60a5fa);
    }

    .text-primary {
      color: var(--primary-color, #3b82f6);
    }

    :host-context(.dark-theme) .text-primary {
      color: var(--primary-light, #60a5fa);
    }

    .text-red-500 {
      color: #ef4444;
    }

    mat-divider {
      margin: 1.5rem 0;
      opacity: 0.2;
    }
  `]
})
export class SignupComponent {
  form: FormGroup;
  error: string = '';
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      const { displayName, email, password, confirmPassword } = this.form.value;
      
      if (password !== confirmPassword) {
        this.error = 'Passwords do not match';
        return;
      }

      try {
        await this.authService.signUp(email, password, displayName);
        this.router.navigate(['/']);
      } catch (error) {
        console.error('Error signing up:', error);
        this.snackBar.open('Failed to create account', 'Close', { duration: 3000 });
      }
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      this.router.navigate(['/']);
    } catch (error: any) {
      this.error = error.message;
    }
  }
} 