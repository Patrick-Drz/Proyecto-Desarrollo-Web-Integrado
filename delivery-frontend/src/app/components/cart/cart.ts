import { Component, OnInit } from '@angular/core';
import { CartService, Carrito } from '../../core/services/cart';
import { LocationService } from '../../core/services/location';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {
  carrito: Carrito | null = null;
  ubicacion = {
    piso: '---',
    aula: '---'
  };

  constructor(
    private cartService: CartService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.carrito = cart;
      if (cart) {
        this.cargarUbicacion();
      } else {
        this.ubicacion = { piso: '---', aula: '---' };
      }
    });
    
    this.cartService.recargarCarrito();
  }

  cargarUbicacion(): void {
    this.locationService.obtenerDirecciones().subscribe({
      next: (direcciones) => {
        if (direcciones && direcciones.length > 0) {
          const ultima = direcciones[direcciones.length - 1];
          const aulaFormateada = `${ultima.torre}${ultima.piso.toString().padStart(2, '0')}${ultima.aula.toString().padStart(2, '0')}`;
          
          this.ubicacion = {
            piso: `Piso ${ultima.piso}`,
            aula: aulaFormateada
          };
        }
      },
      error: () => {
        this.ubicacion = { piso: 'Sin registrar', aula: 'Sin registrar' };
      }
    });
  }

  irAComprar(): void {
    this.router.navigate(['/menu']);
  }

  procesarPago(): void {
    alert('Funcionalidad de pago en desarrollo');
  }
}