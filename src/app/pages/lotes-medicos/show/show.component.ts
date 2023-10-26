import { Component } from '@angular/core';
import { Lotes } from 'src/app/interfaces/lotes';
import { LotesMedicosService } from '../lotes-medicos.service';
import { ActivatedRoute } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, of, ReplaySubject, forkJoin } from 'rxjs';
import { ImageService } from 'src/app/services/imagen.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MovimientosService } from 'src/app/services/movimientos.service';
import { InventariosService } from '../../inventarios/inventarios.service';
@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class LotesMedicosShowComponent {
  lote?: Lotes;

  image: any;

  inventarios: any;

  movimientoForm: FormGroup;

  public Editor = ClassicEditor;

  nombresDescriptivos: { [key: string]: string } = {
    folio: 'folio',
    profesional_id: 'profesional',
    inventario_id: 'inventario',
    motivo: 'motivo',
    detalles: 'detalles',
    tipo: 'tipo de movimiento',
    piezasDescontables: 'piezas a descontar',
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

  mensajesDeError: string[] = [];

  constructor(
    private lotesMedicosService: LotesMedicosService,
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private movimientosService: MovimientosService,
    private inventariosService: InventariosService
  ) {
    this.movimientoForm = this.formBuilder.group({
      profesional_id: [null, [Validators.required]],
      lote_id: [null, [Validators.required]],
      inventario_id: [null],
      motivo: [null, [Validators.required, Validators.maxLength(254)]],
      detalles: [null, [Validators.required, Validators.maxLength(4000)]],
      tipo: ['', [Validators.required]],
      piezasDescontables: [null],
    });
  }

  ngOnInit(): void {
    const loteId = +this.route.snapshot.paramMap.get('id')!;
    this.lotesMedicosService.getLote(loteId).subscribe(lote => {
      this.lote = lote;
      this.movimientoForm.get('lote_id')?.setValue(lote?.id);

      if (lote.insumo.image?.url) {
        this.obtenerImagen(lote.insumo?.image?.url).subscribe((imagen) => {
          this.image = imagen;
        });
      }else{
        this.image = '/assets/dist/img/image.jpg';
      }
    });

    this.userService.user$.subscribe(
      (user: any) => {
        this.movimientoForm.get('profesional_id')?.setValue(user[0].useable_id);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );

    this.movimientoForm.get('tipo')?.valueChanges.subscribe((tipo) => {
      const piezasDescontablesControl = this.movimientoForm.get('piezasDescontables');
      const inventarioIdControl = this.movimientoForm.get('inventario_id');
      if (tipo === 'Cambiar de inventario') {
        inventarioIdControl?.setValidators([Validators.required]);
      } else {
        inventarioIdControl?.setValidators([]);
      }

      if (tipo === 'Salida de piezas') {
        piezasDescontablesControl?.setValidators([Validators.required]);
      } else {
        piezasDescontablesControl?.setValidators([]);
      }
      piezasDescontablesControl?.updateValueAndValidity();
    });
    this.getInventarios();
  }

  obtenerImagen(url: string): Observable<any> {
    return this.imageService.getImagen(url).pipe(
      map((response: any) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }),
      catchError((error) => {
        return of('/assets/dist/img/user.jpg');
      })
    );
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
