import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from '../../empleados/empleados.service';
import { ExternosService } from '../../externos/externos.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { differenceInYears } from 'date-fns';
import { ConsultasService } from '../consultas.service';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from 'src/app/services/imagen.service';
import { CitasService } from 'src/app/services/cita.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

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
  image: any;

  tipoPaciente: string = 'Empleado';
  paciente: any = null;
  edad: number | null = null;

  opcionesPacientes: any[] = [];
  itemId: any;

  fechaActual: string | null = null;
  horaActual: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private imageService: ImageService,
    private empleadosService: EmpleadosService,
    private externosService: ExternosService,
    private consultasService: ConsultasService,
    private citasService: CitasService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) 
  {
    this.consultaForm = this.formBuilder.group({
      cita_id: [null],
      profesional_id: [null],
      tipoPaciente: ['Empleado', Validators.required], // Inicialmente selecciona 'Empleado'
      pacientable_id: [null, Validators.required],
      edad: [null, Validators.required],
      peso: [null, Validators.required],
      talla: [null],
      fecha: [null],
      triajeClasificacion: [null],
      precionDiastolica: [null],
      frecuenciaRespiratoria: [null],
      frecuenciaCardiaca: [null],
      temperatura: [null],
      grucemiaCapilar: [null],
      subjetivo: [null],
      objetivo: [null],
      analisis: [null],
      plan: [null],
      diagnostico: [null],
      receta: [null]
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

    this.imageService.getImagen(this.profesional.image.url).subscribe(
      (response: any) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      },
      (error) => {
        console.error('Error al obtener la imagen', error);
      }
    );

    this.obtenerFechaHoraActual();
    this.cargarOpcionesEmpleados();
  }

  getCita(){
    if(this.citaId !== null && this.citaId !== undefined){
    
      this.citasService.getCita(this.citaId)
        .subscribe(cita => {
          this.cita = cita;

          let tipoPaciente: string;
  
          switch(this.cita.paciente.pacientable_type){
            case 'App\\Models\\NomEmpleado':
              tipoPaciente = 'Empleado';
            break;
            case 'App\\Models\\Externo':
              tipoPaciente = 'Externo';
            break;
            default:
              tipoPaciente = '';
            break;
          }
          
          this.consultaForm.get('cita_id')?.setValue(this.citaId);
    
          this.consultaForm.get('pacientable_id')?.setValue(this.cita.paciente.pacientable_id);
          this.consultaForm.get('tipoPaciente')?.setValue(tipoPaciente);
        }
      );
    }
  }

  cambiarTipoPaciente() {
    this.opcionesPacientes = [];
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
    this.fechaActual = this.datePipe.transform(now, 'dd/MM/yyyy');
    this.horaActual = this.datePipe.transform(now, 'HH:mm a');
  }

  cargarDatosPaciente(id: number) {
    if(id !== null && id !== undefined){
      const tipoPacienteControl = this.consultaForm.get('tipoPaciente');
      if (tipoPacienteControl) {
        const tipoPaciente = tipoPacienteControl.value;
        if (tipoPaciente === 'Empleado') {
          this.empleadosService.getEmpleado(id).subscribe(
            (paciente) => {
              this.paciente = paciente;
              if (this.paciente?.fechaNacimiento) {
                const fechaNacimiento = new Date(this.paciente!.fechaNacimiento);
                const edad = differenceInYears(new Date(), fechaNacimiento);
      
                this.consultaForm.get('edad')?.setValue(edad);
              }
            },
            (error) => {
              console.error('Error al obtener los datos del paciente:', error);
            }
          );
        } else if (tipoPaciente === 'Externo') {
          this.externosService.getExterno(id).subscribe(
            (paciente) => {
              this.paciente = paciente;
              if (this.paciente?.fechaNacimiento) {
                const fechaNacimiento = new Date(this.paciente!.fechaNacimiento);
                const edad = differenceInYears(new Date(), fechaNacimiento);
      
                this.consultaForm.get('edad')?.setValue(edad);
              }
            },
            (error) => {
              console.error('Error al obtener los datos del paciente:', error);
            }
          );
        }
      }
    }
  }

  onPacienteChange(event: any) {
    const pacienteSeleccionado = this.opcionesPacientes.find(p => p.text === event.value);
    this.consultaForm.get('pacientable_id')?.setValue(pacienteSeleccionado?.id);
  }

  guardar(){

    if (!this.consultaForm.invalid) {
  
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
    }else{
      this.error({ message: 'Faltan campos por llenar' });
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
}
