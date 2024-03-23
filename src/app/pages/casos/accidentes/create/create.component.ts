import { Component, Input } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Casos } from 'src/app/interfaces/casos';
import { ConsultasService } from 'src/app/pages/consultas/consultas.service';
import { AccidentesService } from 'src/app/services/accidentes.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-accidentes-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})

export class AccidentesCreateComponent {
  @Input() caso?: Casos;

  formAccidente!: FormGroup;

  mensajesDeError: string[] = [];
  user!: any;
  
  showInput = false;

  diagnosticos: any[] = [];

  public Editor = ClassicEditor;

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
        // '|',
        // 'outdent', 'indent'
      ]
    },
    image: {
      toolbar: ['imageTextAlternative']
    }
  };

  nombresDescriptivos: { [key: string]: string } = {
    fecha: 'fecha',
    lugar: 'lugar',
    descripcion: 'descripción',
    diagnostico_id: 'diagnóstico',
    empleado_id: 'empleado',
    causa: 'causa',
    canalizado: 'canalizado',
    clinica: 'clinica',
    diasIncInterna: 'días de incapacidad interna',
    costoIncInterna: 'costo de incapacidad interna',
    costoEstudio: 'costo del estudio',
    costoConsulta: 'costo de la consulta',
    costoMedicamento: 'costo del medicamento',
    costoTotalAccidente: 'costo total del accidente',
    calificacion: 'calificación',
    observaciones: 'observaciones',
    resultado: 'resultado',
    salario: 'salario',
    costos: 'costos'
  };

  constructor(
    private notificationService: NotificationService,
    private accidentesService: AccidentesService,
    private consultasService: ConsultasService,
    private empleadosService: EmpleadosService,
    private userService: UserService,
    private formBuilder: FormBuilder,
  ) {
    this.formAccidente = this.formBuilder.group({
        caso_id: [null, [Validators.nullValidator]],
        fecha: [null, [Validators.required]],
        empleado_id: [null, [Validators.nullValidator]],
        lugar: [null, [Validators.required]],
        descripcion: [null, [Validators.required]],
        diagnostico_id: [null, [Validators.required]],
        causa: [null, [Validators.required]],
        canalizado: [null, [Validators.required]],
        clinica: [null, [Validators.required]],
        diasIncInterna: [0, [Validators.required]],
        costoIncInterna: [0, [Validators.required]],
        costoEstudio: [0, [Validators.nullValidator]],
        costoConsulta: [0, [Validators.nullValidator]],
        costoMedicamento: [0, [Validators.required]],
        costoTotalAccidente: [0, [Validators.nullValidator]],
        calificacion: [null, [Validators.required]],
        observaciones: [null, [Validators.required]],
        resultado: [null],
        salario: [0, [Validators.required]],
        costos: this.formBuilder.array(
          [this.formBuilder.group({
            descripcion: [null, Validators.required],
            monto: [0, Validators.required]
          })], [Validators.required])
    });
  }

  ngOnInit(): void {

    this.getEmpleadoSalario();

    this.userService.user$.subscribe(
      (user: any) => {
        this.user = user[0];
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

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

    if(this.caso?.accidente){
      this.llenarFormulario();
    }
  }

  llenarFormulario(){
    const accidente = this.caso?.accidente; // Obtener el objeto de accidente de la propiedad incapacidad

    const fechaISO = accidente?.fecha;
    const fechaFormateada = new Date(fechaISO!).toISOString().slice(0, 16);
    
    this.showInput = true;

    this.formAccidente.patchValue({
      fecha: fechaFormateada,
      lugar: accidente?.lugar,
      descripcion: accidente?.descripcion,
      diagnostico_id: accidente?.diagnostico_id,
      causa: accidente?.causa,
      canalizado: accidente?.canalizado,
      clinica: accidente?.clinica,
      diasIncInterna: accidente?.diasIncInterna,
      costoIncInterna: accidente?.costoIncInterna,
      costoEstudio: accidente?.costoEstudio,
      costoConsulta: accidente?.costoConsulta,
      costoMedicamento: accidente?.costoMedicamento,
      costoTotalAccidente: accidente?.costoTotalAccidente,
      calificacion: accidente?.calificacion,
      observaciones: accidente?.observaciones,
      resultado: accidente?.resultado,
      salario: accidente?.salario,
    });

    const costosArray = this.formAccidente.get('costos') as FormArray;
    costosArray.clear();
    accidente?.accidente_cost_estudios.forEach((costo: any) => {
      costosArray.push(this.formBuilder.group({
        descripcion: costo.descripcion,
        monto: costo.monto
      }));
    });
  }

  getEmpleadoSalario(){
    this.empleadosService.getEmpleadoSalario(this.caso!.empleado!.id).subscribe(
      (salario) => {
        this.formAccidente.get('salario')?.setValue(salario);
      },
      (error) => {
        this.notificationService.error(error);
      }
    );
  }

  calcularCostoIncInterna(): number {
    const diasIncInterna = this.formAccidente.get('diasIncInterna')?.value || 0;
    const salario = this.formAccidente.get('salario')?.value || 0;

    let resultado = diasIncInterna * salario;

    this.formAccidente.get('costoIncInterna')?.setValue(resultado);
    return resultado;
  }

  toggleLugarInput() {
    this.showInput = !this.showInput;
    if (!this.showInput) {
      this.formAccidente.get('lugar')?.setValue('');
    }
  }

  checkForOther() {
    const categoriaValue = this.formAccidente.get('lugar')?.value;
    this.showInput = categoriaValue === 'Otro';
  }

  getTotalCostoEstudios(): number {
    const costos = this.formAccidente.get('costos') as FormArray;
    let total = 0;
    costos.controls.forEach((control: AbstractControl, index: number) => {
      if (control instanceof FormGroup) {
        total += control.get('monto')!.value || 0;
      }
    });
    return total;
  } 
  
  getTotalCosto(): number {
    const total = 
    this.getTotalCostoEstudios() +
    (this.formAccidente.get('costoIncInterna')!.value || 0) +
    (this.formAccidente.get('costoConsulta')!.value || 0) +
    (this.formAccidente.get('costoMedicamento')!.value || 0);

    return total;
  } 

  addCosto(): void {
    const costo = this.formBuilder.group({
        descripcion: [null, Validators.required],
        monto: [null, Validators.required]
    });
    (this.formAccidente.get('costos') as FormArray).push(costo);
  }

  // Método para eliminar un costo del formulario
  removeCosto(index: number): void {
      (this.formAccidente.get('costos') as FormArray).removeAt(index);
  }

  // Método getter para acceder a los controles del FormArray
  get items() {
    return this.formAccidente.get('costos') as FormArray;
  }

  guardar() {
    if (this.formAccidente.invalid) {
      const camposNoValidos = Object.keys(this.formAccidente.controls).filter(controlName => this.formAccidente.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        this.formAccidente.get(controlName)!;
        const control = this.formAccidente.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {
      this.formAccidente.get('costoEstudio')?.setValue(this.getTotalCostoEstudios());
      this.formAccidente.get('costoTotalAccidente')?.setValue(this.getTotalCosto());
      this.formAccidente.get('empleado_id')?.setValue(this.caso?.empleado_id);

      if(this.caso?.accidente){
        this.editarAccidente();
      }else{
        this.crearAccidente();
      }
    }
  }

  editarAccidente(){
    const accidente = this.formAccidente.value;
    
    this.accidentesService.updateAccidentes(this.caso!.accidente!.id, accidente).subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        this.notificationService.error(error);
      }
    );
  }

  crearAccidente(){
    this.formAccidente.get('caso_id')?.setValue(this.caso?.id);
    this.formAccidente.get('profesional_id')?.setValue(this.user.useable_id);

    const accidente = this.formAccidente.value;

    this.accidentesService.storeAccidentes(accidente).subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        this.notificationService.error(error);
      }
    );
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
