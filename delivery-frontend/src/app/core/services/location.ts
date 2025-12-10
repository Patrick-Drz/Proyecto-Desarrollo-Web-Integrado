import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Direccion {
  id?: number;
  torre: 'A' | 'B' | 'C' | 'D';
  piso: number;
  aula: number;
}

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private apiUrl = `${environment.apiUrl}/direcciones` || 'http://localhost:8080/api/direcciones';

  constructor(private http: HttpClient) {}

  guardarDireccion(direccion: Direccion): Observable<Direccion> {
    return this.http.post<Direccion>(this.apiUrl, direccion);
  }

  obtenerDirecciones(): Observable<Direccion[]> {
    return this.http.get<Direccion[]>(this.apiUrl);
  }
}
