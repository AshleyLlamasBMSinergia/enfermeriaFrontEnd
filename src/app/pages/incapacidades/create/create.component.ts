import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicosService } from '../../historiales-medicos/historiales-medicos.service';
import { IncapacidadesService } from '../incapacidades.service';
import { ImageService } from 'src/app/services/imagen.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from 'src/app/services/empleados.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class IncapacidadesCreateComponent {
  formIncapacidad: FormGroup;

  profesional: any;
  imageProfesional: any;
  imageEmpleado: any;

  opcionesEmpleados: any[] = [];

  empleado?: any;
  historialMedico?: HistorialesMedicos;

  zonasAfectadas: any[] = [];

  public Editor = ClassicEditor;
  mensajesDeError: string[] = [];

  private isUpdating = false;

  consecuentesOpciones: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    tipo: 'tipo de incapacidad',
    consecuente: 'consecuente de la incapacidad',
    fechaInicial: 'fecha inicial',
    fechaTermino: 'fecha de termino',
    fechaProxRevision: 'fecha de la proxima revisión',
    calificacionAccidente: 'calificación del accidente',
    causa: 'causa',
    diagnostico: 'diagnóstico',
    observaciones: 'observaciones',
    empleado_id: 'empleado',
    profesional_id: 'profesional',
    zonasAfectadas: 'zonas afectadas',
    dias: 'días'
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
    this.formIncapacidad = this.formBuilder.group({
      tipo: ['', [Validators.required]],
      consecuente: ['', [Validators.required]],
      fechaInicial: [null, Validators.required],
      fechaTermino: [null],
      calificacionAccidente: [null, [Validators.required]],
      dias: [null, [this.diasNoNegativos()]],
      causa: [null],
      diagnostico: [null],
      observaciones: [null],
      empleado_id: [null, [Validators.required]],
      profesional_id: [null, [Validators.required]],
      zonasAfectadas: [[]]
    });
  }

  diasNoNegativos(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dias = control.value;
  
      // Verificar si días es un número y no es negativo
      if (isNaN(dias) || dias < 0) {
        return { 'diasNoNegativos': true };
      }
  
      return null;  // La validación pasa
    };
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(
      (user: any) => {
        this.profesional = user[0];
        this.formIncapacidad.get('profesional_id')?.setValue(user[0].id);
        if (user[0].useable.image) {
          this.obtenerImagen(user[0].useable.image.url).subscribe((imagen) => {
            this.imageProfesional = imagen;
          });
        } else {
          this.imageProfesional = '/assets/dist/img/user.png';
        }
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

    this.cargarOpcionesEmpleados();
    this.inicializarControles();
    this.getZonasAfectadas();
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

  cambiarValidaciones(tipoIncapacidad: string) {
    if (tipoIncapacidad === 'Riesgo de trabajo ST7' || tipoIncapacidad === 'Enfermedad profesional ST9') {
      this.formIncapacidad.get('calificacionAccidente')!.setValidators([Validators.required]);
      this.formIncapacidad.get('causa')!.setValidators([Validators.required]);
      this.formIncapacidad.get('zonasAfectadas')!.setValidators([Validators.required]);
    } else{
      this.formIncapacidad.get('calificacionAccidente')!.clearValidators();
      this.formIncapacidad.get('causa')!.clearValidators();
      this.formIncapacidad.get('zonasAfectadas')!.clearValidators();
    }
  
    // Actualiza las validaciones
    this.formIncapacidad.get('calificacionAccidente')!.updateValueAndValidity();
    this.formIncapacidad.get('causa')!.updateValueAndValidity();
    this.formIncapacidad.get('zonasAfectadas')!.updateValueAndValidity();
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
      this.formIncapacidad.get('empleado_id')?.setValue($id);
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
    this.formIncapacidad.get('tipo')?.valueChanges.subscribe((tipo) => {
      this.actualizarConsecuentesOpciones(tipo);
    });
  }
  
  private actualizarConsecuentesOpciones(tipo: string) {
    const consecuenteControl = this.formIncapacidad.get('consecuente');
    consecuenteControl?.reset();
  
    const opciones = this.obtenerOpcionesConsecuenteSegunTipo(tipo);
    consecuenteControl?.setValidators([Validators.required]);
    consecuenteControl?.setValue(null);
    consecuenteControl?.updateValueAndValidity(); 
  
    this.formIncapacidad.updateValueAndValidity();
    this.consecuentesOpciones = this.obtenerOpcionesConsecuenteSegunTipo(tipo);
  }
  
  private obtenerOpcionesConsecuenteSegunTipo(tipo: string): string[] {
    switch (tipo) {
      case 'Riesgo de trabajo ST7':
      case 'Enfermedad profesional ST9':
        return ['Incapacidad temporal', 'Incapacidad permanente', 'Incapacidad permanente parcial', 'Incapacidad permanente total', 'Muerte'];
  
      case 'Enfermedad general':
        return ['Incapacidad temporal', 'Invalidez', 'Muerte'];
      case '':
        return [];
      default:
        return ['Incapacidad temporal'];
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
      this.formIncapacidad.get('fechaInicial')?.value,
      this.formIncapacidad.get('fechaTermino')?.value
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
    this.cambiarValidaciones(this.formIncapacidad.get('tipo')!.value);

    this.formIncapacidad.get('dias')?.setValue(
      this.calcularDias(
        this.formIncapacidad.get('fechaInicial')?.value,
        this.formIncapacidad.get('fechaTermino')?.value
      )
    );

    if (this.formIncapacidad.invalid) {
      const camposNoValidos = Object.keys(this.formIncapacidad.controls).filter(controlName => this.formIncapacidad.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        this.formIncapacidad.get(controlName)!;
        const control = this.formIncapacidad.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {
      const incapacidad = this.formIncapacidad.value;

      this.incapacidadesService.storeIncapacidad(incapacidad).subscribe(
        (response) => {
          this.router.navigate(['/enfermeria/incapacidades/', response.id]);
          this.notificationService.mensaje(response);
        },
        (error) => {
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
