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

  //Formulario
  tipo: string = '';
  motivo: string = '';
  hora: string = '';

  constructor(private calendarioService: CalendarioService) { }

  getEventColor(event: any): string {
    return event?.calendario?.Color || '#000000'; // Si no hay color definido, se usará negro (#000000) como valor predeterminado
  }

  openAppointmentForm() {
    this.showAppointmentForm = true;
    this.showEventInfo = false;
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
    this.calendarioService.createCita(nuevaCita).subscribe(
      (response) => {
        this.mensaje(response); // Llamar a la función mensaje() con la respuesta
      },
      (error) => {
        console.error('Error al eliminar la cita:', error);
      }
    );
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