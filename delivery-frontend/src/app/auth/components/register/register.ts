import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  standalone: false
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      codigoEstudiante: ['', [Validators.required, Validators.pattern(/^[uU]\d{8}$/)]], 
      correo: ['', [Validators.required, Validators.email]],
      contrasena: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      
      const codigo = this.registerForm.get('codigoEstudiante')?.value.toString().trim().toLowerCase();
      const correo = this.registerForm.get('correo')?.value.toString().trim().toLowerCase();

      if (!correo.endsWith('@utp.edu.pe')) {
        this.errorMessage = 'Debes usar tu correo institucional (@utp.edu.pe).';
        return;
      }

      const usuarioCorreo = correo.split('@')[0];
      if (usuarioCorreo !== codigo) {
        this.errorMessage = `El correo (${usuarioCorreo}) no coincide con el código (${codigo}).`;
        return;
      }

      this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']); 
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Error al registrar. Verifica los datos.';
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}