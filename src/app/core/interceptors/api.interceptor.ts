import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { UiService } from '../services/ui/ui.service';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const uiService = inject(UiService);
  
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
        errorMessage = 'Tu sesión ha expirado o no tienes acceso.';
      } else if (error.status === 403) {
        errorMessage = 'No tienes permisos de Administrador para esta acción.';
      }

      // Disparar el Toast rojo
      uiService.showToast(errorMessage, 'error');

      return throwError(() => error);
    })
  );
};