import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  standalone: false
})
export class ResetPassword implements OnInit {
  token: string = '';
  password: string = '';
  loading = false;

  constructor(private route: ActivatedRoute, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
  }

  guardar() {
    if (!this.password) return alert('Ingresa una contraseña');
    this.loading = true;
    
    this.authService.cambiarContrasena(this.token, this.password).subscribe({
      next: () => {
        alert('¡Contraseña actualizada con éxito!');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        const mensajeError = err.error?.message || 'Error al cambiar la contraseña.';
        alert(mensajeError);
        this.loading = false;
      }
    });
  }
}