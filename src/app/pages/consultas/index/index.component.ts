import { Component, OnInit } from '@angular/core';
import { Consultas } from '../consultas';
import { ConsultasService } from '../consultas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class ConsultasIndexComponent implements OnInit{
  consultas: Consultas[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;

    constructor(
      private consultasService: ConsultasService,
      private router: Router,
    ) { }
  
    ngOnInit(): void {
      this.getConsultas();
    }
  
    getConsultas(): void {
      this.consultasService.getConsultas().subscribe(
        (consultas: Consultas[]) => {
          this.consultas = consultas.map((consulta) => {
            return this.consultasService.pacientable(consulta);
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }

    showConsulta(id: number) {
      this.router.navigate(['/enfermeria/consultas', id]);
    }
    
    destroyConsulta(consultaId: number) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });
    
      swalWithBootstrapButtons
        .fire({
          title: '¿Estás seguro de eliminar la consulta?',
          text: '¡No podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.consultasService.destroyConsulta(consultaId).subscribe(
              (response) => {
                this.mensaje(response);
              },
              (error) => {
                console.error('Error al eliminar el consulta:', error);
                swalWithBootstrapButtons.fire('Error', 'Hubo un error al eliminar la consulta.', 'error');
              }
            );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire('Cancelado', 'Tu consulta está segura :)', 'error');
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