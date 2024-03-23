import { Component } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Movimientos } from 'src/app/interfaces/movimientos';
import { ImageService } from 'src/app/services/imagen.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { catchError, map } from 'rxjs/operators';
import { Observable, ReplaySubject, forkJoin, of } from 'rxjs';
import { MovimientoMovs } from 'src/app/interfaces/movimientoMovs';
import { NotificationService } from 'src/app/services/notification.service';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ArchivoService } from 'src/app/services/archivo.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class MovimientosShowComponent {
  movimiento!: Movimientos | null;

  formArchivo!: FormGroup;
  gruposMovimientos: { [key: string]: MovimientoMovs[] } = {};

  imageProfesional: any;

  movimientosPorCategoria:any;

  archivos: { nombre: string, tamano: string, base64: string }[] = [];

  mostrarFormularioArchivo = false;
  showInput = false;

  mensajesDeError: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    movimiento_id: 'movimiento',
    archivos: 'archivos',
    categoria: 'categoría',
  };

  constructor(
    private imageService: ImageService,
    private movimientosService: MovimientosService,
    private notificationService: NotificationService,
    private archivoService: ArchivoService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private formBuilder: FormBuilder,
  ) {
    this.formArchivo = this.formBuilder.group({
      movimiento_id: [this.movimiento?.id, [Validators.required]],
      archivos: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.getMovimiento();
  }

  getMovimiento() {
    const movimientoId = +this.route.snapshot.paramMap.get('movimientoId')!;
    this.movimientosService.getMovimiento(movimientoId)
      .subscribe(movimiento => {
        this.movimiento = movimiento;

        this.formArchivo.get('movimiento_id')?.setValue(movimientoId);

        if (movimiento.profesional) {
          this.obtenerImagen(movimiento.profesional?.image?.url).subscribe((imagen) => {
            this.imageProfesional = imagen;
          });
        }else{
          this.imageProfesional = '/assets/dist/img/user.png';
        }

        movimiento.movimiento_movs.forEach(mov => {
          const nombreInsumo = mov.lote.insumo.nombre;
          if (!this.gruposMovimientos[nombreInsumo]) {
            this.gruposMovimientos[nombreInsumo] = [];
          }
          this.gruposMovimientos[nombreInsumo].push(mov);
        });
      }
    );
  }

  sumarUnidades(movimientos: MovimientoMovs[]): number {
    let total = 0;

    for (const mov of movimientos) {
      total += Number(mov.unidades);
    }

    return total;
  }

  sumarPrecios(movimientos: MovimientoMovs[]): number {

    let total = 0;
    for (const mov of movimientos) {
      total += Number(mov.precio);
    }

    return total;
  }
  

  abrirFormularioArchivo(){
    this.mostrarFormularioArchivo = !this.mostrarFormularioArchivo;
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

  resetCategoria() {
    if (this.formArchivo.get('categoria')?.value === 'Otro') {
      this.formArchivo.get('categoria')?.setValue('');
    }
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

    if (this.archivos.length <= 0) {
      this.notificationService.info('Ups! :(', 'Faltan campos por llenar');
    }

    if(this.formArchivo.invalid) {
      const camposNoValidos = Object.keys(this.formArchivo.controls).filter(controlName => this.formArchivo.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        this.formArchivo.get(controlName)!;
        const control = this.formArchivo.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;
    }else{
      const formData = this.formArchivo.value;
      formData.archivos = this.archivos.map(archivo => archivo.base64);
    
      this.movimientosService.storeArchivos(formData)
        .subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            this.notificationService.error(error.error.error);
          }
        );
    }
  }

  obtenerMensajesDeError(control: AbstractControl): string[] {
    const mensajes: string[] = [];

    if (control.errors) {
      for (const errorKey in control.errors) {
        switch (errorKey) {
          case 'required':
            mensajes.push(' es obligatorio');
            break;
          case 'maxlength':
            mensajes.push(' excede el límite de longitud permitido');
            break;
          case 'email':
            mensajes.push(' no es valido');
            break;
          case 'diasNoNegativos':
            mensajes.push('no puede estar en negativo');
            break;
          default:
            mensajes.push(`Error: ${errorKey}`);
            break;
        }
      }
    }

    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        mensajes.push(...this.obtenerMensajesDeError(control.get(key)!));
      });
    }

    return mensajes;
  }
}
