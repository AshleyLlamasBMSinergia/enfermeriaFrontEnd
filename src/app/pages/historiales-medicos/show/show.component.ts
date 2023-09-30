import { Component, OnInit } from '@angular/core';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { ActivatedRoute } from '@angular/router';
import { HistorialesMedicos } from '../historiales-medicos';
import { differenceInYears } from 'date-fns';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/imagen.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, ReplaySubject, forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ArchivoService } from 'src/app/services/archivo.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class HistorialesMedicosShowComponent implements OnInit {
  historialMedico!: HistorialesMedicos;
  edad: number | null = null;
  terminado: boolean = false;

  image: any;

  formArchivo: FormGroup = this.formBuilder.group({
    historialMedico_id: [this.historialMedico?.id],
    tipo: [null],
    categoria: [null],
    descripcion: [null]
  });

  archivo: string | null = null;
  archivoUrl: string | null = null;
  archivos: string[] = [];

  mostrarFormularioArchivo = false;

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private archivoService: ArchivoService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.getHistorialMedico();
  }

  calcularEdad() {
    if (this.historialMedico!.pacientable?.fechaNacimiento) {
      const fechaNacimiento = new Date(this.historialMedico!.pacientable?.fechaNacimiento);
      this.edad = differenceInYears(new Date(), fechaNacimiento);
    }
  }

  getHistorialMedico() {
    const historialMedicoId = +this.route.snapshot.paramMap.get('HistorialMedico')!;
    this.historialesMedicosService.getHistorialMedico(historialMedicoId)
      .subscribe(historialMedico => {
        // console.table(historialMedico)
        this.historialMedico = historialMedico;
        this.calcularEdad();
        this.terminado = true;

        this.formArchivo.get('historialMedico_id')?.setValue(historialMedico.id);

        const imageUrl = historialMedico.pacientable?.image?.url;

        if (imageUrl) {
          this.imageService.getImagen(imageUrl).subscribe(
            (response: any) => {
              const blob = new Blob([response], { type: 'image/jpeg' });
              this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            },
            (error) => {
              console.error('Error al obtener la imagen', error);
            }
          );
        } else {
          console.error('La URL de la imagen es indefinida');
        }
      });
  }

  abrirFormularioArchivo(){
    this.mostrarFormularioArchivo = !this.mostrarFormularioArchivo;
  }

  archivoSeleccionado(event: any) {
    this.convertirArchivo(event.target.files[0]).subscribe(base64 => {
        this.archivo = base64;
    });
  }

  archivosSeleccionados(event: any) {
    const archivosSeleccionados = event.target.files;
    console.log(`Número de archivos seleccionados: ${archivosSeleccionados.length}`);
    for (let i = 0; i < archivosSeleccionados.length; i++) {
    }
    this.convertirArchivos(archivosSeleccionados).subscribe(base64Array => {
      this.archivos = base64Array;
    });
  }

  convertirArchivo(file: File): Observable<string> {
    const result = new ReplaySubject<string>(1);
    const reader = new FileReader();
  
    reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
            result.next(btoa(event.target.result));
        }
    };
  
    reader.readAsBinaryString(file);
    return result;
  }

  convertirArchivos(files: FileList): Observable<string[]> {
    const observables: Observable<string>[] = [];
  
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const result = new ReplaySubject<string>(1);
      const reader = new FileReader();
  
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          result.next(btoa(event.target.result));
          result.complete();
        }
      };
  
      reader.readAsBinaryString(file);
      observables.push(result);
    }
  
    return forkJoin(observables);
  }

  async abrirArchivo(url: string) {
    try {
      const archivoBlob = await this.archivoService.getArchivo(url).toPromise();
  
      if (archivoBlob) {
        const urlBlob = URL.createObjectURL(archivoBlob);
        window.open(urlBlob, '_blank');
      } else {
        console.error('El archivo está vacío o no se pudo obtener.');
      }
    } catch (error) {
      console.error('Error al abrir el archivo:', error);
    }
  }

  storeArchivo() {
    const formData = this.formArchivo.value;
  
    if (this.archivo) {
      formData.archivo = this.archivo;

      this.historialesMedicosService.storeArchivo(formData)
        .subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            console.error('Error al subir el examen');
          }
      );
    }else{
      this.notificationService.error('Faltan campos por llenar');
    }
  }

  storeArchivos() {
    const formData = this.formArchivo.value;

    if (this.archivos.length > 0) {
      formData.archivos = this.archivos;
  
      this.historialesMedicosService.storeArchivos(formData)
        .subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            console.error('Error al subir los exámenes');
          }
        );
    } else {
      this.notificationService.error('Faltan campos por llenar');
    }
  }
  
  async destroyExamen(ExamenId: number) {
    const confirmacion = await this.notificationService.confirmarEliminacion('examen');

    if (confirmacion) {
      this.historialesMedicosService.destroyExamen(ExamenId).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al eliminar el examen:', error);
          this.notificationService.error('Hubo un error al eliminar el examen');
        }
      );
    }
  }
}
