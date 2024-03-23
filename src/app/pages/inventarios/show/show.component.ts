import { Component } from '@angular/core';
import { InventariosService } from '../inventarios.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject  } from 'rxjs';
import { InventarioDataService } from '../inventario-data.service';
import { Inventarios } from 'src/app/interfaces/inventarios';
import { Movimientos } from 'src/app/interfaces/movimientos';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';
import Chart from 'chart.js/auto';
import { Insumos } from 'src/app/interfaces/insumos';
import { InsumosMedicosService } from '../../insumos-medicos/insumos-medicos.service';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class InventarioShowComponent {
  //INVENTARIO
  inventario?: Inventarios;
  insumos!: any;

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

  //VARIABLES DE GRAFICAS
  insumoConMasDespachosPorRecetaChart:any;

  fechaInicial: string = '';
  fechaFinal: string = '';

  constructor(
    private inventariosService: InventariosService,
    private router: Router,
    private route: ActivatedRoute,
    private inventarioDataService: InventarioDataService,
    private insumosService: InsumosMedicosService,
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
        this.insumos = inventario.insumos;

        //ESTADISTICAS
        this.estadisticaInsumosConMasLotesCaducos(inventarioId);
        this.estadisticaInsumosConMasDespachosPorReceta(inventarioId, '', '');

        this.pdfMovimientoForm.get('inventario_id')?.setValue(inventarioId);
    });

    this.movimientosService.getMovimientosPorInventario(inventarioId)
      .subscribe(movimientos => {
        this.movimientos = movimientos;
    });
  }


    //Por enter
    realizarBusqueda(): void {
        this.insumosService.buscador(this.search, this.inventario!.id)
        .subscribe(
          insumos => this.insumos = insumos,
          error => console.error(error)
        );
    }
  
  estadisticaInsumosConMasLotesCaducos(inventarioId:number){
    this.inventariosService.getEstadisticaInsumosConMasLotesCaducos(inventarioId).subscribe(
      (datos: any) => {
        const insumoConMasDesechos = document.getElementById('myChart');
        const myChart = new Chart("insumoConMasDesechos", {
            type: 'bar',
            data: {
              labels: datos.labels,
              datasets: [{
                  label: 'Movimientos de desechos de almacen',
                  data: datos.data,
                  backgroundColor: datos.backgroundColor,
                  borderColor: datos.backgroundColor,
                  borderWidth: 1,
              }]
            },
            options: {
              scales: {
                  y: {
                      beginAtZero: true,
                  },
              },
              plugins: {
                title: {
                    display: true,
                },
                
            }
          }
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  buscarInsumosConMasDespachosPorReceta(): void {
    this.estadisticaInsumosConMasDespachosPorReceta(this.inventario!.id, this.fechaInicial, this.fechaFinal);
  }

  estadisticaInsumosConMasDespachosPorReceta(inventarioId:number, fechaInicial: string, fechaFinal: string){
      this.inventariosService.getEstadisticaInsumosConMasDespachosPorReceta(inventarioId, fechaInicial, fechaFinal).subscribe(
      (datos: any) => {

        if (this.insumoConMasDespachosPorRecetaChart) {
          this.insumoConMasDespachosPorRecetaChart.destroy();
        }

          const insumoConMasDespachosPorReceta = document.getElementById('insumoConMasDespachosPorReceta');
          this.insumoConMasDespachosPorRecetaChart = new Chart('insumoConMasDespachosPorReceta', {
              type: 'bar',
              data: {
              labels: datos.labels,
              datasets: [{
                  label: 'Despachos por receta',
                  data: datos.data,
                  backgroundColor: datos.backgroundColor,
                  borderColor: datos.backgroundColor,
                  borderWidth: 1,
              }]
              },
              options: {
              scales: {
                  y: {
                  beginAtZero: true,
                  },
              },
              plugins: {
                  title: {
                  display: true,
                  },
              }
              }
          });
      },
      (error) => {
          console.log(error);
      }
      );
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

  inventarioIndex(inventarioId: number) {
    return this.router.navigate(['/enfermeria/almacenes', inventarioId]);
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
