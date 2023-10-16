import { Component } from '@angular/core';
import { InventariosService } from '../inventarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { Inventarios } from 'src/app/interfaces/inventarios';
import { InventarioDataService } from '../inventario-data.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class InventarioShowComponent {
  inventario!: Inventarios;
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  search: string = '';
  private searchTerms = new Subject<string>();

  constructor(
    private inventariosService: InventariosService,
    private router: Router,
    private route: ActivatedRoute,
    private inventarioDataService: InventarioDataService
  ) { }

  ngOnInit(): void {
    this.getInventario();

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
    // if (this.search.trim() !== '') {
    //   this.insumosMedicosService.buscador(this.search)
    //     .subscribe(
    //       insumos => this.insumos = insumos,
    //       error => console.error(error)
    //     );
    // } else {
    //   this.getInsumosMedicos();
    // }
  }

  crearInsumo(inventarioId: number) {
    this.inventarioDataService.setInventarioId(inventarioId);
    this.router.navigate(['/enfermeria/insumos-medicos/create']);
  }

  getInventario() {
    const inventarioId = +this.route.snapshot.paramMap.get('id')!;
    this.inventariosService.getInventario(inventarioId)
      .subscribe(inventario => {
        this.inventario = inventario;
      });
  }

  showInsumoMedico(id: number) {
    this.router.navigate(['/enfermeria/insumos-medicos', id]);
  }

  obtenerSumatoriaPiezasDisponibles(lotes: any[]): number {
    return lotes.reduce((total, lote) => total + parseInt(lote.piezasDisponibles, 10), 0);
  }
}
