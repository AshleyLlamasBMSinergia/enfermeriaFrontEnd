import { Component } from '@angular/core';
import { Insumos } from '../insumos';
import { InsumosMedicosService } from '../insumos-medicos.service';
import { Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { Lotes } from '../../lotes-medicos/lotes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class InsumosMedicosIndexComponent {
  insumos: Insumos[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  search: string = '';
  private searchTerms = new Subject<string>();

    constructor(
      private insumosMedicosService: InsumosMedicosService,
      private router: Router,
    ) { }

    ngOnInit(): void {
      this.getInsumosMedicos();

      this.searchTerms.pipe(
        debounceTime(500)
      ).subscribe(() => {
        this.realizarBusqueda();
      });
    }

    buscarInsumo() {
      this.searchTerms.next(this.search.trim());
    }
    
    realizarBusqueda() {
      if (this.search.trim() !== '') {
        this.insumosMedicosService.buscador(this.search)
          .subscribe(
            insumos => this.insumos = insumos,
            error => console.error(error)
          );
      } else {
        this.getInsumosMedicos();
      }
    }
  
    getInsumosMedicos(): void {
      this.insumosMedicosService.getInsumosMedicos().subscribe(
        (insumos: Insumos[]) => {
          this.insumos = insumos;
        },
        (error) => {
          console.log(error);
        }
      );
    }

    showInsumoMedico(id: number) {
      this.router.navigate(['/enfermeria/insumos-medicos', id]);
    }

    obtenerSumatoriaPiezasDisponibles(lotes: any[]): number {
      return lotes.reduce((total, lote) => total + parseInt(lote.piezasDisponibles, 10), 0);
    }

    destroyInsumo(insumoId: number) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-danger',
        },
        buttonsStyling: false,
      });
    
      swalWithBootstrapButtons
        .fire({
          title: '¿Estás seguro de eliminar el insumo médico?',
          text: '¡Todos los lotes de este insumo médico se eliminarán y no podrás revertir esto!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
          reverseButtons: true,
        })
        .then((result) => {
          if (result.isConfirmed) {
            this.insumosMedicosService.destroyInsumo(insumoId).subscribe(
              (response) => {
                this.mensaje(response);
              },
              (error) => {
                console.error('Error al eliminar el insumo médico:', error);
                swalWithBootstrapButtons.fire('Error', 'Hubo un error al eliminar el insumo médico.', 'error');
              }
            );
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire('Cancelado', 'El insumo médico está seguro :)', 'error');
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
