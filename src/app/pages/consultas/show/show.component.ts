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

  imc: number = 0;
  imcSignificado: string = '';
  imcColor: string = '';

  color: string = '';
  triajeClasificacion: string = '';

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

        this.calcularIMC(consulta?.peso, consulta?.talla);
        this.convertirANumeroRomano(consulta?.triajeClasificacion);

        if (consulta.profesional?.image) {
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
    this.terminado = true;
  }

  calcularIMC(peso: any, talla: any){
    
    if (peso && talla) {
      this.imc = peso / (talla * talla);

      if(this.imc < 18.5){
        this.imcSignificado = 'Bajo peso';
        this.imcColor = '#DF6060';
      }
  
      if(this.imc > 18.5 && this.imc < 24.9){
        this.imcSignificado = 'Peso normal';
        this.imcColor = '#26DA44';
      }
  
      if(this.imc > 24.9 && this.imc < 26.9){
        this.imcSignificado = 'Sobre peso I grado';
        this.imcColor = '#93DA26';
      }
  
      if(this.imc > 26.9 && this.imc <  29.9){
        this.imcSignificado = 'Sobre peso II grado';
        this.imcColor = '#C4DA26';
      }
  
      if(this.imc > 29.9 && this.imc <  34.9){
        this.imcSignificado = 'Obesidad I grado';
        this.imcColor = '#DABC26';
      }
  
      if(this.imc > 34.9 && this.imc <  39.9){
        this.imcSignificado = 'Obesidad I grado';
        this.imcColor = '#F39207';
      }
  
      if(this.imc > 39.9){
        this.imcSignificado = 'Obesidad morbida';
        this.imcColor = '#F34007';
      }
    }
  }

 convertirANumeroRomano(numero: any){
    switch (numero) {
      case '1': this.color = '#dd4b39'; this.triajeClasificacion = 'I'; break;
      case '2': this.color = '#FF851B'; this.triajeClasificacion = 'II'; break;
      case '3': this.color = '#f39c12'; this.triajeClasificacion = 'III'; break;
      case '4': this.color = '#198754'; this.triajeClasificacion = 'IV'; break;
      case '5': this.color = '#0d6efd'; this.triajeClasificacion = 'V'; break;
      default: this.triajeClasificacion = '-';
    }
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
