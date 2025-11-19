import { Component, OnInit } from '@angular/core';
import { ProductService, Producto } from '../../core/services/product';
import { CartService } from '../../core/services/cart';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/services/auth';
import { OfferService, Oferta } from '../../core/services/offer';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.html',
  styleUrl: './menu.scss'
})
export class Menu implements OnInit {
  productos: Producto[] = [];
  ofertas: Oferta[] = [];
  cantidades: { [key: number]: number } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService,
    private offerService: OfferService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarOfertas();
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

  cargarOfertas(): void {
    this.offerService.obtenerOfertas().subscribe({
      next: (data) => this.ofertas = data.filter(o => o.activa),
      error: (err) => console.error(err)
    });
  }

  calcularPrecioOferta(oferta: Oferta): number {
    if (oferta.tipoDescuento === 'MONTO_FIJO') {
      return Math.max(0, oferta.precioRegular - oferta.valorDescuento);
    } else {
      const descuento = oferta.precioRegular * (oferta.valorDescuento / 100);
      return Math.max(0, oferta.precioRegular - descuento);
    }
  }

  agregarAlCarrito(producto: Producto): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para comprar.');
      this.router.navigate(['/auth/login']);
      return;
    }

    const cantidad = this.cantidades[producto.id] || 1;
    
    this.cartService.agregarItem(producto.id, cantidad, null).subscribe({
      next: () => alert(`¡${producto.nombre} añadido al carrito!`),
      error: () => alert('Error al añadir producto.')
    });
  }

  agregarOfertaAlCarrito(oferta: Oferta): void {
    if (!this.authService.isLoggedIn()) {
      alert('Debes iniciar sesión para comprar.');
      this.router.navigate(['/auth/login']);
      return;
    }

    if (oferta.id) {
      this.cartService.agregarItem(null, 1, oferta.id).subscribe({
        next: () => alert(`¡Oferta "${oferta.nombreOferta}" añadida al carrito!`),
        error: (err) => {
          console.error(err);
          alert('Error al añadir la oferta.');
        }
      });
    }
  }
}