import { Component } from '@angular/core';
import { HistorialesMedicos } from '../historiales-medicos';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';

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
}
