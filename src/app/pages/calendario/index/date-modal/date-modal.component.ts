import { Component, Input } from '@angular/core';
import { CalendarioService } from '../../calendario.service';

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
        console.log('Cita guardada exitosamente:', response);
      },
      (error) => {
        console.error('Error al guardar la cita:', error);
      }
    );
  }
  
}