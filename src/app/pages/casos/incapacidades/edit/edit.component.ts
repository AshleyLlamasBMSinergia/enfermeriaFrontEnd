import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Incapacidades } from 'src/app/interfaces/incapacidades';
import { IncapacidadesService } from 'src/app/services/incapacidades.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-incapacidades-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class incapacidadesEditComponent {
  @Input() incapacidad!: Incapacidades;

  formIncapacitacion: FormGroup;

  tipoIncidencias!: any[];

  mensajesDeError: string[] = [];
  nombresDescriptivos: { [key: string]: string } = {
    TipoIncidencia: 'tipo de incidencia',
  };

  constructor(
    private formBuilder: FormBuilder,
    private incapacidadesService: IncapacidadesService,
    private notificationService: NotificationService
  ) {
    this.formIncapacitacion = this.formBuilder.group({
      TipoIncidencia: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getTipoIncidencias();

    this.formIncapacitacion.get('TipoIncidencia')?.setValue(this.incapacidad?.TipoIncidencia);
  }

  getTipoIncidencias(){
    this.incapacidadesService.getTipoIncidencias().subscribe(
      (tipoIncidencias) => {
        this.tipoIncidencias = tipoIncidencias;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  guardar() {
    if (this.formIncapacitacion.invalid) {
      const camposNoValidos = Object.keys(this.formIncapacitacion.controls).filter(controlName => this.formIncapacitacion.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        const control = this.formIncapacitacion.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {
      const incapacidad = this.formIncapacitacion.value;
      
      this.incapacidadesService.update(this.incapacidad.id, incapacidad).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.log(error)
          this.notificationService.error(error.error);
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
          case 'email':
            mensajes.push(' no es valido');
            break;
          case 'diasNoNegativos':
            mensajes.push('no puede estar en negativo');
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
