import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ExternosService } from 'src/app/services/externos.service';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
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
  lotesSelect = [];
  insumosSelect: any[] = [];

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
  ) {
    this.formInsumos = this.formBuilder.group({
      inventario: '',
      insumos: '',
      insumosVisible: [false],
      itemInsumo: this.formBuilder.array([]),
    });

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
      receta: [null, [Validators.required, Validators.maxLength(2294967295)]],
      formInsumos: this.formInsumos
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
    } else {
      this.imagePaciente = '/assets/dist/img/user.png';
    }

    this.obtenerFechaHoraActual();
    this.cargarOpcionesEmpleados();

    this.insumosSelect = [];
  }

  getCita() {
    if (this.citaId !== null && this.citaId !== undefined) {

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

  getInventarios() {
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

  getLotesSelect(id: any) {
    const insumoIdBuscado = id;
    const lotes = [];
    for (const elemento of this.inventarios) {
      for (const insumo of elemento.insumos) {
        if (insumo.id === insumoIdBuscado) {
          lotes.push(...insumo.lotes);
        }
      }
    }
    console.log(lotes, id)
    return lotes
  }

  formInsumos!: FormGroup;
  inventarios: any;

  getInsumosPorInventario(inventarioId: number) {
    if (this.isUpdating) { return; }
    let inventarioSeleccionado = this.inventarios.find((inventario: any) => inventario.id === inventarioId);

    while (this.insumosForm().length !== 0) {
      this.insumosForm().removeAt(0);
    }
    this.insumosSelect = inventarioSeleccionado.insumos;
  }


  // getLotesPorInsumo(insumoId: number) {
  //   const insumos = this.getInsumosPorInventario;
  //   const insumoSeleccionado = insumos.find(insumo => insumo.id === insumoId);
  //   return loteSeleccionado ? loteSeleccionado.insumos.lotes : [];
  // }

  cargarInsumos($event: any) {
    console.log($event)
  }

  insumosForm(): FormArray {
    return this.formInsumos.get('itemInsumo') as FormArray;
  }

  newLote(value?: any): FormGroup {
    console.log(value.lotes);
    return this.formBuilder.group({
      id: value ? value.id : null,
      nombre: value ? value.nombre : '',
      arrayLotes: this.lotesSelect,
      lotes: this.formBuilder.array([])
    });

  }

  addItemInsumo($event?: any) {
    if (this.isUpdating) { return; }
    if ($event) {
      this.isUpdating = true;
      let insumos = this.getInsumos(this.inventarios);
      let insumo = insumos.find((item: any) => item.id === $event);
      this.insumosForm().push(this.crearLoteGroup(insumo));
      this.isUpdating = false;
    }
  }

  crearLoteGroup(insumo?: any): FormGroup {
    console.log(insumo.lotes);
    return this.formBuilder.group({
      id: insumo ? insumo.id : null,
      nombre: insumo ? insumo.nombre : '',
      arrayLotes: insumo.lotes,
      lotes: this.formBuilder.array([])
    });
  }

  private getInsumos(allInventarios: any[]) {
    let insumos: any = [];
    allInventarios.forEach((inventario: any) => {
      inventario.insumos.forEach((insumo: any) => {
        insumos.push(insumo);
      });
    });
    return insumos;
  }

  deleteInsumo($event: any) {
    let insumoIndex = this.insumosForm().controls.findIndex(insumoControl => insumoControl.value.id === $event);
    this.insumosForm().removeAt(insumoIndex);
  }

  removeLote(loteIndex: number, id?: any) {

    this.insumosForm().removeAt(loteIndex);
    let i = this.formInsumos.get('insumos')!.value;
    let mutar = i.filter((item: any) => item != id);
    this.formInsumos.get('insumos')?.setValue(mutar)
    return
  }

  itemLotes(itemLoteIndex: number): FormArray {
    return this.insumosForm()
      .at(itemLoteIndex)
      .get('lotes') as FormArray;
  }

  newItemLote(): FormGroup {
    let loteGroup = this.formBuilder.group({
      lote: new FormControl('', [Validators.required]),
      cantidad: new FormControl('', [Validators.required]),
    });
    console.log('New Lote', loteGroup);
    return loteGroup;
  }

  addItemLote(itemLoteIndex: number) {
    this.itemLotes(itemLoteIndex).push(this.newItemLote());
  }

  removeItemLote(itemLoteIndex: number, loteIndex: number) {
    this.itemLotes(itemLoteIndex).removeAt(loteIndex);
  }

  onFocusOutCantidad(insumoIndex: number, insumo: any, loteIndex: number) {
    let lotes = this.getLotesSelect(insumo.value.id);
    let inputLote = insumo.value.lotes[loteIndex];
    let dataLote = lotes.find(l => l.id == inputLote.lote);
    console.log('Data Lote', dataLote);
    console.log('Select Input Lote', inputLote);
    console.log('Piezas', Number(dataLote.piezasDisponibles));
    let inputCantidad = this.itemLotes(insumoIndex).controls[loteIndex]?.get('cantidad') as FormControl;

    console.log('valor cantidad', inputCantidad.value);
    if (inputCantidad.value == '') { }
    else {
      if (inputCantidad.value > Number(dataLote.piezasDisponibles)) {
        inputCantidad.setValue('');
        Swal.fire('Invalido, no puede ser mayor a: ' + dataLote.piezasDisponibles + ' piezas disponibles');
      }
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
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.opcionesPacientes = [];
      this.paciente = null;
      this.consultaForm.get('paciente')?.setValue(null);

      const tipoPacienteControl = this.consultaForm.get('tipoPaciente');
      if (tipoPacienteControl) {
        const tipoPaciente = tipoPacienteControl.value;

        switch (tipoPaciente) {
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
    } else {
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
    this.horaActual = this.datePipe.transform(now, 'HH:mm');
  }

  cargarDatosPaciente($id: number) {
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.historialesMedicosService.getHistorialMedico($id)
        .subscribe(historialMedico => {
          this.llenarFormularioEnAutomatico(historialMedico);
        });
      this.isUpdating = false;
    } else {
      return;
    }
  }

  llenarFormularioEnAutomatico(paciente: any) {
    this.paciente = paciente?.pacientable;
    this.nombre = paciente?.pacientable?.nombre;

    switch (paciente?.pacientable_type) {
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

    if (paciente?.pacientable_id) {
      this.consultaForm.get('paciente')?.setValue(paciente?.pacientable_id);
    }

    if (paciente?.pacientable?.fechaNacimiento) {
      const fechaNacimiento = new Date(paciente?.pacientable?.fechaNacimiento);
      const edad = differenceInYears(new Date(), fechaNacimiento);

      this.consultaForm.get('edad')?.setValue(edad);
    }

    if (paciente?.talla) {
      this.consultaForm.get('talla')?.setValue(paciente?.talla);
    }

    if (paciente?.peso) {
      this.consultaForm.get('peso')?.setValue(paciente?.peso);
    }

    if (paciente?.pacientable?.image?.url) {
      this.obtenerImagen(paciente?.pacientable?.image?.url).subscribe((imagen) => {
        this.imagePaciente = imagen;
      });
    } else {
      this.imagePaciente = '/assets/dist/img/user.png';
    }
  }

  onPacienteChange(event: any) {
    const pacienteSeleccionado = this.opcionesPacientes.find(p => p.text === event.value);
    this.consultaForm.get('pacientable_id')?.setValue(pacienteSeleccionado?.id);
  }

  guardar() {
    console.log('Consulta form', this.consultaForm);

    if (this.consultaForm.invalid) {
      console.log('Invalid, no guarda');
      const camposNoValidos = Object.keys(this.consultaForm.controls).filter(controlName => this.consultaForm.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        const control = this.consultaForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {
      console.log('Guarda');
      const fechaHoraActual = `${this.fechaActual} ${this.horaActual}`;
      this.consultaForm.get('fecha')?.setValue(fechaHoraActual);
      this.consultaForm.get('profesional_id')?.setValue(this.profesional?.id);

      const consulta = this.consultaForm.value;
      console.log('Guardar', consulta);

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
