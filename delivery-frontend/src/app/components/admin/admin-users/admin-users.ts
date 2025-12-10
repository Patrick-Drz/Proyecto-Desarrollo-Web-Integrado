import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUserService, Usuario } from '../../../core/services/admin-user';
import { ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.html',
  styleUrls: ['./admin-users.scss'],
  standalone: false
})
export class AdminUsersComponent implements OnInit {
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  userForm: FormGroup;
  editMode = false;
  currentUserId: number | null = null;

  stats: any = { total: 0, activos: 0, inactivos: 0 };
  filtroTexto: string = '';
  filtroRol: string = 'TODOS';

  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Activos', 'Bloqueados'],
    datasets: [{ data: [0, 0], backgroundColor: ['#1cc88a', '#e74a3b'] }]
  };
  public pieChartOptions: ChartOptions<'pie'> = { responsive: true, maintainAspectRatio: false };

  constructor(private userService: AdminUserService, private fb: FormBuilder) {
    this.userForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      // CAMBIO 1: La contraseña inicia como OBLIGATORIA (para crear)
      contrasena: ['', Validators.required],
      rol: ['CLIENTE', Validators.required],
      codigoEstudiante: [''],
      activo: [true]
    });
  }

  ngOnInit(): void { this.cargarDatos(); }

  cargarDatos() {
    this.userService.listar().subscribe({
      next: (data) => { this.usuarios = data; this.aplicarFiltros(); },
      error: (err) => console.error('Error al listar', err)
    });
    this.userService.obtenerEstadisticas().subscribe(s => {
      this.stats = s;
      this.actualizarGrafico();
    });
  }

  actualizarGrafico() {
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{ data: [this.stats.activos, this.stats.inactivos], backgroundColor: ['#1cc88a', '#e74a3b'] }]
    };
  }

  aplicarFiltros() {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const termino = this.filtroTexto.toLowerCase();
      return (u.nombreCompleto.toLowerCase().includes(termino) || u.correo.toLowerCase().includes(termino)) &&
        (this.filtroRol === 'TODOS' || u.rol === this.filtroRol);
    });
  }

  onSubmit() {
    // Si el formulario es válido (Angular ya revisó que la contraseña esté si es modo crear)
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.editMode && this.currentUserId) {
        this.userService.actualizar(this.currentUserId, userData).subscribe({
          next: () => { alert('Usuario actualizado'); this.cargarDatos(); this.cancelEdit(); },
          error: () => alert('Error al actualizar')
        });
      } else {
        // CAMBIO 2: Se eliminó la validación manual if (!userData.contrasena...).
        // Ya no es necesaria porque el userForm.valid de arriba se encarga.

        this.userService.crear(userData).subscribe({
          next: () => { alert('Usuario creado correctamente'); this.cargarDatos(); this.cancelEdit(); },
          error: (err) => {
            console.error(err);
            if (err.status === 409 || err.status === 400) {
              alert('Atención: ' + (err.error?.message || 'Datos inválidos o duplicados.'));
            } else {
              alert('Error interno del servidor.');
            }
          }
        });
      }
    } else {
      // Si falta la contraseña en modo crear, el formulario será inválido y entrará aquí.
      // Esto marca los campos en rojo si tu HTML tiene clases de validación.
      this.userForm.markAllAsTouched();
      // Opcional: Si quieres mantener la alerta, descomenta la siguiente línea:
      // if (!this.editMode && this.userForm.get('contrasena')?.invalid) alert("La contraseña es obligatoria.");
    }
  }

  editar(usuario: Usuario) {
    this.editMode = true;
    this.currentUserId = usuario.id!;

    // CAMBIO 3: Al entrar a editar, hacemos la contraseña OPCIONAL
    this.userForm.get('contrasena')?.clearValidators();
    this.userForm.get('contrasena')?.updateValueAndValidity();

    this.userForm.patchValue(usuario);
    this.userForm.get('contrasena')?.setValue('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelEdit() {
    this.editMode = false;
    this.currentUserId = null;
    this.userForm.reset({ rol: 'CLIENTE', activo: true });

    // CAMBIO 4: Al volver a modo crear, hacemos la contraseña OBLIGATORIA de nuevo
    this.userForm.get('contrasena')?.setValidators(Validators.required);
    this.userForm.get('contrasena')?.updateValueAndValidity();
  }

  bloquear(id: number) {
    if(confirm('¿Cambiar estado?')) this.userService.toggleBloqueo(id).subscribe(() => this.cargarDatos());
  }

  exportarCSV() {
    const cabeceras = ['ID', 'Nombre', 'Correo', 'Rol', 'Codigo', 'Estado', 'Fecha Registro'];
    const filas = this.usuariosFiltrados.map(u =>
      [u.id, u.nombreCompleto, u.correo, u.rol, u.codigoEstudiante, u.activo ? 'Activo' : 'Bloqueado', u.fechaRegistro]
    );
    let csvContent = "data:text/csv;charset=utf-8," + cabeceras.join(",") + "\n" + filas.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
