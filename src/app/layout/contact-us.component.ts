import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <div class="container">
      <mat-card class="contact-card">
        <h1>Get In Touch</h1>
        <p class="subtitle">All of this is fake btw</p>
        
        <div class="contact-methods">
          <div class="contact-method">
            <mat-icon class="contact-icon">email</mat-icon>
            <h2>Email Us</h2>
            <p>Fastest way to reach us:</p>
            <p class="contact-value">hello&#64;weatherpro.example.com</p>
            <p class="note">We typically respond within 24 buisness days</p>
          </div>
          
          <div class="contact-method">
            <mat-icon class="contact-icon">chat</mat-icon>
            <h2>Live Chat</h2>
            <p>Got a quick question?</p>
            <p class="contact-value">Available any day that doesn't end with a y</p>
            <p class="note">We haven't actually added a chat feature yet</p>
          </div>
          
          <div class="contact-method">
            <mat-icon class="contact-icon">phone</mat-icon>
            <h2>Call Us</h2>
            <p>Old school option:</p>
            <p class="contact-value">(***) ***-****</p>
            <p class="note">Monday-Friday, 9am - 5pm CET</p>
          </div>


          <div class="contact-method">
            <mat-icon class="contact-icon">send</mat-icon>
            <h2>Carrier Pigeon</h2>
            <p>Why?</p>
            <p class="note"> No seriously why?</p>
          </div>

        </div>

        
        
        
        <div class="social-section">
          <h2>Find Us Online</h2>
          <div class="social-links">
            <a href="#" class="social-link">
              <mat-icon>X</mat-icon>
              <span>x.com</span>
            </a>
            <a href="#" class="social-link">
              <mat-icon>facebook</mat-icon>
              <span>Facebook</span>
            </a>
            <a href="#" class="social-link">
              <mat-icon>photo_camera</mat-icon>
              <span>Instagram</span>
            </a>
          </div>
        </div>
        
        <div class="office-info">
          <h2>HQ Location</h2>
          <p>123 fake street</p>
          <p>Abdo Pasha</p>
          <p>Egypt</p>
          <p class="note">Our office is 100% powered by renewable energy!</p>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .container {
      max-width: 900px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    .contact-card {
      padding: 2rem;
      border-radius: 12px;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--primary-color);
      text-align: center;
    }

    :host-context(.dark-theme) h1 {
      color: var(--primary-light);
    }

    .subtitle {
      text-align: center;
      color: var(--text-secondary);
      margin-bottom: 3rem;
      font-size: 1.2rem;
    }

    :host-context(.dark-theme) .subtitle {
      color: var(--text-secondary-dark);
    }

    .contact-methods {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .contact-method {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 1.5rem;
      border-radius: 12px;
      background-color: var(--card-light);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .contact-method:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    :host-context(.dark-theme) .contact-method {
      background-color: var(--card-dark);
    }

    .contact-icon {
      font-size: 2.5rem;
      height: 2.5rem;
      width: 2.5rem;
      margin-bottom: 1rem;
      color: var(--primary-color);
    }

    :host-context(.dark-theme) .contact-icon {
      color: var(--primary-light);
    }

    h2 {
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      color: var(--text-primary);
    }

    :host-context(.dark-theme) h2 {
      color: var(--text-primary-dark);
    }

    .contact-value {
      font-weight: 600;
      margin: 0.5rem 0;
      color: var(--primary-color);
    }

    :host-context(.dark-theme) .contact-value {
      color: var(--primary-light);
    }

    .note {
      font-size: 0.9rem;
      color: var(--text-tertiary);
      font-style: italic;
      margin-top: 0.5rem;
    }

    :host-context(.dark-theme) .note {
      color: var(--text-tertiary-dark);
    }

    .social-section {
      margin-bottom: 3rem;
      text-align: center;
    }

    .social-links {
      display: flex;
      justify-content: center;
      gap: 1.5rem;
      margin-top: 1.5rem;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      background-color: var(--card-light);
      color: var(--text-primary);
      text-decoration: none;
      transition: all 0.2s ease;
    }

    .social-link:hover {
      background-color: var(--primary-color);
      color: white;
      transform: translateY(-3px);
    }

    :host-context(.dark-theme) .social-link {
      background-color: var(--card-dark);
      color: var(--text-primary-dark);
    }

    :host-context(.dark-theme) .social-link:hover {
      background-color: var(--primary-light);
      color: var(--text-dark);
    }

    .office-info {
      text-align: center;
      padding: 2rem;
      background-color: var(--card-light);
      border-radius: 12px;
      line-height: 1.6;
    }

    :host-context(.dark-theme) .office-info {
      background-color: var(--card-dark);
    }

    @media (max-width: 768px) {
      .contact-methods {
        grid-template-columns: 1fr;
      }

      .social-links {
        flex-direction: column;
        align-items: center;
      }
    }
  `]
})
export class ContactUsComponent {
} 