import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CrearComboRequest {
  idProductoPadre: number;
  idProductoHijo: number;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class ComboService {
  private apiUrl = `${environment.apiUrl}/combos` || 'http://localhost:8080/api/combos';

  constructor(private http: HttpClient) {}

  agregarComponente(request: CrearComboRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/componentes`, request);
  }
}
