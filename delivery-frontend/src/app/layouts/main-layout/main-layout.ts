import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; 
import { AuthService } from '../../auth/services/auth';
import { ComplaintService } from '../../core/services/complaint';

@Component({
  selector: 'app-main-layout',
  standalone: false,
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss'
})
export class MainLayout {
  complaintForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalService: NgbModal,
    private fb: FormBuilder,
    private complaintService: ComplaintService
  ) {
    this.complaintForm = this.fb.group({
      tipoReclamacion: ['QUEJA', Validators.required],
      descripcion: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  abrirModalReclamacion(content: any): void {
    if (!this.authService.isLoggedIn()) {
      alert('Primero tiene que iniciar sesión para enviar una reclamación.');
      this.router.navigate(['/auth/login']);
      return;
    }

    this.modalService.open(content, { centered: true });
  }

  enviarReclamacion(): void {
    if (this.complaintForm.valid) {
      this.complaintService.crearReclamacion(this.complaintForm.value).subscribe({
        next: () => {
          alert('¡Reclamación enviada exitosamente!');
          this.complaintForm.reset({ tipoReclamacion: 'QUEJA' });
          this.modalService.dismissAll(); 
        },
        error: (err) => {
          console.error(err);
          alert('Error al enviar la reclamación.');
        }
      });
    } else {
      this.complaintForm.markAllAsTouched();
    }
  }
}