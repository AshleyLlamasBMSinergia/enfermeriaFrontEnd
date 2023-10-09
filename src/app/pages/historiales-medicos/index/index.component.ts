import { Component } from '@angular/core';
import { HistorialesMedicos } from '../historiales-medicos';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class HistorialesMedicosIndexComponent {
  historialesMedicos: HistorialesMedicos[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;
  
  search: string = '';
  private searchTerms = new Subject<string>();
  
    constructor(
      private historialesMedicosService: HistorialesMedicosService,
      private notificationService: NotificationService,
      private router: Router,
    ) { }
  
    ngOnInit(): void {
      this.getHistorialesMedicos();

      this.searchTerms.pipe(
        debounceTime(500)
      ).subscribe(() => {
        this.realizarBusqueda();
      });
    }

    buscarPaciente() {
      this.searchTerms.next(this.search.trim());
    }
    
    realizarBusqueda() {
      if (this.search.trim() !== '') {
        this.historialesMedicosService.buscador(this.search)
          .subscribe(
            historiales => this.historialesMedicos = historiales,
            error => console.error(error)
          );
      } else {
        this.getHistorialesMedicos();
      }
    }

    getHistorialesMedicos(): void {
      this.historialesMedicosService.getHistorialesMedicos().subscribe(
        (historialesMedicos: HistorialesMedicos[]) => {
          this.historialesMedicos = historialesMedicos.map((historialMedico) => {
            return this.historialesMedicosService.pacientable(historialMedico);
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
    showHistorialMedico(id: number) {
      this.router.navigate(['/enfermeria/historiales-medicos', id]);
    }

    editHistorialMedico(id: number) {
      this.router.navigate(['/enfermeria/historiales-medicos/edit', id]);
    }

    async destroyHistorialMedico(id: number | undefined) {
      if (id !== undefined) {
        const confirmacion = await this.notificationService.confirmarEliminacion('historial médico junto sus citas');
    
        if (confirmacion) {
          this.historialesMedicosService.destroyHistorialMedico(id).subscribe(
            (response) => {
              this.notificationService.mensaje(response);
            },
            (error) => {
              console.error('Error al eliminar el historial médico:', error);
              this.notificationService.error('Hubo un error al eliminar el historial médico');
            }
          );
        }
      } else {
        this.notificationService.error('No se encontró el historial médico');
      }
    }
}
