import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { map, take, tap } from 'rxjs/operators';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.currentUser$.pipe(
    take(1),
    tap(user => {
      console.log('Auth guard checking user:', user);
    }),
    map(user => {
      if (user) {
        return true;
      } else {
        console.log('No user found, redirecting to login');
        router.navigate(['/login']);
        return false;
      }
    })
  );
}; 