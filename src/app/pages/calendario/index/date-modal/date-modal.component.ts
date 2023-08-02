import { Component, Input } from '@angular/core';
import { CalendarioService } from '../../calendario.service';
import Swal from 'sweetalert2';

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

  //Formulario
  tipo: string = '';
  motivo: string = '';
  hora: string = '';

  constructor(private calendarioService: CalendarioService) { }

  getEventColor(event: any): string {
    return event?.calendario?.Color || '#000000'; // Si no hay color definido, se usará negro (#000000) como valor predeterminado
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
  }

  closeAppointmentForm() {
    this.showAppointmentForm = false;
    this.showEventInfo = true;
  }

  createCita() {
    // Combina la fecha del calendario con la hora ingresada en el formulario
    const fechaHora = new Date(this.selectedDate);
    const horasMinutos = this.hora.split(':');
    
    fechaHora.setHours(Number(horasMinutos[0]), Number(horasMinutos[1]));
    
    // Construir el objeto de la cita con los datos del formulario
    const nuevaCita = {
      Tipo: this.tipo,
      Motivo: this.motivo,
      Fecha: fechaHora.toISOString(), // Usar la fecha actualizada con la hora
    };
  
    //Llamar a un servicio para enviar los datos de la cita al backend
    this.calendarioService.storeCita(nuevaCita).subscribe(
      (response) => {
        this.mensaje(response); // Llamar a la función mensaje() con la respuesta
      },
      (error) => {
        console.error('Error al eliminar la cita:', error);
      }
    );
  }

  editCita(event: any) {

    this.tipo = event.calendario.Tipo;
    this.motivo = event.calendario.Motivo;
    this.hora = new Date(event.calendario.Fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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
        Tipo: this.tipo,
        Motivo: this.motivo,
        Fecha: fechaHora.toISOString(), // Usar la fecha actualizada con la hora
      };
    
      // Llamar al servicio para actualizar la cita en el backend
      const Cita = this.editedCita.calendario; // Utilizar la cita almacenada en editedCita
      this.calendarioService.updateCita(Cita.Cita, citaActualizada).subscribe(
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
    const Cita = event.calendario;
    this.calendarioService.destroyCita(Cita.Cita).subscribe(
      (response) => {
        this.mensaje(response); // Llamar a la función mensaje() con la respuesta
      },
      (error) => {
        console.error('Error al eliminar la cita:', error);
      }
    );
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