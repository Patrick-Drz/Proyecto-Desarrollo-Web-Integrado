import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { AuthService } from '../../auth/services/auth';

export interface UsuarioCarrito {
  nombreCompleto: string;
  codigoEstudiante: string;
}

export interface ItemCarrito {
  id: number;
  producto?: { 
    id: number;
    nombre: string;
    precio: number;
    rutaImagen: string;
  };
  oferta?: { 
    id: number;
    nombreOferta: string;
    descripcionOferta: string;
  };
  cantidad: number;
  precioUnitarioAlMomento: number;
}

export interface Carrito {
  id: number;
  usuario: UsuarioCarrito;
  items: ItemCarrito[];
  total?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8080/api/carrito';
  private cartSubject = new BehaviorSubject<Carrito | null>(null);
  
  cart$ = this.cartSubject.asObservable();

  cartCount$ = this.cartSubject.asObservable().pipe(
    map(carrito => {
      if (!carrito || !carrito.items) return 0;
      return carrito.items.reduce((acc, item) => acc + item.cantidad, 0);
    })
  );

  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.userRole$.subscribe(role => {
      if (role) {
        this.recargarCarrito();
      } else {
        this.limpiarEstadoLocal();
      }
    });
  }

  recargarCarrito(): void {
    this.http.get<Carrito>(this.apiUrl).pipe(
      tap(carrito => this.calcularTotal(carrito))
    ).subscribe({
      next: (c) => console.log(c),
      error: () => this.cartSubject.next(null)
    });
  }

  agregarItem(idProducto: number | null, cantidad: number, idOferta: number | null = null): Observable<Carrito> {
    const payload: any = { cantidad };
    if (idProducto) payload.idProducto = idProducto;
    if (idOferta) payload.idOferta = idOferta;

    return this.http.post<Carrito>(`${this.apiUrl}/items`, payload).pipe(
      tap(carrito => this.calcularTotal(carrito))
    );
  }

  eliminarItem(idItem: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.apiUrl}/items/${idItem}`).pipe(
      tap(carrito => this.calcularTotal(carrito))
    );
  }

  private calcularTotal(carrito: Carrito): void {
    if (carrito && carrito.items) {
      carrito.total = carrito.items.reduce((acc, item) => acc + (item.cantidad * item.precioUnitarioAlMomento), 0);
      this.cartSubject.next(carrito);
    }
  }

  private limpiarEstadoLocal(): void {
    this.cartSubject.next(null);
  }
}