import { Component, OnInit } from '@angular/core';
import { ComplaintService, Reclamacion } from '../../../core/services/complaint';

@Component({
  selector: 'app-admin-complaints',
  templateUrl: './admin-complaints.html',
  standalone: false
})
export class AdminComplaints implements OnInit {
  
  reclamaciones: Reclamacion[] = [];
  reclamacionSeleccionada: Reclamacion | null = null;

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.cargarReclamaciones();
  }

  cargarReclamaciones() {
    this.complaintService.obtenerReclamaciones().subscribe({
      next: (data: Reclamacion[]) => {
        // Ordenar por ID descendente
        this.reclamaciones = data.sort((a, b) => b.id - a.id);
      },
      error: (err: any) => console.error('Error al cargar reclamaciones', err)
    });
  }

  verDetalle(rec: Reclamacion) {
    this.reclamacionSeleccionada = rec;
  }

  cerrarModal() {
    this.reclamacionSeleccionada = null;
  }
}