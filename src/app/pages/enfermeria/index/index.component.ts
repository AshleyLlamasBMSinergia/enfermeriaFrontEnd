import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EnfermeriaService } from '../enfermeria.service';
import Swal from 'sweetalert2';
import { FormGroup, FormControl, Validators } from '@angular/forms'; // Importa los módulos necesarios

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class EnfermeriaIndexComponent {

  citasHoy: number = 0;
  tasks: any[] = [];

  selectedTask: any = {
    id: null,
    fecha: null,
    titulo: ''
  };

  pendienteForm: FormGroup;

  constructor(private router: Router, private enfermeriaService: EnfermeriaService) {
    this.pendienteForm = new FormGroup({
      titulo: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      fecha: new FormControl(null, [Validators.required])
    });
  }

  ngOnInit(): void {

    this.enfermeriaService.getCitasHoy().subscribe(
      (citasHoy: number) => {
        this.citasHoy = citasHoy;
      },
      (error) => {
        console.error('Error al obtener el número de citas', error);
      }
    );

    this.pendienteForm = new FormGroup({
      titulo: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]),
      fecha: new FormControl(null, [
        Validators.required,
      ])
    });

    this.enfermeriaService.getPendientes().subscribe(data => {
      this.tasks = data.map(task => ({
        ...task,
        completed: task.estatus === '1' // Convertir 'estatus' en un valor booleano
      }));
    });
  }


  isFechaAntesDeHoy(fecha: string): boolean {
    const fechaTask = new Date(fecha);
    const hoy = new Date();
    return fechaTask < hoy;
  }
  

  updateEstatusPendiente(pendiente: any) {
    const nuevoEstatus = pendiente.completed ? '1' : '0';
    this.enfermeriaService.editEstatusPendiente(pendiente.id, nuevoEstatus).subscribe(
      () => {
        // Actualizar el estado de la tarea en la lista local si la actualización en la base de datos fue exitosa
        pendiente.estatus = nuevoEstatus;
      },
      (error) => {
        console.error('Error al actualizar el estado de la tarea', error);
      }
    );
  }

  openPendienteModal(task: any) {
    if (task) {
      // Editar pendiente existente
      this.selectedTask = { ...task };
      this.pendienteForm.patchValue({ titulo: task.titulo, fecha: task.fecha });
    } else {
      // Crear nuevo pendiente
      this.selectedTask = {
        id: null,
        titulo: '',
        fecha: null
      };
      this.pendienteForm.reset();
    }
  }  

  guardarPendiente() {
    if (this.pendienteForm.valid) {
      if (this.selectedTask.id) {
        // Editar pendiente existente
        this.updateTituloPendiente();
      } else {
        // Crear nuevo pendiente
        this.storePendiente();
      }
    }
  }

  updateTituloPendiente(){
    const pendiente = this.pendienteForm.value;
    this.enfermeriaService.updateTituloPendiente(this.selectedTask.id, pendiente).subscribe(
      (response) => {
        this.mensaje(response);
      },
      (error) => {
        console.error('Error al editar el pendiente', error);
      }
    );
  }

  storePendiente() {
    const nuevoPendiente = {
      titulo: this.pendienteForm.get('titulo')?.value,
      fecha: this.pendienteForm.get('fecha')?.value
    };
  
    this.enfermeriaService.storePendiente(nuevoPendiente).subscribe(
      (response) => {
        this.mensaje(response);
      },
      (error) => {
        console.error('Error al crear el pendiente', error);
      }
    );
  }

  destroyPendiente(pendienteId: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro de eliminar el pendiente?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.enfermeriaService.destroyPendiente(pendienteId).subscribe(
            (response) => {
              this.mensaje(response);
            },
            (error) => {
              console.error('Error al eliminar el pendiente:', error);
              swalWithBootstrapButtons.fire('Error', 'Hubo un error al eliminar el pendiente.', 'error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire('Cancelado', 'Tu pendiente está seguro :)', 'error');
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
