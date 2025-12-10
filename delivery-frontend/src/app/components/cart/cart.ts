import { Component, OnInit } from '@angular/core';
import { CartService, Carrito, ItemCarrito } from '../../core/services/cart'; 
import { LocationService } from '../../core/services/location';
import { OrderService } from '../../core/services/order';
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
  idDireccion: number | null = null;
  loading = false; 

  constructor(
    private cartService: CartService,
    private locationService: LocationService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.carrito = cart;
      if (cart) {
        this.cargarUbicacion();
      } else {
        this.ubicacion = { piso: '---', aula: '---' };
        this.idDireccion = null;
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
          this.idDireccion = ultima.id!;
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
    if (!this.idDireccion) {
      alert('Por favor, registra tu ubicación (Tu Aula) antes de realizar el pedido.');
      this.router.navigate(['/location']);
      return;
    }

    if (confirm('¿Confirmar pedido? El pago se realizará contra entrega.')) {
      this.orderService.crearOrden(this.idDireccion).subscribe({
        next: () => {
          alert('¡Pedido realizado con éxito!');
          this.cartService.recargarCarrito(); 
          this.router.navigate(['/orders']);
        },
        error: (err) => {
          const mensaje = err.error?.message || 'Ocurrió un error al procesar el pedido.';
          alert(mensaje);
        }
      });
    }
  }

  incrementarCantidad(item: ItemCarrito) {
    this.actualizarItem(item, 1);
  }

  decrementarCantidad(item: ItemCarrito) {
    if (item.cantidad > 1) {
      this.actualizarItem(item, -1);
    } else {
      this.eliminarItem(item);
    }
  }

  actualizarItem(item: ItemCarrito, cantidad: number) {
    const idProd = item.producto?.id || null;
    const idOfer = item.oferta?.id || null;
    
    this.loading = true;
    this.cartService.agregarItem(idProd, cantidad, idOfer).subscribe({
        next: () => this.loading = false,
        error: (err) => {
            console.error(err);
            const mensaje = err.error?.message || 'Error al actualizar cantidad.';
            alert(mensaje); 
            this.loading = false;
        }
    });
  }

  eliminarItem(item: ItemCarrito) {
    if(!confirm('¿Eliminar este producto?')) return;
    
    this.loading = true;
    this.cartService.eliminarItem(item.id).subscribe({
        next: () => this.loading = false,
        error: (err) => {
            const mensaje = err.error?.message || 'Error al eliminar ítem.';
            alert(mensaje);
            this.loading = false;
        }
    });
  }
}