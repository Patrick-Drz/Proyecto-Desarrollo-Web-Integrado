import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: number;
  nombreCompleto: string;
  correo: string;
  contrasena?: string;
  rol: string;
  codigoEstudiante: string;
  activo: boolean;
  fechaRegistro?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private apiUrl = 'http://localhost:8080/api/admin/usuarios';

  constructor(private http: HttpClient) { }

  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerEstadisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`);
  }

  crear(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  toggleBloqueo(id: number): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}/bloqueo`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
