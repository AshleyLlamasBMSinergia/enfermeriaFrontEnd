import { Component } from '@angular/core';
import { Incapacidades } from 'src/app/interfaces/incapacidades';
import { ImageService } from 'src/app/services/imagen.service';
import { IncapacidadesService } from '../incapacidades.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification.service';
import { catchError, map } from 'rxjs/operators';
import { ArchivoService } from 'src/app/services/archivo.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class IncapacidadesShowComponent {
  incapacidad!: Incapacidades | null;

  imageProfesional: any;
  imageEmpleado: any;

  estatus = '';

  formArchivo!: FormGroup;

  archivos: { nombre: string, tamano: string, base64: string }[] = [];

  mostrarFormularioArchivo = false;
  showInput = false;

  constructor(
    private imageService: ImageService,
    private incapacidadesService: IncapacidadesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private archivoService: ArchivoService,
  ) {
    this.formArchivo = this.formBuilder.group({
      incapacidad_id: [this.incapacidad?.id],
      archivos: [null],
      categoria: [null],
    });
  }

  ngOnInit() {
    this.getIncapacidad();
  }

  getIncapacidad() {
    const incapacidadId = +this.route.snapshot.paramMap.get('id')!;
    this.incapacidadesService.getIncapacidad(incapacidadId)
      .subscribe(incapacidad => {
        this.incapacidad = incapacidad;

        this.formArchivo.get('incapacidad_id')?.setValue(incapacidadId);

        if (incapacidad.profesional?.image) {
          this.obtenerImagen(incapacidad.profesional?.image.url).subscribe((imagen) => {
            this.imageProfesional = imagen;
          });
        }else{
          this.imageProfesional = '/assets/dist/img/user.png';
        }

        if (incapacidad.empleado?.image?.url) {
          this.obtenerImagen(incapacidad.empleado?.image?.url).subscribe((imagen) => {
            this.imageEmpleado = imagen;
          });
        }else{
          this.imageEmpleado = '/assets/dist/img/user.png';
        }

        if (incapacidad.revisiones.alta) {
          this.estatus = 'TERMINADO';
        } else {
          this.estatus = 'PENDIENTE';
        }        
      }
    );
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


  toggleCategoryInput() {
    this.showInput = !this.showInput;
    if (!this.showInput) {
      this.formArchivo.get('categoria')?.setValue(''); // Reinicia el valor al cambiar de vuelta a select
    }
  }

  checkForOther() {
    const categoriaValue = this.formArchivo.get('categoria')?.value;
    this.showInput = categoriaValue === 'Otro';
  }

  archivosSeleccionados(event: any) {
    const nuevosArchivos: FileList = event.target.files;
  
    for (let i = 0; i < nuevosArchivos.length; i++) {
      const archivo = nuevosArchivos[i];
      const archivoInfo = {
        nombre: archivo.name,
        tamano: this.formatBytes(archivo.size),
        base64: ''
      };
      this.archivos.push(archivoInfo);
    }
  
    this.convertirArchivos(nuevosArchivos).subscribe(base64Array => {
      base64Array.forEach((base64, index) => {
        this.archivos[this.archivos.length - nuevosArchivos.length + index].base64 = base64;
      });
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
      this.notificationService.error('Error al abrir el archivo: '+ error);
    }
  }

  storeArchivos() {
    if (this.archivos.length > 0) {
      const formData = this.formArchivo.value;
      formData.archivos = this.archivos.map(archivo => archivo.base64);
    
      this.incapacidadesService.storeArchivos(formData)
        .subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            this.notificationService.error(error.error.error);
          }
        );
    } else {
      this.notificationService.error('Faltan campos por llenar');
    }
  }
}
