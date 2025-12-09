import { Component } from '@angular/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html', 
  standalone: false
})
export class ForgotPassword {
  correo: string = '';
  loading = false;
  linkRecuperacion: string | null = null;

  constructor(private authService: AuthService) {}

  enviar() {
    if (!this.correo) return;
    this.loading = true;
    
    this.authService.solicitarRecuperacion(this.correo).subscribe({
      next: (res: any) => {
        this.linkRecuperacion = res.link;
        this.loading = false;
      },
      error: () => {
        alert('No pudimos encontrar este correo.');
        this.loading = false;
      }
    });
  }
}