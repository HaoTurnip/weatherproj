import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * @deprecated This component is deprecated in favor of direct Windy.com API integration.
 * See the MapComponent for the current implementation.
 * 
 * RIP web view idea
 * 
 * why does every site have to have to block the iframe?
 * 
 * I'm not even using the iframe for anything malicious i just want to load a map :(
 * 
 * Special thanks to Zoom earth for blocking the iframe and ruining my day
 */
@Component({
  selector: 'app-web-view',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule, MatButtonModule],
  template: `
    <div class="web-view-container">
      <div class="deprecation-warning">
        <mat-icon class="warning-icon">warning</mat-icon>
        <p class="warning-text">DEPRECATED: This component is no longer used thanks to direct Windy.com integration.</p>
      </div>
      
      <iframe
        *ngIf="safeUrl"
        [src]="safeUrl"
        frameborder="0"
        allowfullscreen
        referrerpolicy="no-referrer-when-downgrade"
        class="web-view-iframe"
        (load)="onIframeLoad()"
        (error)="onIframeError()"
      ></iframe>
      
      <div *ngIf="loading" class="loading-container">
        <mat-spinner diameter="40"></mat-spinner>
        <p class="loading-text">Loading weather map...</p>
      </div>
      
      <div *ngIf="error" class="error-container">
        <mat-icon class="error-icon">error_outline</mat-icon>
        <p class="error-text">Failed to load the weather map</p>
        <button mat-raised-button color="primary" (click)="reload()">
          Retry
        </button>
      </div>
    </div>
  `,
  styles: [`
    .web-view-container {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: var(--radius-lg);
      position: relative;
    }
    
    .web-view-iframe {
      width: 100%;
      height: 100%;
      border: none;
      border-radius: var(--radius-lg);
    }
    
    .deprecation-warning {
      display: flex;
      align-items: center;
      background-color: #fff3cd;
      color: #856404;
      padding: 10px 15px;
      border-radius: var(--radius-md);
      margin-bottom: 15px;
      border-left: 4px solid #ffc107;
    }
    
    .warning-icon {
      color: #ffc107;
      margin-right: 10px;
    }
    
    .warning-text {
      font-weight: 500;
      margin: 0;
    }
    
    :host-context(.dark-theme) .deprecation-warning {
      background-color: rgba(255, 193, 7, 0.2);
      color: #ffd54f;
      border-left-color: #ffd54f;
    }
    
    :host-context(.dark-theme) .warning-icon {
      color: #ffd54f;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: var(--card-light);
      color: var(--text-secondary);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
    }
    
    .loading-text {
      margin-top: 20px;
      font-size: 1rem;
    }
    
    .error-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      background-color: var(--card-light);
      color: var(--text-primary);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      padding: 1rem;
      text-align: center;
    }
    
    .error-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--error-color);
      margin-bottom: 16px;
    }
    
    .error-text {
      font-size: 1.1rem;
      margin-bottom: 20px;
    }
    
    :host-context(.dark-theme) .loading-container {
      background-color: var(--card-dark);
      color: var(--text-secondary-dark);
    }
    
    :host-context(.dark-theme) .error-container {
      background-color: var(--card-dark);
      color: var(--text-primary-dark);
    }
    
    :host-context(.dark-theme) .error-icon {
      color: var(--error-light);
    }
  `]
})
export class WebViewComponent implements OnChanges {
  @Input() url: string = '';
  safeUrl: SafeResourceUrl | null = null;
  loading = true;
  error = false;
  
  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url'] && this.url) {
      this.loading = true;
      this.error = false;
      this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
  }
  
  onIframeLoad(): void {
    this.loading = false;
  }
  
  onIframeError(): void {
    this.loading = false;
    this.error = true;
  }
  
  reload(): void {
    if (this.url) {
      this.ngOnChanges({ url: { currentValue: this.url, previousValue: '', firstChange: false, isFirstChange: () => false } });
    }
  }
} 