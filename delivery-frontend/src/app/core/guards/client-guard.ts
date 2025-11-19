import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';

export const clientGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const role = authService.getRoleFromToken();

  if (role === 'ADMINISTRADOR' || role === 'ADMIN') {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  return true; 
};