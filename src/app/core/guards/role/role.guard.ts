import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service'; // Ajusta la ruta si es necesario

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

// 1. Obtenemos el arreglo de roles permitidos desde la ruta
  const expectedRoles = route.data['expectedRoles'] as Array<string>;
  
  // 2. Obtenemos el rol actual del usuario logueado
  const currentRole = authService.getUserRole(); 

  // 3. Si el rol del usuario está incluido en la lista permitida, lo dejamos pasar
  if (currentRole && expectedRoles.includes(currentRole)) {
    return true;
  }

  // 4. Si no tiene permiso, lo devolvemos a la tienda pública (o al login)
  router.navigate(['/']);
  return false;
};