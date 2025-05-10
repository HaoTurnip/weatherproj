import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  template: `
    <div class="skeleton-container" [ngStyle]="containerStyle">
      <div class="skeleton-header" *ngIf="showHeader">
        <div class="skeleton-circle"></div>
        <div class="skeleton-text">
          <div class="skeleton-line" style="width: 60%"></div>
          <div class="skeleton-line" style="width: 40%"></div>
        </div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-line" *ngFor="let line of lines" [style.width.%]="line"></div>
      </div>
      <div class="skeleton-footer" *ngIf="showFooter">
        <div class="skeleton-line" style="width: 30%"></div>
      </div>
    </div>
  `,
  styles: [`
    .skeleton-container {
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .skeleton-header {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
    }

    .skeleton-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f0f0f0;
      margin-right: 12px;
    }

    .skeleton-text {
      flex: 1;
    }

    .skeleton-line {
      height: 12px;
      background: #f0f0f0;
      border-radius: 4px;
      margin-bottom: 8px;
      animation: pulse 1.5s infinite;
    }

    .skeleton-content {
      margin: 16px 0;
    }

    .skeleton-footer {
      margin-top: 16px;
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.8; }
      100% { opacity: 0.6; }
    }
  `]
})
export class SkeletonLoaderComponent {
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() lines = [100, 80, 60];
  @Input() containerStyle = {};
} 