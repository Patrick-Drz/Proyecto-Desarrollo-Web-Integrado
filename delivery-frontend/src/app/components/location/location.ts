import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocationService, Direccion } from '../../core/services/location';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location',
  standalone: false,
  templateUrl: './location.html',
  styleUrl: './location.scss'
})
export class LocationComponent {
  locationForm: FormGroup;
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private router: Router
  ) {
    this.locationForm = this.fb.group({
      pisoDescripcion: ['', Validators.required], 
      codigoAula: ['', [Validators.required, Validators.pattern(/^[A-D]\d{4}$/)]] 
    });
  }

  onSubmit(): void {
    if (this.locationForm.valid) {
      const { codigoAula } = this.locationForm.value;
      
      const torreLetra = codigoAula.substring(0, 1) as 'A' | 'B' | 'C' | 'D';
      const pisoNumero = parseInt(codigoAula.substring(1, 3));
      const aulaNumero = parseInt(codigoAula.substring(3, 5));

      const direccionBackend: Direccion = {
        torre: torreLetra,
        piso: pisoNumero,
        aula: aulaNumero
      };

      this.locationService.guardarDireccion(direccionBackend).subscribe({
        next: () => {
          this.mensajeExito = '¡Ubicación guardada correctamente!';
          setTimeout(() => this.router.navigate(['/cart']), 1500);
        },
        error: () => {
          this.mensajeError = 'Error al guardar la ubicación. Intenta nuevamente.';
        }
      });
    } else {
      this.locationForm.markAllAsTouched();
    }
  }
}