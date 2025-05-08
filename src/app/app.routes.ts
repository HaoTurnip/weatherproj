import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login'
  },
  {
    path: 'signup',
    component: SignupComponent,
    title: 'Sign Up'
  },
  {
    path: '',
    loadChildren: () => import('./features/home/home.routes').then(m => m.HOME_ROUTES),
    pathMatch: 'full',
    title: 'Home',
  },
  {
    path: 'forecast',
    loadChildren: () => import('./features/forecast/forecast.routes').then(m => m.FORECAST_ROUTES),
    title: 'Forecast',
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map.routes').then(m => m.MAP_ROUTES),
    title: 'Map',
  },
  {
    path: 'alerts',
    loadChildren: () => import('./features/alerts/alerts.routes').then(m => m.ALERTS_ROUTES),
    title: 'Alerts',
  },
  {
    path: 'settings',
    loadChildren: () => import('./features/settings/settings.routes').then(m => m.SETTINGS_ROUTES),
    canActivate: [authGuard],
    title: 'Settings',
  },
  { path: '**', redirectTo: '' },
];
