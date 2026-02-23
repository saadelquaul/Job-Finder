import { ApplicationConfig, provideBrowserGlobalErrorListeners} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor-interceptor';
import { provideStore } from '@ngrx/store';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { provideEffects } from '@ngrx/effects';
import { FavoritesEffects } from './store/favorites/favorites.effects';


export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorInterceptor])),
    provideStore({ favorites: favoritesReducer }),
    provideEffects([FavoritesEffects]),
  ]
};
