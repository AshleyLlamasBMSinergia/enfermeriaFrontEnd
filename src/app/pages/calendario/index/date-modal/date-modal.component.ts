import { CalendarioService } from '../../calendario.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Component, Input } from '@angular/core';
import 'bootstrap';
import { formatDate } from '@angular/common';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ExternosService } from 'src/app/services/externos.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-date-modal',
  templateUrl: './date-modal.component.html',
  styleUrls: ['./date-modal.component.css']
})
export class DateModalComponent {
  
  @Input() selectedDate: any;
  @Input() relatedEvents: any[] = [];

  showEventInfo: boolean = true;
  showAppointmentForm: boolean = false;
  isEditing: boolean = false;
  editedCita: any = null;

  horariosDisponibles: any[] = [];
  opcionesPacientes: any[] = [];
  profesional: any;

  //Formulario
  tipo: string = '';
  motivo: string = '';
  hora: string = '';
  pacientable_type: string = '';
  pacientable_id: any = null;


  constructor(
    private router: Router, 
    private calendarioService: CalendarioService,
    private empleadosService: EmpleadosService,
    private externosService: ExternosService,
    private userService: UserService,
    ) { }

  ngOnInit(): void {
      this.userService.user$.subscribe(
        (user: any) => {
          this.profesional = user[0];
        },
        (error) => {
          console.error('Error al obtener los datos del usuario', error);
        }
      );
  }

  cerrarModal(){
    (window as any).$('#dateModal').modal('hide');
  }

  iniciarConsulta(cita: number) {
    this.cerrarModal();
    this.router.navigate(['/enfermeria/consultas/create', { cita: cita }]);
  }

  getEventColor(event: any): string {
    return event?.calendario?.color || '#000000';
  }

  openAppointmentForm(isEditing: boolean = false) {

    if(this.isEditing == true){
      this.tipo = '';
      this.motivo = '';
      this.hora = '';
    }

    this.showAppointmentForm = true;
    this.showEventInfo = false;
    this.isEditing = isEditing;
    
    const selectedDate = new Date(this.selectedDate); // Convertir a objeto Date
    const formattedDate = formatDate(selectedDate, 'yyyy-MM-dd', 'en-US');
  
    this.calendarioService.getHorariosDisponibles(1, formattedDate).subscribe(
      (horariosDisponibles: string[]) => {
        this.horariosDisponibles = horariosDisponibles;
      },
      (error) => {
        console.error('Error al obtener los horarios disponibles', error);
      }
    );
  }

  closeAppointmentForm() {
    this.horariosDisponibles = [];
    this.showAppointmentForm = false;
    this.showEventInfo = true;
  }

  cambiarTipoPaciente() {
    this.opcionesPacientes = [];
    this.pacientable_id = null;

    switch(this.pacientable_type){
      case 'Empleado':
        this.cargarOpcionesEmpleados();
      break;
      case 'Externo':
        this.cargarOpcionesExternos();
      break;
    }
  }

  cargarOpcionesEmpleados() {
    this.empleadosService.getEmpleados().subscribe(
      (empleados) => {
        this.opcionesPacientes = empleados.map((empleado: any) => ({
          id: empleado.id,
          text: empleado.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }

  cargarOpcionesExternos() {
    this.externosService.getExternos().subscribe(
      (externos) => {
        this.opcionesPacientes = externos.map((externo: any) => ({
          id: externo.id,
          text: externo.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener externos:', error);
      }
    );
  }

  onPacienteChange(event: any) {
    const pacienteSeleccionado = this.opcionesPacientes.find(p => p.text === event.value);
    this.pacientable_id = pacienteSeleccionado?.id;
  }

  createCita() {
    const fechaCalendario = new Date(this.selectedDate);

    const [horas, minutos] = this.hora.split(':').map(Number);

    const fechaHora = new Date(
      fechaCalendario.getFullYear(),
      fechaCalendario.getMonth(),
      fechaCalendario.getDate(),
      horas,
      minutos
    );

    // Convertir a la hora local
    const fechaHoraLocal = fechaHora.toLocaleString();

    const cita = {
      tipo: this.tipo,
      motivo: this.motivo,
      fecha: fechaHoraLocal,
      pacientable_type: this.pacientable_type,
      pacientable_id: this.pacientable_id,
      profesional_id: this.profesional.id,
    };

    this.calendarioService.storeCita(cita).subscribe(
      (response) => {
        this.mensaje(response);
      },
      (error) => {
        console.error('Error al generar la cita:', error);
      }
    );
  }

  editCita(event: any) {
    this.tipo = event.calendario.tipo;
    this.motivo = event.calendario.motivo;
    this.hora = new Date(event.calendario.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Almacena la cita que se está editando en la propiedad editedCita
    this.editedCita = event;

    this.openAppointmentForm(true);
  }

  updateCita() {
    if (this.editedCita && this.editedCita.calendario) {
      // Combina la fecha del calendario con la hora ingresada en el formulario
      const fechaHora = new Date(this.selectedDate);
      const horasMinutos = this.hora.split(':');
        
      fechaHora.setHours(Number(horasMinutos[0]), Number(horasMinutos[1]));
        
      // Construir el objeto de la cita actualizada con los datos del formulario
      const citaActualizada = {
        tipo: this.tipo,
        motivo: this.motivo,
        fecha: fechaHora.toISOString(), // Usar la fecha actualizada con la hora
      };
    
      // Llamar al servicio para actualizar la cita en el backend
      const cita = this.editedCita.calendario; // Utilizar la cita almacenada en editedCita

      this.calendarioService.updateCita(cita.id, citaActualizada).subscribe(
        (response) => {
          this.mensaje(response); // Llamar a la función mensaje() con la respuesta
        },
        (error) => {
          console.error('Error al actualizar la cita:', error);
        }
      );
    }
  }

  destroyCita(event: any) {
    const cita = event.calendario;
  
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro de cancelar la cita?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.calendarioService.destroyCita(cita.id).subscribe(
            (response) => {
              this.mensaje(response);
            },
            (error) => {
              console.error('Error al eliminar la cita:', error);
              swalWithBootstrapButtons.fire('Error', 'Hubo un error al eliminar la cita.', 'error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire('Cancelado', 'Tu cita está segura :)', 'error');
        }
      });
  }
  
  mensaje(response: any) {
    // Mostrar notificación de éxito con mensaje personalizado del backend
    Swal.fire({
      icon: 'success',
      title: response.message, // Usar el mensaje del backend
      showConfirmButton: false,
      timer: 6500 // Duración de la notificación en milisegundos
    });
  
    // Esperar unos segundos antes de recargar la página
    setTimeout(() => {
      // Refrescar la página
      window.location.reload();
    }, 2000); // Cambia el valor si deseas ajustar el tiempo de espera
  }
}