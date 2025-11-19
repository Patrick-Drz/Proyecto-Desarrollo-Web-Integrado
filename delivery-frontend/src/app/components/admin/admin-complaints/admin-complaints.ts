import { Component, OnInit } from '@angular/core';
import { ComplaintService, Reclamacion } from '../../../core/services/complaint';

@Component({
  selector: 'app-admin-complaints',
  templateUrl: './admin-complaints.html',
  standalone: false
})
export class AdminComplaints implements OnInit {
  reclamaciones: Reclamacion[] = [];

  constructor(private complaintService: ComplaintService) {}

  ngOnInit(): void {
    this.cargarReclamaciones();
  }

  cargarReclamaciones() {
    this.complaintService.obtenerTodas().subscribe({
      next: (data) => this.reclamaciones = data.reverse(), 
      error: (err) => console.error('Error al cargar reclamaciones', err)
    });
  }
}