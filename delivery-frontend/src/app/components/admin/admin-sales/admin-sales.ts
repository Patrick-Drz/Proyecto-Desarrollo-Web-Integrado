import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.html',
  standalone: false
})
export class AdminSales implements OnInit {
  ventas: any[] = [];
  ventaSeleccionada: any = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    // Usamos el servicio existente. En un caso real, este endpoint debería traer TODAS las ventas, no solo las del usuario.
    // Supondremos que el backend ha sido ajustado o que usamos este para la demo.
    this.orderService.obtenerMisOrdenes().subscribe(data => {
        this.ventas = data; 
    });
  }

  verDetalles(venta: any) {
    this.ventaSeleccionada = venta;
  }

  cerrarModal() {
    this.ventaSeleccionada = null;
  }
}