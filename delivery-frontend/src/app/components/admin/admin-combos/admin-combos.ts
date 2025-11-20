import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Producto } from '../../../core/services/product';
import { ComboService } from '../../../core/services/combo';

@Component({
  selector: 'app-admin-combos',
  templateUrl: './admin-combos.html',
  styleUrls: ['./admin-combos.scss'],
  standalone: false
})
export class AdminCombos implements OnInit {
  comboForm: FormGroup;
  productos: Producto[] = [];
  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private comboService: ComboService
  ) {
    this.comboForm = this.fb.group({
      idProductoPadre: ['', Validators.required],
      idProductoHijo: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.obtenerProductos().subscribe({
      next: (data) => this.productos = data,
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  get combosExistentes() {
    return this.productos.filter(p => p.componentesCombo && p.componentesCombo.length > 0);
  }

  onSubmit() {
    if (this.comboForm.valid) {
      this.comboService.agregarComponente(this.comboForm.value).subscribe({
        next: () => {
          this.mensajeExito = '¡Componente agregado al combo correctamente!';
          this.mensajeError = '';
          
          this.comboForm.patchValue({ idProductoHijo: '', cantidad: 1 });
          
          this.cargarProductos();

          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => {
          console.error(err);
          this.mensajeError = 'Error al crear la relación. Verifica los datos.';
          this.mensajeExito = '';
        }
      });
    }
  }
}