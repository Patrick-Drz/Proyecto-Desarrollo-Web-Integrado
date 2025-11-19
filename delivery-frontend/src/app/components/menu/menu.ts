import { Component, OnInit } from '@angular/core';
import { ProductService, Producto } from '../../core/services/product';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  productos: Producto[] = [];
  cantidades: { [key: number]: number } = {};

  ofertas = [
    {
      id: 1,
      nombre: 'Oferta Especial',
      descripcion: 'Hamburguesa más papas fritas y gaseosa',
      precioOriginal: 25.00,
      precioOferta: 13.00,
      imagen: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 2,
      nombre: 'Oferta Especial',
      descripcion: 'Hamburguesa más papas fritas, helado y gaseosa',
      precioOriginal: 35.00,
      precioOferta: 20.00,
      imagen: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 3,
      nombre: 'Oferta Especial',
      descripcion: 'Pizza, pan al ajo, gaseosa y postre de chocolate',
      precioOriginal: 40.00,
      precioOferta: 22.00,
      imagen: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=1000'
    }
  ];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.obtenerProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.productos.forEach(p => this.cantidades[p.id] = 1);
      },
      error: (err) => console.error(err)
    });
  }

  agregarAlCarrito(producto: Producto): void {
    const cantidad = this.cantidades[producto.id] || 1;
    console.log(`Agregando ${cantidad} de ${producto.nombre} al carrito`);
  }
}