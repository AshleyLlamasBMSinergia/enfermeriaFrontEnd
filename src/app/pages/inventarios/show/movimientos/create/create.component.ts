import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { NotificationService } from 'src/app/services/notification.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { ActivatedRoute } from '@angular/router';
import { Inventarios } from 'src/app/interfaces/inventarios';
import { InventariosService } from '../../../inventarios.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class MovimientosCreateComponent {
  movimientoForm: FormGroup;
  formInsumos!: FormGroup;
  mensajesDeError: string[] = [];
  lotesSelect = [];
  insumosSelect: any[] = [];
  movimientoTipos: any = [];
  insumos: any = [];
  inventario!: Inventarios;
  salida?: boolean;

  nombresDescriptivos: { [key: string]: string } = {
    profesional_id: 'profesional',
    inventario_id: 'inventario',
    movimientoTipo_id: 'tipo de movimiento',
    formInsumos: 'del insumo tiene campos incorrectos o vacios'
  };

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private movimientosService: MovimientosService,
    private inventariosService: InventariosService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
  ) 
  {
    this.formInsumos = this.formBuilder.group({
      insumos: '',
      insumosVisible: [false],
      itemInsumo: this.formBuilder.array([]),
    });

    this.movimientoForm = this.formBuilder.group({
      profesional_id: [null, Validators.required],
      inventario_id: [null, Validators.required],
      movimientoTipo_id: [null, Validators.required],
      formInsumos: this.formInsumos
    });
  }

  ngOnInit(): void {
    this.getMovimientosTipos();
    const inventarioId = +this.route.snapshot.paramMap.get('inventarioId')!;
    this.movimientoForm.get('inventario_id')?.setValue(inventarioId);
    this.getInventario(inventarioId);
    this.userService.user$.subscribe(
      (user: any) => {
        this.movimientoForm.get('profesional_id')?.setValue(user[0].useable_id);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

    this.insumosSelect = [];
  }

  tipoDeMovimiento($event?: any){
    const salidaActual = this.salida;
    
    if(
      $event === 3 ||
      $event === 11 ||
      $event == 12 ||
      $event === 13
    ){
      this.salida = false;
    }else{
      this.salida = true;
    }

    if(salidaActual != this.salida){

      this.formInsumos.reset();
      this.insumosSelect = [];

      const itemInsumoArray = this.formInsumos.get('itemInsumo') as FormArray;
      itemInsumoArray.clear();
    }
  }

  getInventario(inventarioId: number){
    this.inventariosService.getInventario(inventarioId)
    .subscribe(inventario => {
      this.inventario = inventario;
      this.insumos = inventario.insumos;
    });
  }

  getMovimientosTipos(){
    this.movimientosService.getMoviemientoTipos().subscribe(
      (externos) => {
        this.movimientoTipos = externos.map((tipo: any) => ({
          id: tipo.id,
          text: tipo.tipoDeMovimiento,
        }));
      },
      (error) => {
        console.error('Error al obtener externos:', error);
      }
    );
  }

  getLotesSelect(id: any) {
    const insumoIdBuscado = id;
    const lotes = [];
    for (const insumo of this.inventario.insumos) {
      if (insumo.id === insumoIdBuscado) {
        lotes.push(...insumo.lotes);
      }
    }
    console.log(lotes);
    return lotes
  }


  insumosForm(): FormArray {
    return this.formInsumos.get('itemInsumo') as FormArray;
  }

  newLote(value?: any): FormGroup {
    return this.formBuilder.group({
      id: value ? value.id : null,
      nombre: value ? value.nombre : '',
      precio: value ? value.precioe : '',
      arrayLotes: this.lotesSelect,
      lotes: this.formBuilder.array([])
    });
  }

  addItemInsumo($event?: any) {
    let insumos = this.inventario.insumos;
    let insumo = insumos.find((item: any) => item.id === $event);
    this.insumosForm().push(this.crearLoteGroup(insumo));
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
    let loteGroup;

    if(!this.salida)
    {
      loteGroup = this.formBuilder.group({
        lote: new FormControl('', [Validators.required]),
        cantidad: new FormControl('', [Validators.required]),
        fechaCaducidad: new FormControl('', [Validators.required]),
      });
    }else{
      loteGroup = this.formBuilder.group({
        lote: new FormControl('', [Validators.required]),
        cantidad: new FormControl('', [Validators.required]),
      });
    }

    return loteGroup;
  }

  addItemLote(itemLoteIndex: number) {
    this.itemLotes(itemLoteIndex).push(this.newItemLote());
  }

  removeItemLote(itemLoteIndex: number, loteIndex: number) {
    this.itemLotes(itemLoteIndex).removeAt(loteIndex);
  }

  onFocusOutCantidad(insumoIndex: number, insumo: any, loteIndex: number) {

    let piezasDisponibles = this.getPiezasDisponibles(insumo, loteIndex);
    let inputCantidad = this.itemLotes(insumoIndex).controls[loteIndex]?.get('cantidad') as FormControl;

    if (inputCantidad.value == '') { }
    else {
      if(!this.salida){
        if (inputCantidad.value > insumo.value.piezasPorLote) {
          inputCantidad.setValue('');
          Swal.fire('Las unidades no pueden ser mayor de ' + insumo.value.piezasPorLote);
        }
      }else{
        if (inputCantidad.value > piezasDisponibles) {
          inputCantidad.setValue('');
          Swal.fire('Las unidades no pueden ser mayor de ' + piezasDisponibles);
        }
      }
    }
  }

  getPiezasDisponibles(insumo: any, loteIndex: number){
    // console.log(insumo.value);
    let lotes = this.getLotesSelect(insumo.value.id);
    let inputLote = insumo.value.lotes[loteIndex];
    let dataLote = lotes?.find(l => l.id == inputLote.lote);

    return Number(dataLote?.piezasDisponibles);
  }

  guardar() {
    if (this.movimientoForm.invalid) {
      const camposNoValidosMovimiento = Object.keys(this.movimientoForm.controls).filter(controlName => this.movimientoForm.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidosMovimiento.forEach(controlName => {
        this.formInsumos.get(controlName)!;
        const control = this.movimientoForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {
      const movimientos = this.movimientoForm.value;

      this.movimientosService.storeMovimientos(movimientos).subscribe(
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
