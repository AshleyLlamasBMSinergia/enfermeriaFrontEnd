import { Component } from '@angular/core';
import { Lotes } from 'src/app/interfaces/lotes';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { Insumos } from 'src/app/interfaces/insumos';
import { ImageService } from 'src/app/services/imagen.service';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { InsumosMedicosService } from 'src/app/pages/insumos-medicos/insumos-medicos.service';
import { LotesMedicosService } from 'src/app/pages/lotes-medicos/lotes-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { InventariosService } from '../../../inventarios.service';
import { Inventarios } from 'src/app/interfaces/inventarios';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class InsumoShowComponent {
  inventario!: Inventarios | null;
  insumo!: Insumos | null;
  lotes: Lotes[] = [];

  cantidadLotesCaducos: number = 0;
  cantidadLotesVacios: number = 0;

  image: any;

  paginaActual = 1;
  elementosPorPagina = 10;

  search: string = '';
  private searchTerms = new Subject<string>();

  constructor(
    private notificationService: NotificationService,
    private insumosMedicoService: InsumosMedicosService,
    private lotesMedicosService: LotesMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private inventariosService: InventariosService,
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
    }
  }

  crearLote(inventarioId: number, insumoId: number) {
    this.router.navigate(['/enfermeria/almacenes', inventarioId, 'insumos', insumoId, 'lotes', 'create']);
  }
  

  getInsumo() {
    this.route.params.subscribe(params => {
      const inventarioId = params['inventarioId']; // Obtén el ID del inventario
      const insumoId = params['insumoId']; // Obtén el ID del insumo
      this.buscarInsumo(inventarioId, insumoId);
    });
  }

  buscarInsumo(inventarioId: number, insumoId: number){
    this.insumosMedicoService.getInsumoPorInventario(inventarioId, insumoId)
      .subscribe(insumo => {
        
        this.insumo = insumo;
        this.lotes = insumo.lotes;

        const lotesCaducos = this.lotes.filter(lote => this.esFechaCaducidadHoyOPosterior(lote.fechaCaducidad) && lote.piezasDisponibles != 0);
        this.cantidadLotesCaducos = lotesCaducos.length;

        const lotesVacios = this.lotes.filter(lote => lote.piezasDisponibles == 0 && !this.esFechaCaducidadHoyOPosterior(lote.fechaCaducidad));
        this.cantidadLotesVacios = lotesVacios.length;

        if (insumo.image?.url) {
          this.obtenerImagen(insumo.image?.url).subscribe((imagen) => {
            this.image = imagen;
          });
        }else{
          this.image = '/assets/dist/img/image.jpg';
        }
    });

    this.inventariosService.getInventario(inventarioId)
      .subscribe(inventario => {
        this.inventario = inventario;
    });
  }

  obtenerImagen(url: string): Observable<any> {
    return this.imageService.getImagen(url).pipe(
      map((response: any) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }),
      catchError((error) => {
        console.log(error);
        return of('/assets/dist/img/image.jpg');
      })
    );
  }

  esFechaCaducidadHoyOPosterior(fechaCaducidad: Date | undefined): boolean {
    if (!fechaCaducidad) {
      return false;
    }
  
    const fechaCaducidadDate = new Date(fechaCaducidad);
    const hoy = new Date();

    return fechaCaducidadDate <= hoy;
  }

  showLote(inventarioId: number, insumoId: number, loteId: number) {
    this.router.navigate(['/enfermeria/almacenes', inventarioId, 'insumos', insumoId, 'lotes', loteId]);
  }
}
