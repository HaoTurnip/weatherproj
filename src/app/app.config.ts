import { ApplicationConfig, importProvidersFrom, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { firebaseConfig } from './firebase.config';

export const FIREBASE_APP = new InjectionToken('FIREBASE_APP');
export const FIREBASE_AUTH = new InjectionToken<Auth>('FIREBASE_AUTH');
export const FIREBASE_ANALYTICS = new InjectionToken<Analytics>('FIREBASE_ANALYTICS');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    importProvidersFrom(
      CoreModule,
      SharedModule
    ),
    {
      provide: FIREBASE_APP,
      useValue: initializeApp(firebaseConfig)
    },
    {
      provide: FIREBASE_AUTH,
      useFactory: () => getAuth()
    },
    {
      provide: FIREBASE_ANALYTICS,
      useFactory: () => getAnalytics()
    }
  ]
};
