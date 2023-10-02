import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ExternosService } from 'src/app/services/externos.service';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInYears } from 'date-fns';
import { ConsultasService } from '../consultas.service';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ImageService } from 'src/app/services/imagen.service';
import { CitasService } from 'src/app/services/cita.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HistorialesMedicosService } from '../../historiales-medicos/historiales-medicos.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})

export class ConsultasCreateComponent implements OnInit {

  consultaForm: FormGroup;

  citaId: number | null = null;
  cita: any;

  profesional: any;
  imageProfesional: any;
  imagePaciente: any;

  tipoPaciente: string = 'Empleado';
  paciente: any = null;
  edad: number | null = null;

  opcionesPacientes: any[] = [];
  itemId: any;

  fechaActual: string | null = null;
  horaActual: string | null = null;

  public Editor = ClassicEditor;

  mensajesDeError: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    cita_id: 'cita',
    profesional_id: 'profesional',
    tipoPaciente: 'tipo de Paciente',
    paciente: 'paciente',
    edad: 'edad',
    peso: 'peso',
    talla: 'altura',
    fecha: 'fecha',
    triajeClasificacion: 'triaje Clasificación',
    precionDiastolica: 'presión Diastólica',
    frecuenciaRespiratoria: 'frecuencia Respiratoria',
    frecuenciaCardiaca: 'frecuencia Cardiaca',
    temperatura: 'temperatura',
    grucemiaCapilar: 'glucemia Capilar',
    subjetivo: 'subjetivo',
    objetivo: 'objetivo',
    analisis: 'análisis',
    plan: 'plan',
    diagnostico: 'diagnóstico',
    receta: 'receta'
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


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private imageService: ImageService,
    private empleadosService: EmpleadosService,
    private externosService: ExternosService,
    private consultasService: ConsultasService,
    private historialesMedicosService: HistorialesMedicosService,
    private citasService: CitasService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) 
  {
    this.consultaForm = this.formBuilder.group({
      cita_id: [null],
      profesional_id: [null],
      tipoPaciente: ['Empleado', Validators.required],
      paciente: [null, Validators.required],
      edad: [null, Validators.required],
      peso: [null, Validators.required],
      talla: [null, Validators.required],
      fecha: [null],
      triajeClasificacion: [null],
      precionDiastolica: [null],
      frecuenciaRespiratoria: [null],
      frecuenciaCardiaca: [null],
      temperatura: [null],
      grucemiaCapilar: [null],
      subjetivo: [null, [Validators.maxLength(2294967295)]],
      objetivo: [null, [Validators.maxLength(2294967295)]],
      analisis: [null, [Validators.maxLength(2294967295)]],
      plan: [null, [Validators.maxLength(2294967295)]],
      diagnostico: [null, [Validators.required, Validators.maxLength(2294967295)]],
      receta: [null,[Validators.required, Validators.maxLength(2294967295)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.citaId = params['cita'];
      this.getCita();
    });

    this.userService.user$.subscribe(
      (user: any) => {
        this.profesional = user[0];
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

    if (this.profesional.image.url) {
      this.obtenerImagen(this.profesional.image.url).subscribe((imagen) => {
        this.imageProfesional = imagen;
      });
    }

    this.obtenerFechaHoraActual();
    this.cargarOpcionesEmpleados();
  }

  getCita(){
    if(this.citaId !== null && this.citaId !== undefined){
    
      this.citasService.getCita(this.citaId)
        .subscribe(cita => {
          this.cita = cita;
          this.consultaForm.get('cita_id')?.setValue(this.citaId);

          this.llenarFormularioEnAutomatico(cita?.paciente);

          this.consultaForm.get('paciente')?.setValue(cita?.paciente?.pacientable_id);
          this.consultaForm.get('tipoPaciente')?.setValue(cita?.paciente?.pacientable_type);
        }
      );
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

  cambiarTipoPaciente() {
    this.opcionesPacientes = [];
    this.paciente = null;
    this.consultaForm.get('paciente')?.setValue(null);

    const tipoPacienteControl = this.consultaForm.get('tipoPaciente');
    if (tipoPacienteControl) {
      const tipoPaciente = tipoPacienteControl.value;
      if (tipoPaciente === 'Empleado') {
        this.cargarOpcionesEmpleados();
      } else if (tipoPaciente === 'Externo') {
        this.cargarOpcionesExternos();
      }
    }
  }

  cargarOpcionesEmpleados() {
    this.empleadosService.getEmpleados().subscribe(
      (empleados) => {
        this.opcionesPacientes = empleados.map((empleado: any) => ({
          id: empleado.id,
          text: empleado.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }

  cargarOpcionesExternos() {
    this.externosService.getExternos().subscribe(
      (externos) => {
        this.opcionesPacientes = externos.map((externo: any) => ({
          id: externo.id,
          text: externo.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener externos:', error);
      }
    );
  }

  obtenerFechaHoraActual() {
    const now = new Date();
    this.fechaActual = this.datePipe.transform(now, 'yyyy-MM-dd');
    this.horaActual = this.datePipe.transform(now, 'HH:mm a');
  }

  cargarDatosPaciente(id: number) {
    if(id !== null && id !== undefined){
      this.historialesMedicosService.getHistorialMedico(id)
        .subscribe(historialMedico => {
          this.llenarFormularioEnAutomatico(historialMedico);
      });
    }
  }

  llenarFormularioEnAutomatico(paciente: any){
    this.paciente = paciente?.pacientable;

    switch(paciente?.pacientable_type){
      case 'App\\Models\\NomEmpleado':
        this.tipoPaciente = 'Empleado';
      break;
      case 'App\\Models\\Externo':
        this.tipoPaciente = 'Externo';
      break;
      default:
        this.tipoPaciente = '';
      break;
    }

    if (paciente?.pacientable?.fechaNacimiento) {
      const fechaNacimiento = new Date(paciente?.pacientable?.fechaNacimiento);
      const edad = differenceInYears(new Date(), fechaNacimiento);

      this.consultaForm.get('edad')?.setValue(edad);
    }

    if(paciente?.talla){
      this.consultaForm.get('talla')?.setValue(paciente?.talla);
    }

    if(paciente?.peso){
      this.consultaForm.get('peso')?.setValue(paciente?.peso);
    }

    if (paciente?.pacientable?.image?.url) {
      this.obtenerImagen(paciente?.pacientable?.image?.url).subscribe((imagen) => {
        this.imagePaciente = imagen;
      });
    }
  }

  onPacienteChange(event: any) {
    const pacienteSeleccionado = this.opcionesPacientes.find(p => p.text === event.value);
    this.consultaForm.get('pacientable_id')?.setValue(pacienteSeleccionado?.id);
  }

  guardar() {
    if (this.consultaForm.invalid) {
      const camposNoValidos = Object.keys(this.consultaForm.controls).filter(controlName => this.consultaForm.get(controlName)?.invalid);
      const mensajes: string[] = [];
  
      camposNoValidos.forEach(controlName => {
        const control = this.consultaForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });
  
      this.mensajesDeError = mensajes;
    } else {
      const fechaHoraActual = `${this.fechaActual} ${this.horaActual}`;
      this.consultaForm.get('fecha')?.setValue(fechaHoraActual);
      this.consultaForm.get('profesional_id')?.setValue(this.profesional?.id);
  
      const consulta = this.consultaForm.value;
  
      this.consultasService.storeConsulta(consulta).subscribe(
        (response) => {
          this.mensaje(response);
        },
        (error) => {
          this.error(error);
        }
      );
    }
  }

  mensaje(response: any) {

    Swal.fire({
      icon: 'success',
      title: response.message,
      showConfirmButton: false,
      timer: 6500
    });

    setTimeout(() => {
      this.router.navigate(['/enfermeria/consultas']);
    }, 2000);
  }

  error(response: any) {
    Swal.fire({
      icon: 'error',
      title: response.message,
      showConfirmButton: false,
      timer: 6500 
    });
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
