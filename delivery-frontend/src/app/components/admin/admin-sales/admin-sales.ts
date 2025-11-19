import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../../core/services/order';

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.html',
  styleUrls: ['./admin-sales.scss'],
  standalone: false
})
export class AdminSales implements OnInit {
  ventas: any[] = [];
  ventaSeleccionada: any = null;

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.orderService.obtenerTodasLasOrdenes().subscribe({
      next: (data) => {
        this.ventas = data.reverse();
      },
      error: (err) => console.error('Error al cargar ventas:', err)
    });
  }

  verDetalles(venta: any) {
    this.ventaSeleccionada = venta;
  }

  cerrarModal() {
    this.ventaSeleccionada = null;
  }
}
