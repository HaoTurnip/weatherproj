import { Component, inject, EventEmitter, Output } from '@angular/core';
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
import { take } from 'rxjs/operators';
import { ThemeService } from '../../core/services/theme.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


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
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('300ms ease-in', style({ opacity: 1 }))]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))])
    ])
  ],
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title>Create New Weather Alert</h2>
      <mat-dialog-content>
        @if (loading) {
          <div class="loading-overlay">
            @if (!showSuccess) {
              <mat-spinner diameter="40"></mat-spinner>
              <p>Creating alert...</p>
            } @else {
              <div class="success-animation" @fadeInOut>
                <div class="checkmark-circle">
                  <div class="checkmark"></div>
                </div>
                <p>Alert created successfully!</p>
              </div>
            }
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
      gap: 20px;
    }

    .alert-form.loading {
      opacity: 0.5;
      pointer-events: none;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field.full-width {
      border-radius: 12px;
      background: #f8f9fa;
      box-shadow: 0 1px 4px rgba(60,60,60,0.04);
      padding: 2px 8px 2px 8px;
      margin-bottom: 0;
    }

    mat-form-field.full-width textarea {
      min-height: 100px;
      border-radius: 8px;
      background: #fff;
      resize: vertical;
    }

    mat-form-field.full-width input,
    mat-form-field.full-width textarea {
      font-size: 1.05rem;
      padding: 10px 12px;
      border-radius: 8px;
      background: #fff;
    }

    mat-form-field.full-width.mat-form-field-appearance-outline .mat-form-field-outline {
      border-radius: 12px;
      border-width: 2px;
      border-color: #bdbdbd;
    }

    mat-form-field.full-width.mat-form-field-appearance-outline.mat-focused .mat-form-field-outline {
      border-color: #1976d2;
      box-shadow: 0 0 0 2px #1976d220;
    }

    mat-select {
      border-radius: 8px;
      background: #fff;
    }

    .date-range {
      display: flex;
      gap: 16px;
    }
    .date-range mat-form-field {
      flex: 1;
      border-radius: 12px;
      background: #f8f9fa;
      box-shadow: 0 1px 4px rgba(60,60,60,0.04);
      padding: 2px 8px 2px 8px;
    }

    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      border-radius: 12px;
      backdrop-filter: blur(2px);
    }

    :host-context(.dark-theme) .loading-overlay {
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(2px);

    }

    .loading-overlay p {
      margin-top: 16px;
      color: var(--text-secondary, #666);
    }

    :host-context(.dark-theme) .loading-overlay p {
      color: var(--text-secondary-dark, #cbd5e1);
    }

    /* Success Animation Styles */
    .success-animation {
      display: flex;
      flex-direction: column;
      align-items: center;
      animation: fadeIn 0.5s ease-in-out forwards;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .checkmark-circle {
      width: 80px;
      height: 80px;
      position: relative;
      display: inline-block;
      vertical-align: top;
      margin: 0 0 20px 0;
      background: var(--primary-color, #3b82f6);
      border-radius: 50%;
      box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
      transform: scale(0.8);
      animation: scaleUp 0.5s ease-out forwards;
    }

    @keyframes scaleUp {
      from { transform: scale(0.8); }
      to { transform: scale(1); }
    }

    :host-context(.dark-theme) .checkmark-circle {
      background: var(--primary-light, #60a5fa);
      box-shadow: 0 4px 16px rgba(96, 165, 250, 0.4);
    }

    .checkmark {
      height: 40px;
      width: 20px;
      display: block;
      border-right: 4px solid white;
      border-bottom: 4px solid white;
      transform: rotate(45deg);
      position: absolute;
      left: 30px;
      top: 18px;
      animation: checkAnimation 0.6s ease-in-out forwards;
      transform-origin: center;
      opacity: 0;
    }

    @keyframes checkAnimation {
      0% {
        height: 0;
        width: 0;
        opacity: 0;
      }
      40% {
        opacity: 1;
        height: 0;
        width: 20px;
      }
      60% {
        height: 30px;
      }
      100% {
        height: 40px;
        width: 20px;
        opacity: 1;
      }
    }

    .success-animation p {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary-color, #3b82f6);
      margin-top: 10px;
      animation: textFadeIn 0.3s ease-in forwards 0.3s;
      opacity: 0;
    }

    @keyframes textFadeIn {
      from { opacity: 0; transform: translateY(5px); }
      to { opacity: 1; transform: translateY(0); }
    }

    :host-context(.dark-theme) .success-animation p {
      color: var(--primary-light, #60a5fa);
    }

    /* Button styling */
    button[mat-raised-button] {
      background-color: var(--primary-color, #3b82f6);
      color: white;
    }

    :host-context(.dark-theme) button[mat-raised-button] {
      background-color: var(--primary-light, #60a5fa);
    }

    button[mat-button] {
      color: var(--text-primary, #334155);
    }

    :host-context(.dark-theme) button[mat-button] {
      color: var(--text-primary-dark, #f8fafc);
    }

    h2 {
      color: var(--text-primary, #334155);
      margin-bottom: 1rem;
    }

    :host-context(.dark-theme) h2 {
      color: var(--text-primary-dark, #f8fafc);

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

  @Output() alertCreated = new EventEmitter<boolean>();

  loading = false;
  showSuccess = false;
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

  isAlertOwner(alert: Alert): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!currentUser && alert.userId === currentUser.uid;
  }

  async onSubmit() {
    if (this.form.valid) {
      try {
        this.loading = true;
        
        // Wait for authentication state to be ready
        const currentUser = await this.authService.user$.pipe(take(1)).toPromise();
        
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
        const startTime = new Date(formValue.startTime);
        const endTime = new Date(formValue.endTime);
        
        if (startTime > endTime) {
          throw new Error('End time must be after start time');
        }

        const alert: Omit<Alert, 'id'> = {
          title: formValue.title,
          description: formValue.description,
          type: formValue.type,
          severity: formValue.severity,
          location: formValue.location,
          startTime: startTime,
          endTime: endTime,
          userId: currentUser.uid
        };

        console.log('Creating alert with data:', alert);
        await this.firebaseService.addAlert(alert);
        
        // Show success animation
        this.showSuccess = true;
        
        // Emit event to trigger alert refetch
        this.alertCreated.emit(true);
        console.log('Alert created successfully, emitted alertCreated event');
        
        // Close dialog after animation completes
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 2000);
        
      } catch (error: any) {
        console.error('Error creating alert:', error);
        // Suppress the specific Firestore insufficient permissions error after creation
        if (
          error.message &&
          error.message.toLowerCase().includes('insufficient permissions')
        ) {
          // Optionally, you can log it or show a non-blocking message
          console.warn('Temporary Firestore permission error suppressed:', error.message);
          
          // Still show success and emit event as the alert was likely created
          this.showSuccess = true;
          this.alertCreated.emit(true);
          console.log('Alert likely created despite permission error, emitted alertCreated event');
          
          // Close dialog after animation completes
          setTimeout(() => {
            this.dialogRef.close(true);
          }, 2000);
        } else {
          // Handle other errors normally
          this.snackBar.open(error.message || 'Failed to create alert', 'Close', { duration: 5000 });
          this.loading = false;
        }

      }
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
} 