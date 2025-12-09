import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleOrden {
  id?: number;
  producto?: { nombre: string; rutaImagen: string };
  oferta?: { nombreOferta: string; rutaImagen?: string };
  cantidad: number;
  precioUnitarioAlMomento: number;
}

export interface Orden {
  id: number;
  fechaOrden: string;
  total: number;
  igv?: number;
  estado: string;
  detalles: DetalleOrden[];
  direccionEntrega?: any;
  usuario?: { nombreCompleto: string; correo: string };
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/ordenes';

  constructor(private http: HttpClient) {}

  crearOrden(idDireccion: number): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, { idDireccionEntrega: idDireccion });
  }

  obtenerMisOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/mis-ordenes`);
  }

  obtenerTodasLasOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/todas`);
  }

  cambiarEstadoOrden(id: number, estado: string): Observable<Orden> {
    return this.http.put<Orden>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}