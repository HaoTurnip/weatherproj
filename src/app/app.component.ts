import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { HeaderComponent } from './core/components/header/header.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, AsyncPipe],
  template: `
    <div class="app-container" [class.dark]="(isDarkMode$ | async)">
      <app-header></app-header>
      <main class="main-content">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--background-light);
      transition: background-color 0.3s ease;
    }

    .app-container.dark {
      background-color: var(--background-dark);
    }

    .main-content {
      flex: 1;
      padding: 24px 0;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 16px;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px 0;
      }

      .container {
        padding: 0 12px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  isDarkMode$ = this.themeService.isDarkMode$;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    // Theme will be initialized by the ThemeService
  }
}
