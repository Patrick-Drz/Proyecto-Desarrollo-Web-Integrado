import { Component, OnInit } from '@angular/core';
import { OrderService, Orden } from '../../core/services/order';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class OrdersComponent implements OnInit {
  ordenes: Orden[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.orderService.obtenerMisOrdenes().subscribe({
      next: (data) => this.ordenes = data.reverse(), 
      error: (err) => console.error(err)
    });
  }
}