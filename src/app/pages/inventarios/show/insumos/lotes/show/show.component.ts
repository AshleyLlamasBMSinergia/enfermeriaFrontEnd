import { Component } from '@angular/core';
import { Lotes } from 'src/app/interfaces/lotes';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { LotesMedicosService } from 'src/app/pages/lotes-medicos/lotes-medicos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageService } from 'src/app/services/imagen.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { MovimientosService } from 'src/app/services/movimientos.service';
@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class LotesShowComponent {
  lote?: Lotes | null;

  movimientoForm: FormGroup ;

  paginaActual = 1;
  elementosPorPagina = 10;

  image: any;

  movimientoTipos: any = [];

  mensajesDeError: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    profesional_id: 'profesional',
    inventario_id: 'inventario',
    lote_id: 'lote',
    movimientoTipo: 'tipo de movimiento',
    piezasIngresables: 'piezas a ingresar',
    piezasDescontables: 'piezas a descontar',
  };

  constructor(
    private notificationService: NotificationService,
    private lotesMedicosService: LotesMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private movimientosService: MovimientosService
  )
  {
    this.route.params.subscribe(params => {
      const inventarioId = params['inventarioId']; // Obtén el ID del inventario
      const insumoId = params['insumoId']; // Obtén el ID del insumo
      const loteId = params['loteId']; // Obtén el ID del insumo

      this.lotesMedicosService.getLotesPorInventario(inventarioId, loteId)
        .subscribe(lote => {
          
          this.lote = lote;
        
          if (lote.insumo.image?.url) {
            this.obtenerImagen(lote.insumo.image?.url).subscribe((imagen) => {
              this.image = imagen;
            });
          }else{
            this.image = '/assets/dist/img/image.jpg';
          }
      });
    });

    this.movimientoForm = this.formBuilder.group({
      profesional_id: [null, [Validators.required]],
      lote_id: [null, [Validators.required]],
      inventario_id: [null],
      movimientoTipo: ['', [Validators.required]],
      // piezasDescontables: [null, [Validators.max(this.lote!.insumo.piezasPorLote)]],
      // piezasIngresables: [null, [Validators.max(this.lote!.piezasDisponibles)]]
    });

    this.userService.user$.subscribe(
      (user: any) => {
        this.movimientoForm.get('profesional_id')?.setValue(user[0].useable_id);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

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

  // ngOnInit(): void {
  //   this.getLote();
  // }
  
  // getLote() {
  //   this.route.params.subscribe(params => {
  //     const inventarioId = params['inventarioId']; // Obtén el ID del inventario
  //     const insumoId = params['insumoId']; // Obtén el ID del insumo
  //     const loteId = params['loteId']; // Obtén el ID del insumo

  //     this.lotesMedicosService.getLotesPorInventario(inventarioId, loteId)
  //       .subscribe(lote => {
          
  //         this.lote = lote;
        
  //         this.movimientoForm.addControl('piezasIngresables', this.formBuilder.control(null, [Validators.required, Validators.max(lote.insumo.piezasPorLote)]));
  //         this.movimientoForm.addControl('piezasDescontables', this.formBuilder.control(null, [Validators.required, Validators.max(lote.piezasDisponibles)]));
  
  //         if (lote.insumo.image?.url) {
  //           this.obtenerImagen(lote.insumo.image?.url).subscribe((imagen) => {
  //             this.image = imagen;
  //           });
  //         }else{
  //           this.image = '/assets/dist/img/image.jpg';
  //         }
  //     });
  //   });
  // }

  obtenerImagen(url: string): Observable<any> {
    return this.imageService.getImagen(url).pipe(
      map((response: any) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }),
      catchError((error) => {
        console.log(error);
        return of('/assets/dist/img/image.jpg');
      })
    );
  }

  guardar() {
    if (!this.movimientoForm.invalid) {
      const movimiento = this.movimientoForm.value;
  
      this.movimientosService.storeMovimiento(movimiento).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          this.notificationService.error(error.error);
          console.log(error);
        }
      );
    } else {
      const camposNoValidos = Object.keys(this.movimientoForm.controls).filter(controlName => this.movimientoForm.get(controlName)?.invalid);
      const mensajes: string[] = [];
  
      camposNoValidos.forEach(controlName => {
        const control = this.movimientoForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });
  
      this.mensajesDeError = mensajes;
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
