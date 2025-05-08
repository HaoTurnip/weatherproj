import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ForecastComponent } from './features/forecast/forecast.component';
import { MapComponent } from './features/map/map.component';
import { AlertsComponent } from './features/alerts/alerts.component';
import { SettingsComponent } from './features/settings/settings.component';
import { LoginComponent } from './auth/login/login.component';
import { authGuard } from './core/auth.guard';
import { FirebaseInitGuard } from './core/guards/firebase-init.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [FirebaseInitGuard],
    children: [
      { path: '', component: HomeComponent, title: 'Home' },
      { path: 'forecast', component: ForecastComponent, title: 'Forecast' },
      { path: 'map', component: MapComponent, title: 'Weather Map' },
      { path: 'alerts', component: AlertsComponent, title: 'Weather Alerts' },
      { path: 'settings', component: SettingsComponent, title: 'Settings', canActivate: [authGuard] },
      { path: 'login', component: LoginComponent, title: 'Login' },
      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } 