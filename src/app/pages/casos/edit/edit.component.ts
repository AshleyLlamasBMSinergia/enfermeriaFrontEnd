import { Component, Input } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Casos } from 'src/app/interfaces/casos';
import { CasosService } from 'src/app/services/casos.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-casos-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class CasosEditComponent {
  @Input() caso!: Casos;

  formCaso: FormGroup;

  mensajesDeError: string[] = [];
  nombresDescriptivos: { [key: string]: string } = {
    estatus: 'estatus',
    doctos: 'doctos',
  };

  constructor(
    private formBuilder: FormBuilder,
    private casosService: CasosService,
    private notificationService: NotificationService
  ) {
    this.formCaso = this.formBuilder.group({
      estatus: [null, [Validators.required]],
      doctos: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formCaso.get('estatus')?.setValue(this.caso?.estatus);
    this.formCaso.get('doctos')?.setValue(this.caso?.doctos);
  }

  guardar() {
    if (this.formCaso.invalid) {
      const camposNoValidos = Object.keys(this.formCaso.controls).filter(controlName => this.formCaso.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        const control = this.formCaso.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {
      const caso = this.formCaso.value;
      
      this.casosService.update(this.caso.id, caso).subscribe(
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
