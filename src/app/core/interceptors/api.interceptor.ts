import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, throwError } from 'rxjs';
import { UiService } from '../services/ui/ui.service';
import { AuthService } from '../services/auth/auth.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const uiService = inject(UiService);
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Encender el spinner antes de enviar la petición
  uiService.showLoading();

  return next(req).pipe(
    // 2. Apagar el spinner cuando termine (sea con éxito o error)
    finalize(() => uiService.hideLoading()),

    // 3. Capturar errores globales
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado en el servidor.';

      if (error.error && error.error.message) {
        // Mensaje personalizado desde C#
        errorMessage = error.error.message;
      } else if (error.status === 401) {
        errorMessage = 'Tu sesión ha expirado. Inicia sesión nuevamente.';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos para realizar esta acción.';
      }

      // Si el token expiró o es inválido (y no estamos ya en /login), cerramos sesión
      if (error.status === 401 && !router.url.includes('/login')) {
        authService.logout();
        router.navigate(['/login']);
      }

      // Disparar el Toast rojo
      uiService.showToast(errorMessage, 'error');

      return throwError(() => error);
    })
  );
};