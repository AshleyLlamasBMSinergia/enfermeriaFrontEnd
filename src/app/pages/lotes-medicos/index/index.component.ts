import { Component } from '@angular/core';
import { Lotes } from 'src/app/interfaces/lotes';
import { LotesMedicosService } from '../lotes-medicos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { InsumosMedicosService } from '../../insumos-medicos/insumos-medicos.service';
import { Insumos } from 'src/app/interfaces/insumos';
import Swal from 'sweetalert2';
import { ImageService } from 'src/app/services/imagen.service';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { InsumoDataService } from '../../insumos-medicos/insumo-data.service';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class LotesMedicosIndexComponent {

  events: any[] = [];
  relatedEvents: any[] = [];
  selectedDate: Date = new Date();
  selectedEvent: any;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin],
    locale: 'es',
    initialView: 'dayGridMonth',

    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
  };

  insumo!: Insumos | null;
  lotes: Lotes[] = [];
  loading: boolean = false;

  image: any;

  paginaActual = 1;
  elementosPorPagina = 10;

  search: string = '';
  private searchTerms = new Subject<string>();

  constructor(
    private lotesMedicosService: LotesMedicosService,
    private insumosMedicoService: InsumosMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private insumoDataService: InsumoDataService,
  ) { }

  ngOnInit(): void {

    this.events = [
      {
        title: "Evento 1",
        start: new Date().getTime(),
        description: "evento 1"
      },
      {
        title: "Evento 2",
        start: new Date(new Date().getTime() + 86400000),
        description: "evento 2"
      },
      {
        title: "Evento 3",
        start: new Date(new Date().getTime() + (86400000 * 2)),
        end: new Date(new Date().getTime() + (86400000 * 3)),
        description: "evento 2"
      },
    ]

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

  crearLote(insumoId: number) {
    this.insumoDataService.setInsumoId(insumoId);
    this.router.navigate(['/enfermeria/lotes-medicos/create']);
  }

  getInsumo() {
    const insumoId = +this.route.snapshot.paramMap.get('id')!;
    this.insumosMedicoService.getInsumo(insumoId)
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
              this.mensaje(response);
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

  showLote(id: number) {
    this.router.navigate(['/enfermeria/lotes-medicos', id]);
  }

  isExpiringSoon(fechaCaducidad: string): boolean {
    const hoy = new Date();
    const fechaCaducidadDate = new Date(fechaCaducidad);
    const diasRestantes = Math.ceil((fechaCaducidadDate.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
  
    return diasRestantes <= 7; // Cambia el número de días según tu criterio de caducidad próxima.
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
