import { CalendarioService } from '../../calendario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Component, ElementRef, Renderer2, Input, ViewChild } from '@angular/core';

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

  constructor(
    private router: Router, private route: ActivatedRoute,
    private calendarioService: CalendarioService,
    private el: ElementRef, private renderer: Renderer2,
    ) { }

  iniciarConsulta(cita: number) {
    // console.log('Iniciar consulta:', cita);
    // if ($('#dateModal').length) {
    //   $('#dateModal').modal('hide'); // Oculta el modal
    // }else{
    //   console.log('No existe');

    // }
  }

  getEventColor(event: any): string {
    return event?.calendario?.color || '#000000'; // Si no hay color definido, se usará negro (#000000) como valor predeterminado
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
    const cita = {
      tipo: this.tipo,
      motivo: this.motivo,
      fecha: fechaHora.toISOString(), // Usar la fecha actualizada con la hora
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

  // iniciarConsulta(cita: number) {
  //   this.router.navigate(['/enfermeria/consultas/create'], { queryParams: { cita } });
  // }
}