import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';

export interface Oferta {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precioRegular: number;
  precioOferta: number;
  fechaInicio: string;
  fechaFin: string;
  activa: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OfferService {
  private ofertasIniciales: Oferta[] = [
    { id: 1, codigo: 'OFR001', nombre: 'Combo Hamburguesa', descripcion: 'Hamburguesa + Papas + Gaseosa', precioRegular: 25.00, precioOferta: 18.00, fechaInicio: '2025-06-01', fechaFin: '2025-06-30', activa: true },
    { id: 2, codigo: 'OFR002', nombre: 'Desayuno Continental', descripcion: 'Café + Tostadas + Jugo', precioRegular: 15.00, precioOferta: 10.00, fechaInicio: '2025-06-01', fechaFin: '2025-06-30', activa: true }
  ];

  private ofertasSubject = new BehaviorSubject<Oferta[]>(this.ofertasIniciales);
  ofertas$ = this.ofertasSubject.asObservable();

  obtenerOfertas(): Observable<Oferta[]> {
    return this.ofertas$;
  }

  crearOferta(oferta: Oferta): Observable<boolean> {
    const actuales = this.ofertasSubject.value;
    oferta.id = actuales.length > 0 ? Math.max(...actuales.map(o => o.id)) + 1 : 1;
    this.ofertasSubject.next([...actuales, oferta]);
    return of(true);
  }

  eliminarOferta(id: number): Observable<boolean> {
    const actuales = this.ofertasSubject.value;
    this.ofertasSubject.next(actuales.filter(o => o.id !== id));
    return of(true);
  }

  actualizarOferta(oferta: Oferta): Observable<boolean> {
    const actuales = this.ofertasSubject.value;
    const index = actuales.findIndex(o => o.id === oferta.id);
    if (index !== -1) {
      actuales[index] = oferta;
      this.ofertasSubject.next([...actuales]);
    }
    return of(true);
  }
}