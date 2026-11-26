import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Inyectamos nuestro servicio de autenticación
  const authService = inject(AuthService);
  const token = authService.getToken();

  // Si hay un token guardado, clonamos la petición y le pegamos el header de Autorización
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // Si no hay token (ej: el usuario no se ha logueado), la petición sigue normal
  return next(req);
};