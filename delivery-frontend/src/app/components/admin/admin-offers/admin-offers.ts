import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService, Oferta } from '../../../core/services/offer';

@Component({
  selector: 'app-admin-offers',
  templateUrl: './admin-offers.html',
  styleUrls: ['./admin-offers.scss'],
  standalone: false
})
export class AdminOffers implements OnInit {
  offerForm: FormGroup;
  ofertas: Oferta[] = [];

  constructor(private fb: FormBuilder, private offerService: OfferService) {
    this.offerForm = this.fb.group({
      nombreOferta: ['', Validators.required],
      descripcionOferta: [''],
      
      tipoDescuento: ['MONTO_FIJO', Validators.required],
      
      precioRegular: ['', [Validators.required, Validators.min(0)]],
      valorDescuento: ['', [Validators.required, Validators.min(0)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      activa: [true]
    });
  }

  ngOnInit(): void {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.offerService.obtenerOfertas().subscribe({
      next: (data) => this.ofertas = data,
      error: (e) => console.error('Error al cargar ofertas:', e)
    });
  }

  onSubmit() {
    if (this.offerForm.valid) {
      console.log('Enviando oferta:', this.offerForm.value); 
      
      this.offerService.crearOferta(this.offerForm.value).subscribe({
        next: () => {
          this.offerForm.reset({ 
            activa: true, 
            tipoDescuento: 'MONTO_FIJO' 
          });
          alert('Oferta creada exitosamente');
          this.cargarOfertas();
        },
        error: (err) => {
          console.error(err);
          alert('Error al crear la oferta. Verifica que el backend esté corriendo.');
        }
      });
    } else {
      this.offerForm.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios.');
    }
  }

  eliminar(id: any) {
    if (id && confirm('¿Estás seguro de eliminar esta oferta?')) {
      this.offerService.eliminarOferta(id).subscribe(() => this.cargarOfertas());
    }
  }
}