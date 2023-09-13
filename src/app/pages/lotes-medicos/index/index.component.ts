import { Component } from '@angular/core';
import { Lotes } from '../lotes';
import { LotesMedicosService } from '../lotes-medicos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { InsumosMedicosService } from '../../insumos-medicos/insumos-medicos.service';
import { Insumos } from '../../insumos-medicos/insumos';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class LotesMedicosIndexComponent {
  insumo!: Insumos | null;
  lotes: Lotes[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  search: string = '';
  private searchTerms = new Subject<string>();

  constructor(
    private lotesMedicosService: LotesMedicosService,
    private insumosMedicoService: InsumosMedicosService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {

    this.getInsumo();

    this.searchTerms.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.realizarBusqueda();
    });
  }

  buscarLote() {
    this.searchTerms.next(this.search.trim());
  }
  
  realizarBusqueda() {
    if (this.search.trim() !== '') {
      this.lotesMedicosService.buscador(this.search)
        .subscribe(
          lotes => this.lotes = lotes,
          error => console.error(error)
        );
    } else {
      
    }
  }

  getInsumo() {
    const insumoId = +this.route.snapshot.paramMap.get('id')!;
    this.insumosMedicoService.getInsumo(insumoId)
      .subscribe(insumo => {
        this.insumo = insumo;
        this.lotes = insumo.lotes;
      });
  }
}
