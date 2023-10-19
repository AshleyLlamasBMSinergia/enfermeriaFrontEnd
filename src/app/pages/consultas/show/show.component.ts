import { Component } from '@angular/core';
import { ConsultasService } from '../consultas.service';
import { ActivatedRoute } from '@angular/router';
import { Consultas } from 'src/app/interfaces/consultas';
import { ImageService } from 'src/app/services/imagen.service';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ConsultasShowComponent {
  consulta!: Consultas | null;
  terminado: boolean = false;
  imageProfesional: any;
  imagePaciente: any;

  constructor(
    private imageService: ImageService,
    private consultasService: ConsultasService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.getConsulta();
  }

  getConsulta() {
    const consultaId = +this.route.snapshot.paramMap.get('Consulta')!;
    this.consultasService.getConsulta(consultaId)
      .subscribe(consulta => {
        this.consulta = consulta;
        this.terminado = true;

        if (consulta.profesional?.image.url) {
          this.obtenerImagen(consulta.profesional?.image.url).subscribe((imagen) => {
            this.imageProfesional = imagen;
          });
        }else{
          this.imageProfesional = '/assets/dist/img/user.png';
        }

        if (consulta.pacientable?.image?.url) {
          this.obtenerImagen(consulta.pacientable?.image?.url).subscribe((imagen) => {
            this.imagePaciente = imagen;
          });
        }else{
          this.imagePaciente = '/assets/dist/img/user.png';
        }
      }
    );
  }

  async abrirReceta(consultaId: any) {
    try {
      const archivoBlob = await this.consultasService.getReceta(consultaId).toPromise();
  
      if (archivoBlob) {
        const urlBlob = URL.createObjectURL(archivoBlob);
        window.open(urlBlob, '_blank');
      } else {
        this.notificationService.error('El archivo está vacío o no se pudo obtener');
      }
    } catch (error) {
      console.error('Error al abrir el archivo:', error);
      this.notificationService.error('Error al abrir el archivo: '+error);
    }
  }

  obtenerImagen(url: string): Observable<any> {
    return this.imageService.getImagen(url).pipe(
      map((response: any) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }),
      catchError((error) => {
        return of('/assets/dist/img/user.png');
      })
    );
  }

  toRoman(num: number | undefined): string {
    const romanNumerals = ["I", "II", "III", "IV", "V"];
    if (num !== undefined && num >= 1 && num <= 5) {
      return romanNumerals[num - 1];
    } else {
      return "-";
    }
  }
}
