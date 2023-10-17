import { Lotes } from 'src/app/interfaces/lotes';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { Component, Input } from '@angular/core';
import { MovimientosService } from 'src/app/services/movimientos.service';

@Component({
  selector: 'app-movimiento',
  templateUrl: './movimiento.component.html',
  styleUrls: ['./movimiento.component.css']
})
export class MovimientoComponent {
  movimientoForm: FormGroup;
  @Input() lote?: Lotes;

  public Editor = ClassicEditor;

  nombresDescriptivos: { [key: string]: string } = {
    folio: 'folio',
    profesional_id: 'profesional',
    lote_id: 'lote',
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

  constructor
  (
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private movimientosService: MovimientosService,
    private userService: UserService,
  ) 
  {
    this.movimientoForm = this.formBuilder.group({
      folio: [null, [Validators.required, Validators.maxLength(254)]],
      profesional_id: [null, [Validators.required]],
      lote_id: [null, [Validators.required]],
      motivo: [null, [Validators.required, Validators.maxLength(254)]],
      detalles: [null, [Validators.required, Validators.maxLength(4000)]],
      tipo: ['', [Validators.required]],
      piezasDescontables: [null],
    });
  }

  ngOnInit() {
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
      if (tipo === 'Salida de piezas') {
        // Si el tipo es 'Salida de piezas', hacer el campo requerido
        piezasDescontablesControl?.setValidators([Validators.required]);
      } else {
        // En otros casos, eliminar las validaciones requeridas
        piezasDescontablesControl?.setValidators([]);
      }
      // Actualizar el control
      piezasDescontablesControl?.updateValueAndValidity();
    });
    
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
