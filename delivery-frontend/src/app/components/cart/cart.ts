import { Component, OnInit } from '@angular/core';
import { CartService, Carrito } from '../../core/services/cart';
import { AuthService } from '../../auth/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: false,
  templateUrl: './cart.html',
  styleUrl: './cart.scss'
})
export class CartComponent implements OnInit {
  carrito: Carrito | null = null;
  usuario: any = null;
  ubicacion = {
    piso: 'Tercer Piso',
    aula: 'A0303'
  };

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = {
      nombreCompleto: 'Estefano Rodriguez', 
      codigoEstudiante: 'u11223344' 
    };

    this.cartService.cart$.subscribe(cart => {
      this.carrito = cart;
    });

    this.cartService.obtenerCarrito().subscribe({
      error: () => this.carrito = null 
    });
  }

  irAComprar(): void {
    this.router.navigate(['/menu']);
  }

  procesarPago(): void {
    alert('Funcionalidad de pago en desarrollo');
  }
}