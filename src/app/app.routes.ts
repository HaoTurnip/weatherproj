import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { SettingsComponent } from './features/settings/settings.component';
import { NotFoundComponent } from './core/pages/not-found/not-found.component';
import { PrivacyPolicyComponent } from './layout/privacy-policy.component';
import { TermsOfServiceComponent } from './layout/terms-of-service.component';
import { ContactUsComponent } from './layout/contact-us.component';

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
    loadChildren: () => import('./features/alerts/alerts.module').then(m => m.AlertsModule)
  },
  {
    path: 'settings',
    component: SettingsComponent,
    title: 'Settings'
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule)
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
    component: NotFoundComponent
  }
];
