import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario tiene un token, lo dejamos pasar
  if (authService.isAuthenticated()) {
    return true;
  }

  // Si no está autenticado, lo pateamos a la pantalla de login
  router.navigate(['/login']);
  return false;
};