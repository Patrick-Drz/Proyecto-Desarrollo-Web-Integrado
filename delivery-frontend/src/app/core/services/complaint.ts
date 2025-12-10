import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Reclamacion {
  id: number;
  tipoReclamacion: string;
  descripcion: string;
  fechaCreacion: string;
  estado: string;
  usuario?: {
    nombreCompleto: string;
    correo: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ComplaintService {
  private apiUrl =
    `${environment.apiUrl}/reclamaciones` || 'http://localhost:8080/api/reclamaciones';

  constructor(private http: HttpClient) {}

  obtenerReclamaciones(): Observable<Reclamacion[]> {
    return this.http.get<Reclamacion[]>(this.apiUrl);
  }

  crearReclamacion(reclamacion: any): Observable<Reclamacion> {
    return this.http.post<Reclamacion>(this.apiUrl, reclamacion);
  }
}
