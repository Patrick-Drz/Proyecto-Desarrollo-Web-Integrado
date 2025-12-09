import { Component, OnInit } from '@angular/core';
import { OrderService, Orden } from '../../../core/services/order';

@Component({
  selector: 'app-admin-sales',
  templateUrl: './admin-sales.html',
  styleUrls: ['./admin-sales.scss'],
  standalone: false
})
export class AdminSales implements OnInit {
  
  ordenes: Orden[] = [];
  ordenSeleccionada: Orden | null = null; 

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes() {
    this.orderService.obtenerTodasLasOrdenes().subscribe({
      next: (data) => {
        this.ordenes = data.sort((a, b) => b.id - a.id);
      },
      error: (err) => console.error('Error al cargar ventas:', err)
    });
  }

  verDetalles(orden: Orden) {
    this.ordenSeleccionada = orden;
  }

  cerrarModal() {
    this.ordenSeleccionada = null;
  }
}