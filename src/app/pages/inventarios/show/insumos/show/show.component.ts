import { Component } from '@angular/core';
import { Lotes } from 'src/app/interfaces/lotes';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { Insumos } from 'src/app/interfaces/insumos';
import Swal from 'sweetalert2';
import { ImageService } from 'src/app/services/imagen.service';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { InsumosMedicosService } from 'src/app/pages/insumos-medicos/insumos-medicos.service';
import { InsumoDataService } from 'src/app/pages/insumos-medicos/insumo-data.service';
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
    private insumoDataService: InsumoDataService,
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
    this.router.navigate(['/enfermeria/inventarios', inventarioId, 'insumos', insumoId, 'lotes', 'create']);
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

  destroyLote(LoteId: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro de eliminar el lote?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.lotesMedicosService.destroyLote(LoteId).subscribe(
            (response) => {
              this.notificationService.mensaje(response);
            },
            (error) => {
              console.error('Error al eliminar el lote:', error);
              swalWithBootstrapButtons.fire('Error', 'Hubo un error al eliminar el lote.', 'error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire('Cancelado', 'El lote está seguro :)', 'error');
        }
      });
  }


  showLote(inventarioId: number, insumoId: number, loteId: number) {
    this.router.navigate(['/enfermeria/inventarios', inventarioId, 'insumos', insumoId, 'lotes', loteId]);
  }

  isExpiringSoon(fechaCaducidad: string): boolean {
    const hoy = new Date();
    const fechaCaducidadDate = new Date(fechaCaducidad);
    const diasRestantes = Math.ceil((fechaCaducidadDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  
    return diasRestantes <= 7; // Cambia el número de días según tu criterio de caducidad próxima.
  }
}
