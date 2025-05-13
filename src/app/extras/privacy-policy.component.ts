import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="container">
      <mat-card class="policy-card">
        <h1>Privacy Policy</h1>
        <p class="last-updated">Last updated: {{ currentDate | date:'longDate' }}</p>
        
        <section>
          <h2>Hey there! 👋</h2>
          <p>
            We're not fans of long, boring privacy policies either. So here's the short version of what we do with your data:
          </p>
        </section>

        <section>
          <h2>What we collect</h2>
          <ul>
            <li>Your location (so we can show you the weather there, obviously)</li>
            <li>Your saved locations (so you don't have to type "Abdo Pasha" every time)</li>
            <li>Basic usage data (we like to know if our app is working)</li>
          </ul>
        </section>

        <section>
          <h2>What we DON'T do</h2>
          <ul>
            <li>Sell your data to sketchy third parties</li>
            <li>Track you across the internet</li>
            <li>Store your data longer than needed</li>
          </ul>
        </section>

        <section>
          <h2>Your choices</h2>
          <p>
            Don't want us to know where you are? No problem! You can always enter locations manually.
          </p>
          <p>
            Want us to delete everything we know about you? No lol.
          </p>
        </section>

        <section>
          <h2>Questions?</h2>
          <p>
            If anything about this policy confuses you, just contact us. FYI all the contact info is fake and doesn't exist.
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

    .policy-card {
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

    ul {
      margin-left: 1.5rem;
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
      line-height: 1.5;
    }
  `]
})
export class PrivacyPolicyComponent {
  currentDate = new Date();
} 