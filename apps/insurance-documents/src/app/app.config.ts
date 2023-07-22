import {
  ApplicationConfig,
  importProvidersFrom,
  LOCALE_ID,
} from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ENVIRONMENT_CONFIGURATION_TOKEN } from './environment/environment-configuration.token';
import { environment } from '../environments/environment';
import { ApiErrorInterceptor } from './infrastructure/interceptors';
import { provideNgNeatQueryClient } from './infrastructure/ngneat';

import '@angular/common/locales/global/de';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),

    importProvidersFrom(MatSnackBarModule),

    { provide: LOCALE_ID, useValue: 'de-DE' },
    { provide: ENVIRONMENT_CONFIGURATION_TOKEN, useValue: environment },
    { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },

    provideNgNeatQueryClient(),
  ],
};
