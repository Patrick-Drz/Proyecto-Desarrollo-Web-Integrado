import { Component, OnInit } from '@angular/core';
import { CartService, Carrito } from '../../core/services/cart';
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
    piso: 'Tercer Piso',
    aula: 'A0303'
  };

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.carrito = cart;
    });
    
    this.cartService.recargarCarrito();
  }

  irAComprar(): void {
    this.router.navigate(['/menu']);
  }

  procesarPago(): void {
    alert('Funcionalidad de pago en desarrollo');
  }
}