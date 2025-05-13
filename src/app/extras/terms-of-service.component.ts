import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="container">
      <mat-card class="terms-card">
        <h1>Terms of Service</h1>
        <p class="last-updated">Last updated: {{ currentDate | date:'longDate' }}</p>
        
        <section>
          <h2>The Basics</h2>
          <p>
            By using our weather app, you agree to these terms. It's that simple. If you don't agree, please don't use our app.
          </p>
        </section>

        <section>
          <h2>Using Our Service</h2>
          <p>
            We built this app to help you check the weather. Use it for that.
          </p>
          <p>
            Our data comes from various weather services. Sometimes it might not be 100% accurate. Don't plan your trip based solely on our app.
          </p>
        </section>

        <section>
          <h2>Your Account</h2>
          <p>
            Keep your password secret. We can't be responsible if you lose it, we literally don't have a password reset feature.
          </p>
          <p>
            Don't share your account with others. We haven't tested if that will break the app.
          </p>
        </section>

        <section>
          <h2>Content Rules</h2>
          <p>
            If you can post content on our app (like in the weather forums or alert comments), keep it clean and legal. No spam, no being a jerk.
          </p>
        </section>

        <section>
          <h2>Changes</h2>
          <p>
            We might update these terms occasionally. We'll let you know when we do.
          </p>
          <p>
            If you keep using the app after we change the terms, that means you're cool with the new rules.
          </p>
        </section>

        <section>
          <h2>Termination</h2>
          <p>
            We can suspend or terminate your account for literally any reason. We're not responsible for anything. call my lawyer.
          </p>
        </section>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .terms-card {
      padding: 2rem;
      border-radius: 12px;
    }

    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: var(--primary-color);
    }

    :host-context(.dark-theme) h1 {
      color: var(--primary-light);
    }

    .last-updated {
      color: var(--text-tertiary);
      margin-bottom: 2rem;
      font-style: italic;
    }

    :host-context(.dark-theme) .last-updated {
      color: var(--text-tertiary-dark);
    }

    h2 {
      font-size: 1.5rem;
      margin: 1.5rem 0 1rem;
      color: var(--text-primary);
    }

    :host-context(.dark-theme) h2 {
      color: var(--text-primary-dark);
    }

    section {
      margin-bottom: 1.5rem;
    }

    p {
      margin-bottom: 1rem;
      line-height: 1.6;
    }
  `]
})
export class TermsOfServiceComponent {
  currentDate = new Date();
} 