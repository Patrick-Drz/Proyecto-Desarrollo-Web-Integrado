import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DetalleOrden {
  id: number;
  producto?: {
    id: number;
    nombre: string;
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

export interface Orden {
  id: number;
  fechaOrden: string;
  total: number;
  estado: string;
  usuario?: {
    nombreCompleto: string;
    codigoEstudiante: string;
    correo: string;
  };
  direccionEntrega: {
    torre: string;
    piso: number;
    aula: number;
  };
  detalles: DetalleOrden[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/ordenes';

  constructor(private http: HttpClient) {}

  crearOrden(idDireccionEntrega: number): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, { idDireccionEntrega });
  }

  obtenerMisOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/mis-ordenes`);
  }

  obtenerTodasLasOrdenes(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/todas`);
  }
}