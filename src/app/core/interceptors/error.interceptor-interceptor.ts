import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';

import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue';

            if (error.error instanceof ErrorEvent) {
                // Client-side error
                errorMessage = `Erreur: ${error.error.message}`;
            } else {
                // Server-side error
                switch (error.status) {
                    case 0:
                        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que JSON Server est démarré.';
                        break;
                    case 404:
                        errorMessage = 'Ressource non trouvée';
                        break;
                    case 500:
                        errorMessage = 'Erreur interne du serveur';
                        break;
                    default:
                        errorMessage = `Erreur ${error.status}: ${error.message}`;
                }
            }

            console.error('HTTP Error:', errorMessage);
            return throwError(() => new Error(errorMessage));
        })
    );
};
