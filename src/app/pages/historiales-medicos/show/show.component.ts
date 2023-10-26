import { Component, OnInit } from '@angular/core';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HistorialesMedicos } from '../historiales-medicos';
import { differenceInYears } from 'date-fns';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/imagen.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, ReplaySubject, forkJoin } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { ArchivoService } from 'src/app/services/archivo.service';
import { catchError, map } from 'rxjs/operators';

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

  fecha: any;

  formArchivo: FormGroup = this.formBuilder.group({
    historialMedico_id: [this.historialMedico?.id],
    tipo: [null],
    categoria: [null],
    descripcion: [null]
  });

  archivo: string | null = null;
  archivoUrl: string | null = null;
  // archivos: string[] = [];
  archivos: { nombre: string, tamano: string, base64: string }[] = [];

  mostrarFormularioArchivo = false;

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private notificationService: NotificationService,
    private archivoService: ArchivoService,
    private sanitizer: DomSanitizer,
    private router: Router,
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

  async buscarYAbrirPDF(historialMedicoId: number) {
    try {
      const archivoBlob = await this.historialesMedicosService.getPDF(historialMedicoId, this.fecha).toPromise();
  
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

  getHistorialMedico() {
    const historialMedicoId = +this.route.snapshot.paramMap.get('HistorialMedico')!;
    this.historialesMedicosService.getHistorialMedico(historialMedicoId)
      .subscribe(historialMedico => {
        // console.table(historialMedico)
        this.historialMedico = historialMedico;
        this.calcularEdad();
        this.terminado = true;

        this.formArchivo.get('historialMedico_id')?.setValue(historialMedico.id);

        if (historialMedico.pacientable?.image?.url) {
          
          this.obtenerImagen(historialMedico.pacientable?.image?.url).subscribe((imagen) => {
            this.image = imagen;
          });
        }else{
            this.image = '/assets/dist/img/user.png';
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
        return of('/assets/dist/img/user.png');
      })
    );
  }

  abrirFormularioArchivo(){
    this.mostrarFormularioArchivo = !this.mostrarFormularioArchivo;
  }

  archivoSeleccionado(event: any) {
    this.convertirArchivo(event.target.files[0]).subscribe(base64 => {
        this.archivo = base64;
    });
  }

  // archivosSeleccionados(event: any) {
  //   const archivosSeleccionados = event.target.files;
  //   for (let i = 0; i < archivosSeleccionados.length; i++) {
  //   }
  //   this.convertirArchivos(archivosSeleccionados).subscribe(base64Array => {
  //     this.archivos = base64Array;
  //   });
  // }

  archivosSeleccionados(event: any) {
    const archivosSeleccionados = event.target.files;
  
    for (let i = 0; i < archivosSeleccionados.length; i++) {
      const archivo = archivosSeleccionados[i];
      const archivoInfo = {
        nombre: archivo.name,
        tamano: this.formatBytes(archivo.size),
        base64: ''
      };
      this.archivos.push(archivoInfo);
    }
  
    this.convertirArchivos(archivosSeleccionados).subscribe(base64Array => {
      this.archivos = this.archivos.map((archivo, index) => ({
        ...archivo,
        base64: base64Array[index]
      }));
    });
  }

  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  eliminarArchivo(index: number) {
    this.archivos.splice(index, 1); // Elimina el archivo en el índice especificado
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
        this.notificationService.error('El archivo está vacío o no se pudo obtener');
      }
    } catch (error) {
      console.error('Error al abrir el archivo:', error);
      this.notificationService.error('Error al abrir el archivo: '+error);
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
            this.notificationService.error(error.error);
          }
      );
    }else{
      this.notificationService.error('Faltan campos por llenar');
    }
  }

  storeArchivos() {
    if (this.archivos.length > 0) {
      const formData = this.formArchivo.value;
      formData.archivos = this.archivos.map(archivo => archivo.base64);
    
      this.historialesMedicosService.storeArchivos(formData)
        .subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            this.notificationService.error(error.error.error);
            console.log(error);
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
