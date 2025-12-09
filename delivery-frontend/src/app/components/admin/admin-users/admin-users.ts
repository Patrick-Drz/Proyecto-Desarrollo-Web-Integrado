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
  // Listas de datos
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];

  // Formulario y control de estado
  userForm: FormGroup;
  editMode = false;
  currentUserId: number | null = null;

  // Estadísticas y Filtros
  stats: any = { total: 0, activos: 0, inactivos: 0 };
  filtroTexto: string = '';
  filtroRol: string = 'TODOS';

  // Configuración del Gráfico Circular (Pie Chart)
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: ['Activos', 'Bloqueados'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#1cc88a', '#e74a3b'], // Verde y Rojo
      hoverBackgroundColor: ['#17a673', '#be2617']
    }]
  };

  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  constructor(
    private userService: AdminUserService,
    private fb: FormBuilder
  ) {
    // Inicializar formulario con validaciones
    this.userForm = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contrasena: [''], // La contraseña es opcional al editar
      rol: ['CLIENTE', Validators.required],
      codigoEstudiante: [''],
      activo: [true]
    });
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  // Carga usuarios y estadísticas del backend
  cargarDatos() {
    this.userService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.aplicarFiltros();
      },
      error: (err) => console.error('Error al listar usuarios', err)
    });

    this.userService.obtenerEstadisticas().subscribe({
      next: (s) => {
        this.stats = s;
        this.actualizarGrafico();
      },
      error: (err) => console.error('Error al cargar estadísticas', err)
    });
  }

  // Actualiza los datos del gráfico con la info del backend
  actualizarGrafico() {
    this.pieChartData = {
      ...this.pieChartData,
      datasets: [{
        data: [this.stats.activos, this.stats.inactivos],
        backgroundColor: ['#1cc88a', '#e74a3b']
      }]
    };
  }

  // Filtra la tabla según el texto y el rol seleccionado
  aplicarFiltros() {
    this.usuariosFiltrados = this.usuarios.filter(u => {
      const matchTexto =
        u.nombreCompleto.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        u.correo.toLowerCase().includes(this.filtroTexto.toLowerCase()) ||
        (u.codigoEstudiante && u.codigoEstudiante.toLowerCase().includes(this.filtroTexto.toLowerCase()));

      const matchRol = this.filtroRol === 'TODOS' || u.rol === this.filtroRol;

      return matchTexto && matchRol;
    });
  }

  // Guardar (Crear o Editar)
  onSubmit() {
    if (this.userForm.valid) {
      const userData = this.userForm.value;

      if (this.editMode && this.currentUserId) {
        // Editar
        this.userService.actualizar(this.currentUserId, userData).subscribe({
          next: () => {
            alert('Usuario actualizado correctamente');
            this.cargarDatos();
            this.cancelEdit();
          },
          error: () => alert('Error al actualizar usuario')
        });
      } else {
        // Crear
        if (!userData.contrasena) {
          alert("La contraseña es obligatoria para nuevos usuarios");
          return;
        }
        this.userService.crear(userData).subscribe({
          next: () => {
            alert('Usuario creado correctamente');
            this.cargarDatos();
            this.cancelEdit();
          },
          error: (err) => alert('Error: El correo podría estar duplicado')
        });
      }
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  // Cargar datos en el formulario para editar
  editar(usuario: Usuario) {
    this.editMode = true;
    this.currentUserId = usuario.id!;
    this.userForm.patchValue(usuario);
    this.userForm.get('contrasena')?.setValue(''); // Limpiamos el campo contraseña por seguridad
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Bloquear o Desbloquear usuario
  bloquear(id: number) {
    if(confirm('¿Estás seguro de cambiar el estado de este usuario?')) {
      this.userService.toggleBloqueo(id).subscribe(() => this.cargarDatos());
    }
  }

  // Cancelar edición y limpiar formulario
  cancelEdit() {
    this.editMode = false;
    this.currentUserId = null;
    this.userForm.reset({ rol: 'CLIENTE', activo: true });
  }

  // --- Exportar a CSV ---
  exportarCSV() {
    const cabeceras = ['ID', 'Nombre', 'Correo', 'Rol', 'Codigo', 'Estado', 'Fecha Registro'];
    const filas = this.usuariosFiltrados.map(u =>
      [u.id, u.nombreCompleto, u.correo, u.rol, u.codigoEstudiante, u.activo ? 'Activo' : 'Bloqueado', u.fechaRegistro]
    );

    let csvContent = "data:text/csv;charset=utf-8," + cabeceras.join(",") + "\n"
      + filas.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_usuarios.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // --- Importar desde CSV (Simulado) ---
  importarCSV(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const text = e.target.result;
      const lines = text.split('\n');

      // Saltamos la cabecera (slice 1)
      lines.slice(1).forEach((line: string) => {
        const data = line.split(',');
        // Esperamos formato: Nombre,Correo,Pass,Rol,Codigo
        if (data.length >= 3) {
          const newUser: Usuario = {
            nombreCompleto: data[0]?.trim(),
            correo: data[1]?.trim(),
            contrasena: data[2]?.trim(),
            rol: data[3]?.trim() || 'CLIENTE',
            codigoEstudiante: data[4]?.trim() || '',
            activo: true
          };

          if(newUser.correo && newUser.contrasena) {
            this.userService.crear(newUser).subscribe({
              error: err => console.error('Error importando línea', line)
            });
          }
        }
      });

      setTimeout(() => {
        alert('Proceso de importación finalizado');
        this.cargarDatos();
      }, 1500);
    };
    reader.readAsText(file);
  }
}
