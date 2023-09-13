import { Component } from '@angular/core';
import { Insumos } from '../insumos';
import { InsumosMedicosService } from '../insumos-medicos.service';
import { Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { Lotes } from '../../lotes-medicos/lotes';

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
}
