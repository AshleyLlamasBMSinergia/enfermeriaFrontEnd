import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';
import { NotificationService } from 'src/app/services/notification.service';
import { ImageService } from 'src/app/services/imagen.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from 'src/app/services/empleados.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HistorialesMedicosService } from 'src/app/pages/historiales-medicos/historiales-medicos.service';
import { Casos } from 'src/app/interfaces/casos';
import { IncapacidadesService } from 'src/app/services/incapacidades.service';

@Component({
  selector: 'app-incapacidades-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {
  @Input() caso!: Casos;

  formIncapacitacion: FormGroup;

  imageEmpleado: any;

  opcionesEmpleados: any[] = [];

  empleado?: any;
  historialMedico?: HistorialesMedicos;

  zonasAfectadas: any[] = [];

  tipoIncidencias: any[] = [];
  controlIncapacidades: any[] = [];
  secuelas: any[] = [];
  tipoRiesgos: any[] = [];
  tipoPermisos: any[] = [];

  public Editor = ClassicEditor;
  mensajesDeError: string[] = [];

  private isUpdating = false;

  consecuentesOpciones: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    diagnostico: 'diagnóstico',
    observaciones: 'observaciones',
    empleado: 'empleado',
    profesional_id: 'profesional',
    zonasAfectadas: 'zonas afectadas',
    Dias: 'días que aplica',
    TipoIncidencia: 'tipo de incidencia',
    FechaEfectiva: 'fecha efectiva',
    Folio: 'folio',
    TipoRiesgo: 'tipo de riesgo',
    Secuela: 'secuela',
    TipoPermiso: 'tipo de permiso',
    ControlIncapacidad: 'control de incapacidad',
    causa: 'causa'
  };

  public editorConfig = {
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        '|',
        'bulletedList',
        'numberedList',
        '|',
        'undo',
        'redo',
      ]
    },
    image: {
      toolbar: ['imageTextAlternative']
    }
  };

  dias = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private imageService: ImageService,
    private empleadosService: EmpleadosService,
    private incapacidadesService: IncapacidadesService,
    private historialesMedicosService: HistorialesMedicosService,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService
  ) {
    this.formIncapacitacion = this.formBuilder.group({
      TipoIncidencia: [null, [Validators.required]],
      FechaEfectiva: [null, [Validators.required]],
      Folio: [null, [Validators.required]],
      Dias: [null, [Validators.required]],
      TipoRiesgo: [null],
      Secuela: [null],
      TipoPermiso: [null],
      ControlIncapacidad: [null],
      causa: [null],
      diagnostico: [null, [Validators.required]],
      observaciones: [null],
      empleado_id: [null, [Validators.required]],
      caso_id: [null],
      zonasAfectadas: [[]],
    });
  }

  ngOnInit(): void {
    
    this.inicializarControles();
    this.getZonasAfectadas();

    this.getTipoIncidencias();
    this.getTipoRiesgos();
    this.getSecuelas();
    this.getControlIncapacidades();
    this.getTipoPermisos();

    if(this.caso){
      this.cargarDatosEmpleado(this.caso.empleado_id);
    }else{
      this.cargarOpcionesEmpleados();
    }
  }

  getTipoIncidencias(){
    this.incapacidadesService.getTipoIncidencias().subscribe(
      (tipoIncidencias) => {
        this.tipoIncidencias = tipoIncidencias;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTipoRiesgos(){
    this.incapacidadesService.getTipoRiesgos().subscribe(
      (tipoRiesgos) => {
        this.tipoRiesgos = tipoRiesgos;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSecuelas(){
    this.incapacidadesService.getSecuelas().subscribe(
      (secuelas) => {
        this.secuelas = secuelas;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getControlIncapacidades(){
    this.incapacidadesService.getControlIncapacidades().subscribe(
      (controlIncapacidad) => {
        this.controlIncapacidades = controlIncapacidad;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getTipoPermisos(){
    this.incapacidadesService.getTipoPermisos().subscribe(
      (tipoPermisos) => {
        this.tipoPermisos = tipoPermisos;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getZonasAfectadas(){
    this.incapacidadesService.getZonasAfectadas().subscribe(
      (reactivos) => {
        this.zonasAfectadas = reactivos.map((zonas: any) => ({
          id: zonas.id,
          text: zonas.zona,
        }));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cambiarValidaciones(tipoIncidencia: string) {

    if(tipoIncidencia === 'RT'){
      this.formIncapacitacion.get('TipoRiesgo')!.setValidators([Validators.required]);
      this.formIncapacitacion.get('Secuela')!.setValidators([Validators.required]);
      this.formIncapacitacion.get('ControlIncapacidad')!.setValidators([Validators.required]);
      this.formIncapacitacion.get('causa')!.setValidators([Validators.required]);
      this.formIncapacitacion.get('zonasAfectadas')!.setValidators([Validators.required]);
    }else{
      this.formIncapacitacion.get('TipoRiesgo')!.clearValidators();
      this.formIncapacitacion.get('Secuela')!.clearValidators();
      this.formIncapacitacion.get('ControlIncapacidad')!.clearValidators();
      this.formIncapacitacion.get('causa')!.clearValidators();
      this.formIncapacitacion.get('zonasAfectadas')!.clearValidators();
    }

    if(tipoIncidencia === 'PP' || tipoIncidencia === 'PV'){
      this.formIncapacitacion.get('TipoPermiso')!.setValidators([Validators.required]);
    }else{
      this.formIncapacitacion.get('TipoPermiso')!.clearValidators();
    }
  
    // Actualiza las validaciones
    this.formIncapacitacion.get('TipoRiesgo')!.updateValueAndValidity();
    this.formIncapacitacion.get('Secuela')!.updateValueAndValidity();
    this.formIncapacitacion.get('causa')!.updateValueAndValidity();
    this.formIncapacitacion.get('ControlIncapacidad')!.updateValueAndValidity();
    this.formIncapacitacion.get('zonasAfectadas')!.updateValueAndValidity();
    this.formIncapacitacion.get('TipoPermiso')!.updateValueAndValidity();
  }

  cargarOpcionesEmpleados() {
    this.empleadosService.getEmpleados().subscribe(
      (empleados) => {
        this.opcionesEmpleados = empleados.map((empleado: any) => ({
          id: empleado.id,
          text: empleado.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }

  cargarDatosEmpleado($id: number) {
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.formIncapacitacion.get('empleado_id')?.setValue($id);
      this.historialesMedicosService.getHistorialMedicoPorPaciente('empleado', $id)
        .subscribe(historialMedico => {
          this.llenarFormularioEnAutomatico(historialMedico);
        });
      this.isUpdating = false;
    } else {
      return;
    }
  }

  private inicializarControles() {
    this.formIncapacitacion.get('tipoIncapacitacion')?.valueChanges.subscribe((tipoIncapacitacion) => {
      this.actualizarConsecuentesOpciones(tipoIncapacitacion);
    });
  }
  
  private actualizarConsecuentesOpciones(tipoIncapacitacion: string) {
    const consecuenteControl = this.formIncapacitacion.get('consecuente');
    consecuenteControl?.reset();
  
    const opciones = this.obtenerOpcionesConsecuenteSegunTipo(tipoIncapacitacion);
    consecuenteControl?.setValidators([Validators.required]);
    consecuenteControl?.setValue(null);
    consecuenteControl?.updateValueAndValidity(); 
  
    this.formIncapacitacion.updateValueAndValidity();
    this.consecuentesOpciones = this.obtenerOpcionesConsecuenteSegunTipo(tipoIncapacitacion);
  }
  
  private obtenerOpcionesConsecuenteSegunTipo(tipoIncapacitacion: string): string[] {
    switch (tipoIncapacitacion) {
      case 'Riesgo de trabajo ST7':
      case 'Enfermedad profesional ST9':
        return [
          'Incapacitacion temporal',
          'Incapacitacion permanente parcial provisional',
          'Incapacitacion permanente parcial definitiva',
          'Incapacitacion permanente total provisional',
          'Incapacitacion permanente total definitiva',
          'Recaída',
          'Defunción'
        ];
  
      case 'Enfermedad general':
        return ['Incapacitacion temporal', 'Invalidez', 'Muerte'];
      case '':
        return [];
      default:
        return ['Incapacitacion temporal'];
    }
  }
  

  llenarFormularioEnAutomatico(historialMedico: any) {
    this.empleado = historialMedico.pacientable;
    this.historialMedico = historialMedico;

    if (historialMedico?.pacientable?.image) {
      this.obtenerImagen(historialMedico?.pacientable?.image?.url).subscribe((imagen) => {
        this.imageEmpleado = imagen;
      });
    } else {
      this.imageEmpleado = '/assets/dist/img/user.png';
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

  obtenerDias(){
    this.dias = this.calcularDias(
      this.formIncapacitacion.get('fechaInicial')?.value,
      this.formIncapacitacion.get('fechaTermino')?.value
    );
  }

  calcularDias(fechaInicial: Date, fechaTermino: Date){
    if (fechaInicial && fechaTermino) {
      const fechaInicialObj = new Date(fechaInicial);
      const fechaTerminoObj = new Date(fechaTermino);
  
      const diferenciaEnMilisegundos = fechaTerminoObj.getTime() - fechaInicialObj.getTime();
  
      return  Math.floor(diferenciaEnMilisegundos / (1000 * 60 * 60 * 24));
    }else{
      return 0;
    }
  }

  guardar() {
    this.cambiarValidaciones(this.formIncapacitacion.get('TipoIncidencia')!.value);

    this.formIncapacitacion.get('dias')?.setValue(
      this.calcularDias(
        this.formIncapacitacion.get('fechaInicial')?.value,
        this.formIncapacitacion.get('fechaTermino')?.value
      )
    );

    if (this.formIncapacitacion.invalid) {
      const camposNoValidos = Object.keys(this.formIncapacitacion.controls).filter(controlName => this.formIncapacitacion.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        this.formIncapacitacion.get(controlName)!;
        const control = this.formIncapacitacion.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {

      if(this.caso){
        this.formIncapacitacion.get('caso_id')?.setValue(this.caso.id);
        this.formIncapacitacion.get('empleado_id')?.setValue(this.caso.empleado_id);
      }

      const incapacitacion = this.formIncapacitacion.value;

      this.incapacidadesService.storeIncapacidad(incapacitacion).subscribe(
        (response: any) => {
          this.router.navigate(['/enfermeria/casos/', response.id]);
          this.notificationService.mensaje(response);
        },
        (error: any) => {
          console.log(error);
          this.notificationService.error(error);
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
