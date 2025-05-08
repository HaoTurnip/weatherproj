import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

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
    MatProgressSpinnerModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h2 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {{ isLoginMode ? 'Welcome Back' : 'Create Account' }}
          </h2>
          <p class="text-gray-600 dark:text-gray-400">
            {{ isLoginMode ? 'Sign in to your account' : 'Join us today' }}
          </p>
        </div>

        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90">
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Email address</mat-label>
              <input matInput formControlName="email" type="email" required>
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('email')?.hasError('email')">
                Please enter a valid email address
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Password</mat-label>
              <input matInput formControlName="password" type="password" required>
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="loginForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <div class="flex items-center justify-between">
              <button mat-button type="button" (click)="toggleMode()" 
                      class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                {{ isLoginMode ? 'Need an account?' : 'Already have an account?' }}
              </button>
            </div>

            <button mat-raised-button color="primary" type="submit" 
                    class="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    [disabled]="loginForm.invalid || loading">
              @if (loading) {
                <mat-spinner diameter="24" class="mx-auto"></mat-spinner>
              } @else {
                {{ isLoginMode ? 'Sign in' : 'Sign up' }}
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host ::ng-deep {
      .mat-mdc-form-field {
        width: 100%;
      }
      .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }
      .mat-mdc-form-field-infix {
        padding-top: 8px;
        padding-bottom: 8px;
      }
      .mat-mdc-form-field-outline {
        background: rgba(255, 255, 255, 0.05);
      }
      .dark .mat-mdc-form-field-outline {
        background: rgba(0, 0, 0, 0.05);
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoginMode = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.loginForm.reset();
  }

  onSubmit() {
    if (this.loginForm.invalid) return;

    this.loading = true;
    const { email, password } = this.loginForm.value;

    const auth$ = this.isLoginMode
      ? this.authService.login(email, password)
      : this.authService.register(email, password);

    auth$.subscribe({
      next: () => {
        this.notificationService.showSuccess(
          this.isLoginMode ? 'Successfully logged in!' : 'Account created successfully!'
        );
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.notificationService.showError(error);
        this.loading = false;
      }
    });
  }
} 