import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  mensaje(response: any) {
    Swal.fire({
      icon: 'success',
      title: response.message,
      showConfirmButton: false,
      timer: 6500
    });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  success(response: any) {
    Swal.fire({
      icon: 'success',
      title: response.message,
      showConfirmButton: false,
      timer: 6500
    });
  }

  info(title: any, text: any) {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      showConfirmButton: false,
    });
  }

  error(response: any) {

    if (response.error && response.error.error) {
      response = response.error.error;
    } else {
      response = '¡Ups!, ocurrió un error :(';
    }

    Swal.fire({
      icon: 'error',
      title: response,
      showConfirmButton: false,
      timer: 6500
    });
  }

  async confirmarEliminacion(elemento: string): Promise<boolean> {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    const result = await swalWithBootstrapButtons.fire({
      title: `¿Estás seguro de eliminar este ${elemento}?`,
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      reverseButtons: true,
    });

    return result.isConfirmed;
  }
}
