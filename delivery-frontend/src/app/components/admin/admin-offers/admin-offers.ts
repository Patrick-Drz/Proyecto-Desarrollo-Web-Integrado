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
  editMode = false; 
  currentOfferId: number | null = null; 

  constructor(private fb: FormBuilder, private offerService: OfferService) {
    this.offerForm = this.fb.group({
      nombreOferta: ['', Validators.required],
      descripcionOferta: [''],
      tipoDescuento: ['MONTO_FIJO', Validators.required],
      precioRegular: ['', [Validators.required, Validators.min(0)]],
      valorDescuento: ['', [Validators.required, Validators.min(0)]],
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],

      stock: [100, [Validators.required, Validators.min(0)]],
      
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
      const ofertaData = this.offerForm.value;

      if (this.editMode && this.currentOfferId) {
        this.offerService.actualizarOferta(this.currentOfferId, ofertaData).subscribe({
          next: () => {
            alert('Oferta actualizada correctamente');
            this.cargarOfertas();
            this.cancelEdit();
          },
          error: (err) => console.error('Error al actualizar:', err)
        });
      } else {
        this.offerService.crearOferta(ofertaData).subscribe({
          next: () => {
            alert('Oferta creada exitosamente');
            this.cargarOfertas();
            this.cancelEdit(); 
          },
          error: (err) => {
            console.error(err);
            alert('Error al crear la oferta.');
          }
        });
      }
    } else {
      this.offerForm.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios.');
    }
  }

  cargarOferta(oferta: Oferta) {
    this.editMode = true;
    this.currentOfferId = oferta.id!;

    const inicio = oferta.fechaInicio ? oferta.fechaInicio.substring(0, 16) : '';
    const fin = oferta.fechaFin ? oferta.fechaFin.substring(0, 16) : '';

    this.offerForm.patchValue({
      nombreOferta: oferta.nombreOferta,
      descripcionOferta: oferta.descripcionOferta,
      tipoDescuento: oferta.tipoDescuento,
      precioRegular: oferta.precioRegular,
      valorDescuento: oferta.valorDescuento,
      fechaInicio: inicio,
      fechaFin: fin,
      stock: oferta.stock, 
      activa: oferta.activa
    });

    window.scrollTo(0, 0);
  }

  cancelEdit() {
    this.editMode = false;
    this.currentOfferId = null;
    this.offerForm.reset({ 
      activa: true, 
      tipoDescuento: 'MONTO_FIJO',
      stock: 100 
    });
  }

  toggleEstado(oferta: Oferta) {
    if (!oferta.id) return;
    
    const estadoOriginal = oferta.activa; 

    this.offerService.cambiarEstado(oferta.id).subscribe({
      next: (ofertaActualizada: any) => {
        oferta.activa = ofertaActualizada.activa;
        console.log('Estado oferta cambiado');
      },
      error: (err) => {
        console.error(err);
        oferta.activa = !estadoOriginal; 
        
        if (err.error && typeof err.error === 'string') {
            alert(err.error);
        } else {
            alert('Error al cambiar el estado de la oferta.');
        }
        this.cargarOfertas();
      }
    });
  }

  eliminar(id: any) {
    if (id && confirm('¿Estás seguro de eliminar esta oferta?')) {
      this.offerService.eliminarOferta(id).subscribe(() => this.cargarOfertas());
    }
  }
}