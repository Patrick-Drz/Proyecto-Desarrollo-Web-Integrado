import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth';
import { OrderService, Orden } from '../../core/services/order';
import { LocationService, Direccion } from '../../core/services/location';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.scss'],
  standalone: false
})
export class ProfileComponent implements OnInit {
  usuario: any = {
    nombre: 'Cargando...',
    email: '',
    codigo: '---'
  };
  direcciones: Direccion[] = [];
  ultimasOrdenes: Orden[] = [];

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private locationService: LocationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarDatosUsuario();
    this.cargarDirecciones();
    this.cargarOrdenes();
  }

  cargarDatosUsuario() {
    this.authService.getProfile().subscribe({
      next: (data) => {
        this.usuario = {
          nombre: data.nombreCompleto,
          email: data.correo,
          codigo: data.codigoEstudiante || 'Sin código'
        };
      },
      error: (err) => {
        console.error('Error obteniendo perfil:', err);
        this.usuario = {
          nombre: 'Error de Carga',
          email: 'Por favor, inicia sesión nuevamente.',
          codigo: '---'
        };
      }
    });
  }

  cargarDirecciones() {
    this.locationService.obtenerDirecciones().subscribe({
        next: (data) => this.direcciones = data,
        error: () => this.direcciones = []
    });
  }

  cargarOrdenes() {
    this.orderService.obtenerMisOrdenes().subscribe({
        next: (data) => this.ultimasOrdenes = data.reverse().slice(0, 5),
        error: () => this.ultimasOrdenes = []
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}