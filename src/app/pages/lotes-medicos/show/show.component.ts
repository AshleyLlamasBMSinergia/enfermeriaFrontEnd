import { Component } from '@angular/core';
import { Lotes } from 'src/app/interfaces/lotes';
import { LotesMedicosService } from '../lotes-medicos.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, ReplaySubject, forkJoin } from 'rxjs';
import { ImageService } from 'src/app/services/imagen.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class LotesMedicosShowComponent {
  lote?: Lotes;

  image: any;

  constructor(
    private lotesMedicosService: LotesMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    const loteId = +this.route.snapshot.paramMap.get('id')!;
    this.lotesMedicosService.getLote(loteId).subscribe(lote => {
      this.lote = lote;

      if (lote.insumo.image?.url) {
        this.obtenerImagen(lote.insumo?.image?.url).subscribe((imagen) => {
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
        return of('/assets/dist/img/user.jpg');
      })
    );
  }
}
