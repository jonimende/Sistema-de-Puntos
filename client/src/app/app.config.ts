import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importante
import { authInterceptor } from './interceptors/auth-interceptor'; // Importante

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Activamos cliente HTTP e inyectamos el interceptor
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};