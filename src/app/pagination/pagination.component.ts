import { Component, Input } from '@angular/core';
import { PaginationService } from './pagination.service';
import { SharedDataService } from './shared-data.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent {
  @Input() url!: string;

  solicitudes: any[] = [];
  filtros: any = {};

  
  totalPaginas: number = 0;
  elementosPorPagina: number = 10;
  paginaActual: number = 1;
  paginas: number[] = [];

  loading: boolean = false;

  ngOnInit(): void {
    this.loadSolicitudes();
    this.loadFiltros();
  }

  constructor(
    private paginationService: PaginationService,
    private sharedDataService: SharedDataService,
  ) { }

  loadFiltros() {
    this.sharedDataService.filtros$.subscribe(filtros => {
      this.filtros = filtros;
    });
  }

  loadSolicitudes(): void {
    this.loading = true;
  
    // Suscribirse a los cambios de los filtros
    this.sharedDataService.filtros$.subscribe(filtros => {
      this.filtros = filtros;
      // Cargar las solicitudes cada vez que los filtros cambien
      this.paginationService.getSolicitudes(this.url, this.paginaActual, this.elementosPorPagina, this.filtros).subscribe(
        response => {
          this.sharedDataService.updateSolicitudes(response.data);
          this.solicitudes = response.data;
          this.totalPaginas = response.totalPaginas;
          this.calcularTotalPaginas();
          this.loading = false;
        },
        error => {
          console.error('Error al cargar las solicitudes:', error);
          this.loading = false;
        }
      );
    });
  }
  
  calcularTotalPaginas() {
    this.totalPaginas = Math.ceil(this.totalPaginas / this.elementosPorPagina);
    this.paginas = Array(this.totalPaginas).fill(0).map((x, i) => i + 1);
  }

  previousPage() {
    if (this.paginaActual > 1) {
        this.paginaActual--;
        this.loadSolicitudes();
    }
  }
  
  nextPage() {
    if (this.paginaActual < this.totalPaginas) {
        this.paginaActual++;
        this.loadSolicitudes();
    }
  }
  
  goToPage(pagina: number) {
    this.paginaActual = pagina;
    this.loadSolicitudes();
  }
}
