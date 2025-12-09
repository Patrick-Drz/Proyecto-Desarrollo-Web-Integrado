import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { OrderService, Orden } from '../../core/services/order';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  usuario: any = null;
  
  totalPedidos: number = 0;
  totalProductosComprados: number = 0;
  
  puntosXP: number = 0;
  nombreNivel: string = 'Cachimbo';
  siguienteNivel: string = 'Regular';
  xpParaSiguiente: number = 1000;
  porcentajeProgreso: number = 0;
  colorNivel: string = 'bg-secondary'; 

  ultimosPedidos: Orden[] = [];
  productoFavorito: any = null;

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (data) => {
        this.usuario = data;
      }
    });

    this.orderService.obtenerMisOrdenes().subscribe({
      next: (ordenes) => {
        this.procesarDatosGamificacion(ordenes);
      }
    });
  }

  procesarDatosGamificacion(ordenes: Orden[]) {
    this.totalPedidos = ordenes.length;
    this.ultimosPedidos = ordenes.sort((a, b) => b.id - a.id).slice(0, 3);
    
    let totalItems = 0;
    const contadorFavoritos: any = {};
    let maxCantidad = 0;
    let ganador: any = null;

    ordenes.forEach(orden => {
      orden.detalles.forEach(detalle => {
        const cantidad = detalle.cantidad;
        totalItems += cantidad;

        const item: any = detalle;

        const nombre = item.producto?.nombre || item.oferta?.nombreOferta;
        const img = item.producto?.rutaImagen || 'assets/icons/offer-generic.png';
        
        const key = nombre || 'Item';

        if (!contadorFavoritos[key]) {
          contadorFavoritos[key] = { count: 0, nombre: nombre, img: img };
        }
        contadorFavoritos[key].count += cantidad;

        if (contadorFavoritos[key].count > maxCantidad) {
          maxCantidad = contadorFavoritos[key].count;
          ganador = contadorFavoritos[key];
        }
      });
    });

    this.totalProductosComprados = totalItems;
    this.productoFavorito = ganador;

    this.puntosXP = (this.totalPedidos * 100) + (totalItems * 10);
    this.calcularRango(this.puntosXP);
  }

  calcularRango(xp: number) {
    if (xp < 500) {
      this.nombreNivel = 'Cachimbo'; 
      this.colorNivel = 'bg-secondary';
      this.siguienteNivel = 'Estudiante Regular';
      this.xpParaSiguiente = 500;
    } else if (xp < 1500) {
      this.nombreNivel = 'Estudiante Regular'; 
      this.colorNivel = 'bg-info';
      this.siguienteNivel = 'Delegado';
      this.xpParaSiguiente = 1500;
    } else if (xp < 3000) {
      this.nombreNivel = 'Delegado'; 
      this.colorNivel = 'bg-primary';
      this.siguienteNivel = 'Catedrático';
      this.xpParaSiguiente = 3000;
    } else {
      this.nombreNivel = 'Catedrático'; 
      this.colorNivel = 'bg-warning text-dark';
      this.siguienteNivel = 'Leyenda (Max)';
      this.xpParaSiguiente = 10000;
    }

    if (this.xpParaSiguiente > xp) {
      this.porcentajeProgreso = (xp / this.xpParaSiguiente) * 100;
    } else {
      this.porcentajeProgreso = 100;
    }
  }

  logout() {
    this.authService.logout();
  }
}