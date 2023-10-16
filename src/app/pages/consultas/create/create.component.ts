import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ExternosService } from 'src/app/services/externos.service';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { Inventarios } from 'src/app/interfaces/inventarios';
import { InventariosService } from '../../inventarios/inventarios.service';
import { Insumos } from 'src/app/interfaces/insumos';
import { event } from 'jquery';

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
  nombre: string = '';
  edad: number | null = null;

  opcionesPacientes: any[] = [];
  itemId: any;

  fechaActual: string | null = null;
  horaActual: string | null = null;

  public Editor = ClassicEditor;
  mensajesDeError: string[] = [];

  private isUpdating = false;

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
    private sanitizer: DomSanitizer,
    private inventariosService: InventariosService
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

    this.formInsumos = this.formBuilder.group({
      inventario:'',
      insumos:'',
      insumosVisible: [false],
      itemInsumo: this.formBuilder.array([]) , 
    });

    this.formInsumos.get('inventario')?.valueChanges.subscribe(value => {
      this.formInsumos.get('insumosVisible')?.setValue(value !== ''); // Actualiza la visibilidad
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.citaId = params['cita'];
      this.getCita();
      this.getInventarios();
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
    }else{
      this.imagePaciente = '/assets/dist/img/user.png';
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

  getInventarios(){
    this.userService.user$.subscribe(
      (user: any) => {
        this.inventariosService.getInventariosDelProfesional(user[0].useable_id).subscribe(
          data => this.inventarios = data,
          error => console.error('Error al obtener inventarios', error)
        );
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }

   formInsumos!:FormGroup;
   inventarios = [{
        "id": 1,
        "nombre": "Ansel",
        "created_at": "2023-10-14T11:29:52.017000Z",
        "updated_at": "2023-10-14T11:29:52.017000Z",
        "pivot": {
            "profesionales_id": "1",
            "inventario_id": "1"
        },
        "insumos": [
            {
                "id": 8,
                "nombre": "Rick Heathcote",
                "precio": "5.00",
                "piezasPorLote": "1",
                "descripcion": "Libero error sunt vel. Dolor aut sint quia nesciunt magni ad ad nam. Fugit sint est at.",
                "inventario_id": "1",
                "created_at": "2023-10-14T11:29:52.057000Z",
                "updated_at": "2023-10-14T11:29:52.057000Z",
                "lotes": [
                    {
                        "id": 12,
                        "lote": "427",
                        "fechaCaducidad": "2023-12-25",
                        "fechaIngreso": "2024-05-07",
                        "insumo_id": "8",
                        "piezasDisponibles": "9",
                        "created_at": "2023-10-14T11:29:52.167000Z",
                        "updated_at": "2023-10-14T11:29:52.167000Z"
                    },
                    {
                        "id": 30,
                        "lote": "286",
                        "fechaCaducidad": "2024-04-23",
                        "fechaIngreso": "2023-10-23",
                        "insumo_id": "8",
                        "piezasDisponibles": "9",
                        "created_at": "2023-10-14T11:29:52.177000Z",
                        "updated_at": "2023-10-14T11:29:52.177000Z"
                    },
                    {
                        "id": 44,
                        "lote": "592",
                        "fechaCaducidad": "2024-01-24",
                        "fechaIngreso": "2024-02-04",
                        "insumo_id": "8",
                        "piezasDisponibles": "9",
                        "created_at": "2023-10-14T11:29:52.187000Z",
                        "updated_at": "2023-10-14T11:29:52.187000Z"
                    },
                    {
                        "id": 55,
                        "lote": "273",
                        "fechaCaducidad": "2024-01-26",
                        "fechaIngreso": "2023-11-12",
                        "insumo_id": "8",
                        "piezasDisponibles": "3",
                        "created_at": "2023-10-14T11:29:52.197000Z",
                        "updated_at": "2023-10-14T11:29:52.197000Z"
                    },
                    {
                        "id": 61,
                        "lote": "915",
                        "fechaCaducidad": "2023-09-12",
                        "fechaIngreso": "2024-04-02",
                        "insumo_id": "8",
                        "piezasDisponibles": "7",
                        "created_at": "2023-10-14T11:29:52.200000Z",
                        "updated_at": "2023-10-14T11:29:52.200000Z"
                    },
                    {
                        "id": 81,
                        "lote": "923",
                        "fechaCaducidad": "2024-03-17",
                        "fechaIngreso": "2024-04-24",
                        "insumo_id": "8",
                        "piezasDisponibles": "8",
                        "created_at": "2023-10-14T11:29:52.217000Z",
                        "updated_at": "2023-10-14T11:29:52.217000Z"
                    },
                    {
                        "id": 87,
                        "lote": "075",
                        "fechaCaducidad": "2024-04-27",
                        "fechaIngreso": "2024-01-19",
                        "insumo_id": "8",
                        "piezasDisponibles": "5",
                        "created_at": "2023-10-14T11:29:52.223000Z",
                        "updated_at": "2023-10-14T11:29:52.223000Z"
                    },
                    {
                        "id": 94,
                        "lote": "193",
                        "fechaCaducidad": "2024-06-09",
                        "fechaIngreso": "2024-01-22",
                        "insumo_id": "8",
                        "piezasDisponibles": "9",
                        "created_at": "2023-10-14T11:29:52.227000Z",
                        "updated_at": "2023-10-14T11:29:52.227000Z"
                    },
                    {
                        "id": 96,
                        "lote": "698",
                        "fechaCaducidad": "2023-10-01",
                        "fechaIngreso": "2023-11-19",
                        "insumo_id": "8",
                        "piezasDisponibles": "8",
                        "created_at": "2023-10-14T11:29:52.227000Z",
                        "updated_at": "2023-10-14T11:29:52.227000Z"
                    }
                ]
            },
            {
                "id": 12,
                "nombre": "Anthony Simonis",
                "precio": "3.00",
                "piezasPorLote": "9",
                "descripcion": "Est autem molestiae quae voluptas et. At saepe non dolorum consectetur ut.",
                "inventario_id": "1",
                "created_at": "2023-10-14T11:29:52.060000Z",
                "updated_at": "2023-10-14T11:29:52.060000Z",
                "lotes": [
                    {
                        "id": 16,
                        "lote": "110",
                        "fechaCaducidad": "2024-04-01",
                        "fechaIngreso": "2023-11-25",
                        "insumo_id": "12",
                        "piezasDisponibles": "2",
                        "created_at": "2023-10-14T11:29:52.167000Z",
                        "updated_at": "2023-10-14T11:29:52.167000Z"
                    },
                    {
                        "id": 21,
                        "lote": "254",
                        "fechaCaducidad": "2023-11-21",
                        "fechaIngreso": "2023-12-15",
                        "insumo_id": "12",
                        "piezasDisponibles": "3",
                        "created_at": "2023-10-14T11:29:52.170000Z",
                        "updated_at": "2023-10-14T11:29:52.170000Z"
                    },
                    {
                        "id": 37,
                        "lote": "720",
                        "fechaCaducidad": "2023-10-13",
                        "fechaIngreso": "2024-04-04",
                        "insumo_id": "12",
                        "piezasDisponibles": "2",
                        "created_at": "2023-10-14T11:29:52.183000Z",
                        "updated_at": "2023-10-14T11:29:52.183000Z"
                    },
                    {
                        "id": 57,
                        "lote": "239",
                        "fechaCaducidad": "2024-03-10",
                        "fechaIngreso": "2024-05-22",
                        "insumo_id": "12",
                        "piezasDisponibles": "2",
                        "created_at": "2023-10-14T11:29:52.197000Z",
                        "updated_at": "2023-10-14T11:29:52.197000Z"
                    }
                ]
            },
        ]
    }];

  getInsumosPorInventario(inventarioId: number) {
    const inventarioSeleccionado = this.inventarios.find(inventario => inventario.id === inventarioId);
    return inventarioSeleccionado ? inventarioSeleccionado.insumos : [];
  }

  cargarInsumos($event:any){
    console.log($event)
  }

  insumosForm(): FormArray {
    return this.formInsumos.get('itemInsumo') as FormArray;
  }

  newLote(value?: any): FormGroup {
    return this.formBuilder.group({
      id: value ? value.id : null,
      nombre: value ? value.nombre : '',
      lotes: this.formBuilder.array([])
    });
  }

  addItemInsumos($event?:any) {
    if (this.isUpdating) {
      return;
    }

    if ($event && $event.length > 0) {
      this.isUpdating = true;

      let lotes = this.insumosForm().controls;

      const obj = this.inventarios[0].insumos.find(item => item.id === $event[$event.length - 1]);
      ($event.length>0)? this.insumosForm().push(this.newLote(obj)):false;

      this.isUpdating = false;
    }
  }

  removeLote(loteIndex: number, id?:any) {

    this.insumosForm().removeAt(loteIndex);
    let i = this.formInsumos.get('insumos')!.value;
    let mutar = i.filter((item:any) => item != id);
    this.formInsumos.get('insumos')?.setValue(mutar)
    return
  }

  itemLotes(itemLoteIndex: number): FormArray {
    return this.insumosForm()
      .at(itemLoteIndex)
      .get('lotes') as FormArray;
  }

  newItemLote(): FormGroup {
    return this.formBuilder.group({
      lote: '',
      cantidad: ''
    });
  }

  addItemLote(itemLoteIndex: number) {
    this.itemLotes(itemLoteIndex).push(this.newItemLote());
  }

  removeItemLote(itemLoteIndex: number, loteIndex: number) {
    this.itemLotes(itemLoteIndex).removeAt(loteIndex);
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
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.opcionesPacientes = [];
      this.paciente = null;
      this.consultaForm.get('paciente')?.setValue(null);
  
      const tipoPacienteControl = this.consultaForm.get('tipoPaciente');
      if (tipoPacienteControl) {
        const tipoPaciente = tipoPacienteControl.value;
  
        switch(tipoPaciente){
          case 'Empleado':
            this.cargarOpcionesEmpleados();
          break;
          case 'Externo':
            this.cargarOpcionesExternos();
          break;
          case 'Dependiente':
            this.cargarOpcionesDependientes();
          break;
        }
      }
      console.log('.');
      this.isUpdating = false;
    }else{
      return;
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

  cargarOpcionesDependientes() {
    this.historialesMedicosService.getDependientes().subscribe(
      (dependientes) => {
        this.opcionesPacientes = dependientes.map((externo: any) => ({
          id: externo.id,
          text: externo.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener dependientes:', error);
      }
    );
  }

  obtenerFechaHoraActual() {
    const now = new Date();
    this.fechaActual = this.datePipe.transform(now, 'yyyy-MM-dd');
    this.horaActual = this.datePipe.transform(now, 'HH:mm a');
  }

  cargarDatosPaciente($id: number) {
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.historialesMedicosService.getHistorialMedico($id)
        .subscribe(historialMedico => {
          this.llenarFormularioEnAutomatico(historialMedico);
      });
      this.isUpdating = false;
    }else{
      return;
    }
  }

  llenarFormularioEnAutomatico(paciente: any){
    this.paciente = paciente?.pacientable;
    this.nombre = paciente?.pacientable?.nombre;

    switch(paciente?.pacientable_type){
      case 'App\\Models\\NomEmpleado':
        this.tipoPaciente = 'Empleado';
      break;
      case 'App\\Models\\Externo':
        this.tipoPaciente = 'Externo';
      break;
      case 'App\\Models\\RHDependiente':
        this.tipoPaciente = 'Dependiente';
      break;
      default:
        this.tipoPaciente = '';
      break;
    }

    if(paciente?.pacientable_id){
      this.consultaForm.get('paciente')?.setValue(paciente?.pacientable_id);
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
    }else{
      this.imagePaciente = '/assets/dist/img/user.png';
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
