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
    <div class="flex justify-center items-center min-h-screen" [class.bg-gray-100]="!(isDarkMode$ | async)" [class.bg-gray-900]="isDarkMode$ | async">
      <mat-card class="signup-card" [class.dark]="isDarkMode$ | async">
        <mat-card-header>
          <mat-card-title class="text-2xl font-bold mb-6">Create Account</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col gap-4">
            <mat-form-field appearance="outline">
              <mat-label>Full Name</mat-label>
              <input matInput formControlName="displayName" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput type="email" formControlName="email" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required>
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" required>
            </mat-form-field>
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
    .signup-card {
      background: linear-gradient(135deg, var(--primary-blue), var(--secondary-blue));
      color: white;
      border-radius: 12px;
      padding: 24px;
      width: 100%;
      max-width: 400px;
      transition: all 0.3s ease;
    }

    .signup-card.dark {
      background: linear-gradient(135deg, var(--dark-blue), var(--primary-blue));
    }

    .signup-card .mat-mdc-form-field {
      color: white;
    }

    .signup-card .mat-mdc-form-field-label {
      color: rgba(255, 255, 255, 0.8);
    }

    .signup-card .mat-mdc-form-field-outline {
      color: rgba(255, 255, 255, 0.3);
    }

    .signup-card .mat-mdc-input-element {
      color: white;
    }

    .signup-card .mat-mdc-button {
      color: white;
    }

    .signup-card .mat-mdc-raised-button {
      background-color: white;
      color: var(--primary-blue);
    }

    .signup-card .mat-mdc-raised-button:hover {
      background-color: rgba(255, 255, 255, 0.9);
    }

    .signup-card .mat-mdc-stroked-button {
      border-color: white;
      color: white;
    }

    .signup-card .mat-mdc-stroked-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    .signup-card .text-primary {
      color: white;
      text-decoration: underline;
    }

    .signup-card .text-primary:hover {
      color: rgba(255, 255, 255, 0.8);
    }

    .text-red-500 {
      color: #ef4444;
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