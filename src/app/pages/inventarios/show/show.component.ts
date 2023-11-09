import { Component } from '@angular/core';
import { InventariosService } from '../inventarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { InventarioDataService } from '../inventario-data.service';
import { Inventarios } from 'src/app/interfaces/inventarios';
import { Movimientos } from 'src/app/interfaces/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class InventarioShowComponent {
  //INVENTARIO
  inventario?: Inventarios;

  paginaActual = 1;
  elementosPorPagina = 10;

  search: string = '';
  private searchTerms = new Subject<string>();

  //MOVIMIENTO
  movimientos: Movimientos[] = [];

  movimientosPaginaActual = 1;
  movimientosElementosPorPagina = 10;

  //BUSCAR PDF
  pdfMovimientoForm!: FormGroup;
  mensajesDeError: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    inventario_id: 'almacen',
    clave: 'clave',
    fechaInicial: 'fecha inicial',
    fechaFinal: 'fecha final',
  };

  constructor(
    private inventariosService: InventariosService,
    private router: Router,
    private route: ActivatedRoute,
    private inventarioDataService: InventarioDataService,
    private movimientosService: MovimientosService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
  ) 
  {
    this.pdfMovimientoForm = this.formBuilder.group({
      inventario_id: [this.inventario?.id, Validators.required],
      clave: [null, Validators.required],
      fechaInicial: [null, Validators.required],
      fechaFinal: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    // this.searchTerms.pipe(
    //   debounceTime(500)
    // ).subscribe(() => {
    //   this.realizarBusqueda();
    // });

    const inventarioId = +this.route.snapshot.paramMap.get('id')!;
    this.inventariosService.getInventario(inventarioId)
      .subscribe(inventario => {
        this.inventario = inventario;

        this.pdfMovimientoForm.get('inventario_id')?.setValue(inventarioId);
    });

    this.movimientosService.getMovimientosPorInventario(inventarioId)
      .subscribe(movimientos => {
        this.movimientos = movimientos;
    });
  }

  buscarInsumo() {
    this.searchTerms.next(this.search.trim());
  }
  
  realizarBusqueda() {
    // if (this.search.trim() !== '') {
    //   this.insumosMedicosService.buscador(this.search)
    //     .subscribe(
    //       insumos => this.insumos = insumos,
    //       error => console.error(error)
    //     );
    // } else {
    //   this.getInsumosMedicos();
    // }
  }

  buscarPDF(){
    if (this.pdfMovimientoForm.invalid) {
      const camposNoValidos = Object.keys(this.pdfMovimientoForm.controls).filter(controlName => this.pdfMovimientoForm.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        this.pdfMovimientoForm.get(controlName)!;
        const control = this.pdfMovimientoForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {

      const buscarPDF = this.pdfMovimientoForm.value;

      this.movimientosService.buscarPDF(buscarPDF).subscribe(
        (response) => {
            const blob = new Blob([response], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            window.open(url);
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

  crearInsumo(inventarioId: number) {
    this.inventarioDataService.setInventarioId(inventarioId);
    this.router.navigate(['/enfermeria/almacenes', inventarioId, 'insumos', 'create']);
  }

  generarMovimiento(inventarioId: number) {
    this.router.navigate(['/enfermeria/almacenes', inventarioId, 'movimientos', 'create']);
  }

  showInsumoMedico(insumoId: number) {
    this.router.navigate(['/enfermeria/almacenes', this.inventario?.id, 'insumos', insumoId]);
  }

  showMovimiento(movimientoId:number){
    this.router.navigate(['/enfermeria/almacenes', this.inventario?.id, 'movimientos', movimientoId]);
  }

  obtenerSumatoriaPiezasDisponibles(lotes: any[]): number {
    return lotes.reduce((total, lote) => total + parseInt(lote.piezasDisponibles, 10), 0);
  }
}
