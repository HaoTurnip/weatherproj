import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { UserSettings } from '../../core/models/user.model';

@Directive({
  selector: '[appDarkMode]',
  standalone: true
})
export class DarkModeDirective implements OnInit, OnDestroy {
  @Input() theme: 'auto' | 'light' | 'dark' = 'auto';
  private subscription: Subscription = new Subscription();

  constructor(
    private el: ElementRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.userSettings$.subscribe((settings: UserSettings | null) => {
        if (settings?.theme) {
          this.theme = settings.theme;
          this.applyTheme();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  @HostListener('window:resize')
  onResize() {
    if (this.theme === 'auto') {
      this.applyTheme();
    }
  }

  private isSystemDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private applyTheme() {
    const isDark = this.theme === 'dark' || (this.theme === 'auto' && this.isSystemDarkMode());
    this.el.nativeElement.classList.toggle('dark-theme', isDark);
    this.el.nativeElement.classList.toggle('light-theme', !isDark);
  }
} 