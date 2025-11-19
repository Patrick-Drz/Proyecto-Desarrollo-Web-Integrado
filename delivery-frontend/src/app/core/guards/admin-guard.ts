import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const role = authService.getRoleFromToken();

  if (role === 'ADMINISTRADOR' || role === 'ADMIN') {
    return true; 
  }

  if (role === 'CLIENTE') {
    router.navigate(['/']);
    return false;
  }

  router.navigate(['/auth/login']);
  return false;
};