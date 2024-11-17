import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { defaultStoreProvider, provideStore } from '@state-adapt/angular';
import { actionSanitizer, stateSanitizer } from '@state-adapt/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    defaultStoreProvider,
    provideStore({
      devtools: (window as any)?.__REDUX_DEVTOOLS_EXTENSION__?.({
        actionSanitizer,
        stateSanitizer,
      }),
      showSelectors: false,
    }),
  ],
};
