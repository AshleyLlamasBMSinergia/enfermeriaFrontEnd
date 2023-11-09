import { Component } from '@angular/core';
import { Lotes } from 'src/app/interfaces/lotes';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { LotesMedicosService } from 'src/app/pages/lotes-medicos/lotes-medicos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class LotesShowComponent {
  lote?: Lotes | null;

  paginaActual = 1;
  elementosPorPagina = 10;

  image: any;
  caduco: boolean = false;

  constructor(
    private lotesMedicosService: LotesMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  )
  {}

  ngOnInit(): void {
    this.getLote();
  }

  esFechaCaducidadHoyOPosterior(fechaCaducidad: Date | undefined): boolean {
    if (!fechaCaducidad) {
      return false;
    }
  
    const fechaCaducidadDate = new Date(fechaCaducidad);
    const hoy = new Date();
    return fechaCaducidadDate <= hoy;
  }
  
  getLote() {
    this.route.params.subscribe(params => {
      const inventarioId = params['inventarioId']; // Obtén el ID del inventario
      const loteId = params['loteId']; // Obtén el ID del insumo

      this.lotesMedicosService.getLotePorInventario(inventarioId, loteId)
        .subscribe(lote => {
          
          this.lote = lote;

          this.caduco = this.esFechaCaducidadHoyOPosterior(lote?.fechaCaducidad);

          if (lote.insumo.image?.url) {
            this.obtenerImagen(lote.insumo.image?.url).subscribe((imagen) => {
              this.image = imagen;
            });
          }else{
            this.image = '/assets/dist/img/image.jpg';
          }
      });
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
}
