import { Component } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pendiente-modal',
  templateUrl: './pendiente-modal.component.html',
  styleUrls: ['./pendiente-modal.component.css']
})
export class PendienteModalComponent {
  showPendienteForm: boolean = false;
  isEditing: boolean = false;

  //Formulario
  pendiente: string = '';

  openModal() {
    this.openPendienteForm(true);
  }

  openPendienteForm(isEditing: boolean = false) {

    if(this.isEditing == true){
      this.pendiente = '';
    }

    this.showPendienteForm = true;
    this.isEditing = isEditing;
  }

  closeAppointmentForm() {
    this.showPendienteForm = false;
  }

  createPendiente() {
    
  }

  editPendiente(pendiente: any) {

    this.pendiente = pendiente.pendiente;
    this.openPendienteForm(true);
  }

  updatePendiente() {
    
  }

  destroyPendiente(event: any) {
  
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
