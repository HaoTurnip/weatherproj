import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { WeatherAlert } from '../../../core/models/alert.model';

@Component({
  selector: 'app-alert-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatIconModule],
  template: `
    <mat-card class="alert-card" [class.active]="alert.isActive">
      <mat-card-header>
        <mat-card-title>{{ alert.title }}</mat-card-title>
        <mat-card-subtitle>{{ alert.area }}</mat-card-subtitle>
        <div class="severity-chip" [class]="alert.severity.toLowerCase()">
          {{ alert.severity }}
        </div>
      </mat-card-header>

      <mat-card-content>
        <p class="description">{{ alert.description }}</p>
        
        <div class="alert-details">
          <div class="detail-item">
            <mat-icon>schedule</mat-icon>
            <span>Start: {{ alert.startTime | date:'medium' }}</span>
          </div>
          <div class="detail-item">
            <mat-icon>schedule</mat-icon>
            <span>End: {{ alert.endTime | date:'medium' }}</span>
          </div>
          <div class="detail-item">
            <mat-icon>category</mat-icon>
            <span>Type: {{ alert.type }}</span>
          </div>
          <div class="detail-item">
            <mat-icon>source</mat-icon>
            <span>Source: {{ alert.source }}</span>
          </div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .alert-card {
      max-width: 400px;
      margin: 1rem;
      border-radius: 16px;
      background: #fff;
      color: #333;
      transition: all 0.3s ease;
      border-left: 4px solid #1976d2;
    }

    :host-context(.dark-theme) .alert-card {
      background: #232a34;
      color: #f4f6fb;
    }

    .alert-card.active {
      border-left-color: #f44336;
    }

    mat-card-header {
      padding: 1rem;
      position: relative;
    }

    mat-card-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      padding-right: 100px;
    }

    mat-card-subtitle {
      font-size: 1rem;
      color: #666;
    }

    :host-context(.dark-theme) mat-card-subtitle {
      color: #b0bec5;
    }

    .severity-chip {
      position: absolute;
      top: 1rem;
      right: 1rem;
      padding: 0.25rem 0.75rem;
      border-radius: 999px;
      font-size: 0.8rem;
      font-weight: 600;
      text-transform: uppercase;
    }

    .severity-chip.extreme {
      background: #d32f2f;
      color: white;
    }

    .severity-chip.severe {
      background: #f57c00;
      color: white;
    }

    .severity-chip.moderate {
      background: #ffc107;
      color: #333;
    }

    .severity-chip.minor {
      background: #4caf50;
      color: white;
    }

    .description {
      padding: 1rem;
      font-size: 1rem;
      line-height: 1.5;
      margin: 0;
    }

    .alert-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 1rem;
      border-top: 1px solid #eee;
    }

    :host-context(.dark-theme) .alert-details {
      border-top-color: #333a4d;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    mat-icon {
      font-size: 1.2rem;
      width: 1.2rem;
      height: 1.2rem;
      color: #1976d2;
    }

    :host-context(.dark-theme) mat-icon {
      color: #90caf9;
    }

    @media (max-width: 600px) {
      .alert-card {
        margin: 0.5rem;
      }

      .alert-details {
        grid-template-columns: 1fr;
      }

      mat-card-title {
        padding-right: 0;
        margin-bottom: 2rem;
      }

      .severity-chip {
        top: auto;
        bottom: 0.5rem;
        right: 1rem;
      }
    }
  `]
})
export class AlertCardComponent {
  @Input() alert!: WeatherAlert;
} 