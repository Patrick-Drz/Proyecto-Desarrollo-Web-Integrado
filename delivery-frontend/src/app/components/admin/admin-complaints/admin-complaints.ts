import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-complaints',
  templateUrl: './admin-complaints.html',
  standalone: false
})
export class AdminComplaints {
  // Datos simulados (Mock) para la vista, ya que no hay endpoint
  reclamaciones = [
    { id: 1, nombre: 'Patrick Del Aguila', correo: 'u22327322@utp.edu.pe', tipo: 'SUGERENCIA', descripcion: 'Mejoren su pagina', fecha: '08-06-2025 13:54' },
    { id: 2, nombre: 'Patrick Del Aguila', correo: 'u22327322@utp.edu.pe', tipo: 'RECLAMACION', descripcion: 'No me carga los productos que selecciono', fecha: '08-06-2025 13:58' },
    { id: 3, nombre: 'Franco Torres', correo: 'u13467985@utp.edu.pe', tipo: 'QUEJA', descripcion: 'No me gusta su pagina', fecha: '08-06-2025 15:33' },
    { id: 4, nombre: 'Estefano Rodriguez', correo: 'u11223344@utp.edu.pe', tipo: 'QUEJA', descripcion: 'Tuve inconvenientes al iniciar sesion', fecha: '19-10-2025 17:52' }
  ];
}