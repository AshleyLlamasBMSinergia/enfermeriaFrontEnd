
import { Component, OnInit } from '@angular/core';
import { ImageService } from 'src/app/services/imagen.service';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationService } from 'src/app/services/notification.service';
import { catchError, map } from 'rxjs/operators';
import { ArchivoService } from 'src/app/services/archivo.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, forkJoin, of } from 'rxjs';
import { AccidentesService } from 'src/app/services/accidentes.service';
import { Casos } from 'src/app/interfaces/casos';
import { CasosService } from 'src/app/services/casos.service';
import { Incapacidades } from 'src/app/interfaces/incapacidades';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listWeekPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class CasosShowComponent {
  caso?: Casos;

  fechaFinal: any;
  totalDias: number = 0;

  imageEmpleado: any;
  formArchivo!: FormGroup;
  archivos: { nombre: string, tamano: string, base64: string }[] = [];
  archivosPendientes:any = [];

  incapacidadSeleccionada?: Incapacidades;

  mostrarFormularioArchivo = false;
  showInput = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  mostrarFormularioAccidente = false;

  events?: any[] = [];
  relatedEvents: any[] = [];
  selectedDate: Date = new Date();
  selectedEvent: any;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin, listWeekPlugin],
    locale: 'es',
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista',
    },
    weekends: true,
    editable: false,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    events: [],
  };

  mensajesDeError: string[] = [];
  nombresDescriptivos: { [key: string]: string } = {
    caso_id: 'caso',
    archivos: 'archivos',
    categoria: 'categoría',
  };

  constructor(
    private imageService: ImageService,
    private casosService: CasosService,
    private accidentesService: AccidentesService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private archivoService: ArchivoService,
    private datePipe: DatePipe,
  ) {
    this.formArchivo = this.formBuilder.group({
      caso_id: [null],
      archivos: [null, [Validators.required]],
      categoria: [null, [Validators.required]],
      archivable_id: [null],
      archivable_type: ["App\\Models\\Caso", [Validators.required]],
    });
  }

  ngOnInit() {
    this.getCaso();
    this.calendarioIncidencias();
  }

  calendarioIncidencias(){
    
  }

  getCaso() {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.casosService.getCaso(id)
      .subscribe(caso => {
        this.caso = caso;

        this.formArchivo.get('caso_id')?.setValue(id);
        this.calcularTotalDias();

        if (caso.incapacidades.length > 0) {
          let incapacidad = caso.incapacidades[0];
          this.incapacidadSeleccionada = incapacidad;
          this.fechaFinal = this.obtenerFechaFinal(incapacidad!.fechaEfectiva, incapacidad!.dias);

          const events: any[] = [];
          
          caso.incapacidades.forEach(incapacidad => {
            const nomIncidencias = incapacidad.nom_incidencias;
            const primeraFecha = this.datePipe.transform(nomIncidencias[0].FechaEfectiva, 'yyyy-MM-dd');
            let ultimaFecha = this.datePipe.transform(nomIncidencias[nomIncidencias.length - 1].FechaEfectiva, 'yyyy-MM-dd');
            
            const ultimaFechaObj = new Date(nomIncidencias[nomIncidencias.length - 1].FechaEfectiva);
            ultimaFechaObj.setDate(ultimaFechaObj.getDate() + 1);
            ultimaFecha = this.datePipe.transform(ultimaFechaObj, 'yyyy-MM-dd');
            
            const color = '#' + Math.floor(Math.random()*16777215).toString(16);

            events.push({
              title: `${incapacidad.folio}`,
              start: primeraFecha,
              end: ultimaFecha,
              color: color,
              calendario: incapacidad.nom_incidencias
            });
          });
        
          this.events = events;
          this.calendarOptions.events = events;
        }

        if (caso.empleado?.image) {
          this.obtenerImagen(caso.empleado?.image.url).subscribe((imagen) => {
            this.imageEmpleado = imagen;
          });
        }else{
          this.imageEmpleado = '/assets/dist/img/user.png';
        }

        this.calcularArchivosPendientes(caso);
      }
    );
  }

  calcularArchivosPendientes(caso: any){
    let archivosPendientes: string[] = [];
    switch(caso.incapacidades[0].TipoIncidencia){
      case 'RT':
        archivosPendientes = [
          'Inicial probable riesgo',
          'Subsecuente probable riesgo',
          'Riesgo de trabajo ST7',
          'Riesgo de trabajo Calificado',
          'Alta médica ST2',
          'Recaída ST8',
          'Caso parcial permanente'
        ];
      break;
    }
    
    const archivosPorCategoria: { [categoria: string]: any[] } = caso.archivosPorCategoria;
    
    // Filtrar las categorías de archivos pendientes
    const categoriasPendientes: string[] = archivosPendientes.filter(categoria => {
      // Verificar si la categoría existe en los archivos por categoría del caso
      return !archivosPorCategoria.hasOwnProperty(categoria);
    });

    this.archivosPendientes = categoriasPendientes;
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

  calcularTotalDias(): void {
    if (this.caso?.incapacidades) {
      this.totalDias = this.caso.incapacidades.reduce((total, incapacidad) => total + incapacidad.dias, 0);
    }
  }

  obtenerFechaFinal(fechaInicial: any, dias: number): Date {
    const fechaInicialDate = new Date(fechaInicial.replace(/-/g, '/'));

    const fechaFinal = new Date(fechaInicialDate.getTime() + dias * 24 * 60 * 60 * 1000);
    return fechaFinal;
  }

  mostrarContenido(incapacidad: Incapacidades) {
    this.fechaFinal = this.obtenerFechaFinal(incapacidad!.fechaEfectiva, incapacidad!.dias);
    this.incapacidadSeleccionada = incapacidad;
  }

  abrirFormularioArchivo(){
    this.mostrarFormularioArchivo = !this.mostrarFormularioArchivo;
  }

  abrirFormularioAccidente(){
    this.mostrarFormularioAccidente = !this.mostrarFormularioAccidente;
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
        this.notificationService.info( 'ERROR', 'El archivo está vacío o no se pudo obtener');
      }
    } catch (error) {
      this.notificationService.info('ERROR','Error al abrir el archivo: '+ error);
    }
  }

  storeArchivos() {
    
    if (this.archivos.length <= 0) {
      this.notificationService.info('Ups! :(', 'Faltan campos por llenar');
    }

    // this.formArchivo.get('caso_id')?.setValue(this.caso?.id);
    this.formArchivo.get('archivable_id')?.setValue(this.caso?.id);

    if (this.formArchivo.invalid) {
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
    
      this.archivoService.store(formData)
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

  async destroyAccidente(){
    const confirmacion = await this.notificationService.confirmarEliminacion('registro de accidente');
    
    if (confirmacion) {
      this.accidentesService.destroyAccidente(this.caso!.accidente!.id).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al eliminar la investigación de accidente:', error);
          this.notificationService.error('Hubo un error al eliminar el historial médico');
        }
      );
    }
  }

  async exportarIncapacidad(){
    const confirmacion = await this.notificationService.confirmar('¿Estás seguro de exportar las incidencias de esta incapacidad a la nómina?', '¡No pondrás revertir esto!');
    
    if (confirmacion) {
      this.casosService.importarIncidenciasRH(this.incapacidadSeleccionada!.id).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al importar las incidencias:', error);
          this.notificationService.error('Hubo un error al exportar las incidencias');
        }
      );
    }
  }
}
