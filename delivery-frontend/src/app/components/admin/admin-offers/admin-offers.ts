import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfferService, Oferta } from '../../../core/services/offer';

@Component({
  selector: 'app-admin-offers',
  templateUrl: './admin-offers.html',
  standalone: false
})
export class AdminOffers implements OnInit {
  offerForm: FormGroup;
  ofertas: Oferta[] = [];

  constructor(private fb: FormBuilder, private offerService: OfferService) {
    this.offerForm = this.fb.group({
      codigo: ['', Validators.required],
      nombre: ['', Validators.required],
      descripcion: [''],
      precioRegular: ['', Validators.required],
      precioOferta: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      activa: [true]
    });
  }

  ngOnInit(): void {
    this.offerService.ofertas$.subscribe(data => this.ofertas = data);
  }

  onSubmit() {
    if (this.offerForm.valid) {
      this.offerService.crearOferta(this.offerForm.value).subscribe(() => {
        this.offerForm.reset({ activa: true });
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta oferta?')) {
      this.offerService.eliminarOferta(id);
    }
  }
}