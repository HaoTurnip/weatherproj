import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../core/services/firebase.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { Alert } from '../../core/models/alert.model';

@Component({
  selector: 'app-new-alert-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Create New Weather Alert</h2>
      <mat-dialog-content>
        @if (loading) {
          <div class="loading-overlay">
            <mat-spinner diameter="40"></mat-spinner>
            <p>Creating alert...</p>
          </div>
        }
        <form [formGroup]="form" class="alert-form" [class.loading]="loading">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Title</mat-label>
            <input matInput formControlName="title" required>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" required rows="4"></textarea>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Weather Type</mat-label>
            <mat-select formControlName="type" required>
              <mat-option value="Thunderstorm">Thunderstorm</mat-option>
              <mat-option value="Rain">Rain</mat-option>
              <mat-option value="Snow">Snow</mat-option>
              <mat-option value="Fog">Fog</mat-option>
              <mat-option value="Wind">Wind</mat-option>
              <mat-option value="Heat">Heat</mat-option>
              <mat-option value="Cold">Cold</mat-option>
              <mat-option value="Flood">Flood</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Severity</mat-label>
            <mat-select formControlName="severity" required>
              <mat-option value="extreme">Extreme</mat-option>
              <mat-option value="severe">Severe</mat-option>
              <mat-option value="moderate">Moderate</mat-option>
              <mat-option value="minor">Minor</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Location</mat-label>
            <input matInput formControlName="location" required>
          </mat-form-field>

          <div class="date-range">
            <mat-form-field appearance="outline">
              <mat-label>Start Time</mat-label>
              <input matInput [matDatepicker]="startPicker" formControlName="startTime" required>
              <mat-datepicker-toggle matSuffix [for]="startPicker"></mat-datepicker-toggle>
              <mat-datepicker #startPicker></mat-datepicker>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>End Time</mat-label>
              <input matInput [matDatepicker]="endPicker" formControlName="endTime" required>
              <mat-datepicker-toggle matSuffix [for]="endPicker"></mat-datepicker-toggle>
              <mat-datepicker #endPicker></mat-datepicker>
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" [disabled]="loading">Cancel</button>
        <button mat-raised-button color="primary" (click)="onSubmit()" [disabled]="!form.valid || loading">
          Create Alert
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 20px;
      max-width: 600px;
      position: relative;
    }

    .alert-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .alert-form.loading {
      opacity: 0.5;
      pointer-events: none;
    }

    .full-width {
      width: 100%;
    }

    .date-range {
      display: flex;
      gap: 16px;
    }

    mat-form-field {
      flex: 1;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .loading-overlay p {
      margin-top: 16px;
      color: #666;
    }
  `]
})
export class NewAlertDialogComponent {
  private dialogRef = inject(MatDialogRef);
  private firebaseService = inject(FirebaseService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  loading = false;
  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      severity: ['moderate', Validators.required],
      location: ['', Validators.required],
      startTime: [new Date(), Validators.required],
      endTime: [new Date(), Validators.required]
    });
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.loading = true;
        const currentUser = this.authService.getCurrentUser();
        
        if (!currentUser) {
          this.snackBar.open('Please sign in to create alerts', 'Sign In', {
            duration: 5000
          }).onAction().subscribe(() => {
            this.dialogRef.close();
            this.router.navigate(['/login'], {
              queryParams: {
                returnUrl: '/alerts',
                message: 'Please sign in to create weather alerts'
              }
            });
          });
          return;
        }

        const formValue = this.form.value;
        
        // Validate dates
        if (formValue.startTime > formValue.endTime) {
          throw new Error('End time must be after start time');
        }

        // Create alert object with proper date handling
        const alertData = {
          ...formValue,
          userId: currentUser.uid,
          startTime: new Date(formValue.startTime),
          endTime: new Date(formValue.endTime)
        };

        console.log('Creating alert with data:', alertData);
        await this.firebaseService.addAlert(alertData);

        // Close the dialog first
        this.dialogRef.close(true);
        
        // Then show the success message
        this.snackBar.open('Alert created successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        });
      } catch (error: any) {
        console.error('Error creating alert:', error);
        this.snackBar.open(error.message || 'Failed to create alert. Please try again.', 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      } finally {
        this.loading = false;
      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 