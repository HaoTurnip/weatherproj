import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SettingsComponent } from './features/settings/settings.component';
import { PrivacyPolicyComponent } from './extras/privacy-policy.component';
import { TermsOfServiceComponent } from './extras/terms-of-service.component';
import { ContactUsComponent } from './extras/contact-us.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { authGuard } from './core/guards/auth.guard';

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
    title: 'Home'
  },
  {
    path: 'forecast',
    loadChildren: () => import('./features/forecast/forecast.routes').then(m => m.FORECAST_ROUTES),
    title: 'Forecast'
  },
  {
    path: 'map',
    loadChildren: () => import('./features/map/map.routes').then(m => m.MAP_ROUTES),
    title: 'Map'
  },
  {
    path: 'alerts',
    loadChildren: () => import('./features/alerts/alerts.module').then(m => m.AlertsModule),
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings',
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [authGuard]
  },
  {
    path: 'privacy',
    component: PrivacyPolicyComponent,
    title: 'Privacy Policy'
  },
  {
    path: 'terms',
    component: TermsOfServiceComponent,
    title: 'Terms of Service'
  },
  {
    path: 'contact',
    component: ContactUsComponent,
    title: 'Contact Us'
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Page Not Found'
  }
];
