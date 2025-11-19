import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService, Producto } from '../../../core/services/product';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.html',
  standalone: false
})
export class AdminProducts implements OnInit {
  productForm: FormGroup;
  productos: Producto[] = [];
  editMode = false;
  currentProductId: number | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      codigoProducto: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      descripcion: [''],
      rutaImagen: ['']
    });
  }

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productService.obtenerProductos().subscribe(data => this.productos = data);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const producto = this.productForm.value;
      if (this.editMode && this.currentProductId) {
        this.productService.actualizarProducto(this.currentProductId, producto).subscribe(() => {
          this.cargarProductos();
          this.cancelEdit();
        });
      } else {
        this.productService.crearProducto(producto).subscribe(() => {
          this.cargarProductos();
          this.productForm.reset();
        });
      }
    }
  }

  cargarProducto(producto: Producto) {
    this.editMode = true;
    this.currentProductId = producto.id;
    this.productForm.patchValue(producto);
    window.scrollTo(0, 0);
  }

  eliminarProducto(id: number) {
    if(confirm('¿Estás seguro de eliminar este producto?')) {
      this.productService.eliminarProducto(id).subscribe(() => {
        this.cargarProductos();
      });
    }
  }

  cancelEdit() {
    this.editMode = false;
    this.currentProductId = null;
    this.productForm.reset();
  }
}