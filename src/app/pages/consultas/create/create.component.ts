import { Component, OnInit } from '@angular/core';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ExternosService } from 'src/app/services/externos.service';
import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { differenceInYears } from 'date-fns';
import { ConsultasService } from '../consultas.service';
import { UserService } from 'src/app/services/user.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from 'src/app/services/imagen.service';
import { CitasService } from 'src/app/services/cita.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HistorialesMedicosService } from '../../historiales-medicos/historiales-medicos.service';
import { InventariosService } from '../../inventarios/inventarios.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})

export class ConsultasCreateComponent implements OnInit {

  consultaForm: FormGroup;

  citaId: number | null = null;
  cita: any;

  color: string | null = null;

  profesional: any;
  imageProfesional: any;
  imagePaciente: any;

  paciente?: any;
  historialMedico?: HistorialesMedicos;
  
  edad: number | null = null;

  opcionesPacientes: any[] = [];
  itemId: any;

  fechaActual: string | null = null;
  horaActual: string | null = null;

  alergias!: string;

  imc: number = 0;
  imcSignificado: string = '';
  imcColor: string = '';

  diagnosticos: any[] = [];

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
    presionDiastolica: 'presión Diastólica',
    presionSistolica: 'presión Sistólica',
    frecuenciaRespiratoria: 'frecuencia Respiratoria',
    frecuenciaCardiaca: 'frecuencia Cardiaca',
    temperatura: 'temperatura',
    mg: 'mg de la glucemia Capilar',
    dl: 'dL de la glucemia Capilar',
    subjetivo: 'subjetivo',
    objetivo: 'objetivo',
    analisis: 'análisis',
    plan: 'plan',
    diagnostico_id: 'diagnóstico',
    complemento: 'complemento',
    receta: 'receta',
    lote: 'lote',
    cantidad: 'cantidad'
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
    private inventariosService: InventariosService,
    private notificationService: NotificationService
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
      presionDiastolica: [null],
      presionSistolica: [null],
      frecuenciaRespiratoria: [null],
      frecuenciaCardiaca: [null],
      temperatura: [null],
      mg: [null],
      dl: [null],
      subjetivo: [null, [Validators.maxLength(2294967295)]],
      objetivo: [null, [Validators.maxLength(2294967295)]],
      analisis: [null, [Validators.maxLength(2294967295)]],
      plan: [null, [Validators.maxLength(2294967295)]],
      diagnostico_id: [null, [Validators.required]],
      complemento: [null, [Validators.required, Validators.maxLength(2294967295)]],
      receta: [null, [Validators.required, Validators.maxLength(2294967295)]],
      inventario_id: [null],
      formInsumos: this.formInsumos
    });

    this.formInsumos.get('inventario')?.valueChanges.subscribe(value => {
      this.formInsumos.get('insumosVisible')?.setValue(value !== ''); // Actualiza la visibilidad
    });

    this.consultasService.getDiagnosticos().subscribe(
      (diagnosticos) => {
        this.diagnosticos = diagnosticos.map((diagnostico: any) => ({
          id: diagnostico.id,
          text: diagnostico.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener diagnosticos:', error);
      }
    );
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

          let tipo = '';

          switch (cita?.paciente?.pacientable_type) {
            case 'App\\Models\\NomEmpleado':
              tipo = 'Empleado';
              break;
            case 'App\\Models\\Externo':
              tipo = 'Externo';
              break;
            case 'App\\Models\\RHDependiente':
              tipo = 'Dependiente';
              break;
          }

          this.consultaForm.get('tipoPaciente')?.setValue(tipo);
        }
        );
    }
  }

  seleccionarColor() {
    switch(this.consultaForm.value.triajeClasificacion){
      case '1':
        this.color = '#dd4b39';
      break;
      case '2':
        this.color = '#FF851B';
      break;
      case '3':
        this.color = '#f39c12';
      break;
      case '4':
        this.color = '#198754';
      break;
      case '5':
        this.color = '#0d6efd';
      break;
    }
  }

  getInventarios() {
    this.userService.user$.subscribe(
      (user: any) => {
        this.inventariosService.inventariosDelProfesionalParaConsulta(user[0].useable_id).subscribe(
          data => this.inventarios = data,
          error => console.error('Error al obtener inventarios', error)
        );

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
    return lotes
  }

  formInsumos!: FormGroup;
  inventarios: any;

  getInsumosPorInventario(inventarioId: number) {
    this.consultaForm.get('inventario_id')?.setValue(inventarioId);
    if (this.isUpdating) { return; }
    let inventarioSeleccionado = this.inventarios.find((inventario: any) => inventario.id === inventarioId);

    while (this.insumosForm().length !== 0) {
      this.insumosForm().removeAt(0);
    }
    this.insumosSelect = inventarioSeleccionado.insumos;
  }

  insumosForm(): FormArray {
    return this.formInsumos.get('itemInsumo') as FormArray;
  }

  newLote(value?: any): FormGroup {
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
    return this.formBuilder.group({
      id: insumo ? insumo.id : null,
      nombre: insumo ? insumo.nombre : '',
      piezasPorLote: insumo ? insumo.piezasPorLote : null,
      precio: insumo ? insumo.precio : null,
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
    let inputCantidad = this.itemLotes(insumoIndex).controls[loteIndex]?.get('cantidad') as FormControl;

    if (inputCantidad.value == '') { }
    else {
      if (inputCantidad.value > Number(dataLote.piezasDisponibles)) {
        inputCantidad.setValue('');
        Swal.fire('Las unidades no pueden ser mayor de ' + dataLote.piezasDisponibles + ' piezas disponibles');
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
    this.opcionesPacientes = [];
    this.paciente = null;

    switch (this.consultaForm.get('tipoPaciente')?.value) {
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
      this.consultaForm.get('paciente')?.setValue($id);
      this.historialesMedicosService.getHistorialMedicoPorPaciente(this.consultaForm.get('tipoPaciente')?.value.toLowerCase(), $id)
        .subscribe(historialMedico => {
          this.llenarFormularioEnAutomatico(historialMedico);
        });
      this.isUpdating = false;
    } else {
      return;
    }
  }

  llenarFormularioEnAutomatico(historialMedico: any) {
    this.paciente = historialMedico.pacientable;
    this.historialMedico = historialMedico;

    console.log('paciente'+this.paciente);

    if (historialMedico?.pacientable?.fechaNacimiento) {
      const fechaNacimiento = new Date(historialMedico?.pacientable?.fechaNacimiento);
      const edad = differenceInYears(new Date(), fechaNacimiento);

      this.consultaForm.get('edad')?.setValue(edad);
    }

    if (historialMedico?.talla) {
      this.consultaForm.get('talla')?.setValue(historialMedico?.talla);
    }

    if (historialMedico?.peso) {
      this.consultaForm.get('peso')?.setValue(historialMedico?.peso);
    }

    if(historialMedico?.talla && historialMedico?.peso){
      this.calcularIMC(historialMedico?.peso, historialMedico?.talla);
    }

    if (historialMedico?.pacientable?.image) {
      this.obtenerImagen(historialMedico?.pacientable?.image?.url).subscribe((imagen) => {
        this.imagePaciente = imagen;
      });
    } else {
      this.imagePaciente = '/assets/dist/img/user.png';
    }

    if (historialMedico?.antecedentes_personales_patologicos?.alergias) {
      this.alergias = historialMedico?.antecedentes_personales_patologicos?.espAlergias;
      this.notificationService.info('Este paciente padece de las siguientes alergías: ', historialMedico?.antecedentes_personales_patologicos?.espAlergias);
    }
  }

  obtenerIMC() {
    this.calcularIMC(this.consultaForm.get('peso')?.value, this.consultaForm.get('talla')?.value);
  }

  calcularIMC(peso: number, talla: number){
    if (peso && talla) {
      this.imc = peso / (talla * talla);

      if(this.imc < 18.5){
        this.imcSignificado = 'Bajo peso';
        this.imcColor = '#DF6060';
      }
  
      if(this.imc > 18.5 && this.imc < 24.9){
        this.imcSignificado = 'Peso normal';
        this.imcColor = '#26DA44';
      }
  
      if(this.imc > 24.9 && this.imc < 26.9){
        this.imcSignificado = 'Sobre peso I grado';
        this.imcColor = '#93DA26';
      }
  
      if(this.imc > 26.9 && this.imc <  29.9){
        this.imcSignificado = 'Sobre peso II grado';
        this.imcColor = '#C4DA26';
      }
  
      if(this.imc > 29.9 && this.imc <  34.9){
        this.imcSignificado = 'Obesidad I grado';
        this.imcColor = '#DABC26';
      }
  
      if(this.imc > 34.9 && this.imc <  39.9){
        this.imcSignificado = 'Obesidad I grado';
        this.imcColor = '#F39207';
      }
  
      if(this.imc > 39.9){
        this.imcSignificado = 'Obesidad morbida';
        this.imcColor = '#F34007';
      }
    }
  }

  onPacienteChange(event: any) {
    const pacienteSeleccionado = this.opcionesPacientes.find(p => p.text === event.value);
    this.consultaForm.get('pacientable_id')?.setValue(pacienteSeleccionado?.id);
  }

  getPiezasDisponibles(insumo: any, loteIndex: number){
    let lotes = this.getLotesSelect(insumo.value.id);
    let inputLote = insumo.value.lotes[loteIndex];
    let dataLote = lotes?.find(l => l.id == inputLote.lote);

    return Number(dataLote?.piezasDisponibles);
  }

  guardar() {
    if (this.consultaForm.invalid) {
      const camposNoValidos = Object.keys(this.consultaForm.controls).filter(controlName => this.consultaForm.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        this.formInsumos.get(controlName)!;
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