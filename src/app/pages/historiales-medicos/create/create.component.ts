import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class HistorialesMedicosCreateComponent {

  historialMedicoForm: FormGroup;

  imagen: File | null = null;
  url: string | null = null;

  mensajesDeError: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    email: 'correo electrónico',
    paciente: 'tipo de paciente',
    nombre: 'nombre',
    RFC: 'RFC',
    CURP: 'CURP',
    IMSS: 'IMSS',
    sexo: 'sexo',
    fechaNacimiento: 'fecha de nacimiento',
    estadoCivil: 'estado civil',
    prefijoInternacional: 'prefijo internacional',
    telefono: 'teléfono',
  };

  constructor
  (
    private router: Router,
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService
  ) 
  {
    this.historialMedicoForm = this.formBuilder.group({
      email: [null],
      paciente: [''],
      nombre: [null],
      sexo: [''],
      fechaNacimiento: [null],
      prefijoInternacional: ['+52'],
      telefono: [null],
      CURP: [null],
      IMSS: [null],
      RFC: [''],
      estadoCivil: [''],
    });
  }


  cambiarValidaciones(tipoPaciente: string) {
    if (tipoPaciente === 'Empleado') {
      this.historialMedicoForm.get('RFC')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('CURP')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('IMSS')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('estadoCivil')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('prefijoInternacional')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('telefono')!.setValidators([Validators.required, Validators.maxLength(10)]);
      this.historialMedicoForm.get('email')!.setValidators([Validators.required, Validators.email]);
    } else {
      this.historialMedicoForm.get('RFC')!.clearValidators();
      this.historialMedicoForm.get('CURP')!.clearValidators();
      this.historialMedicoForm.get('IMSS')!.clearValidators();
      this.historialMedicoForm.get('estadoCivil')!.clearValidators();
      this.historialMedicoForm.get('prefijoInternacional')!.clearValidators();
      this.historialMedicoForm.get('telefono')!.clearValidators();
      this.historialMedicoForm.get('email')!.clearValidators();
    }
  
    // Actualiza las validaciones
    this.historialMedicoForm.get('RFC')!.updateValueAndValidity();
    this.historialMedicoForm.get('CURP')!.updateValueAndValidity();
    this.historialMedicoForm.get('IMSS')!.updateValueAndValidity();
    this.historialMedicoForm.get('estadoCivil')!.updateValueAndValidity();
    this.historialMedicoForm.get('prefijoInternacional')!.updateValueAndValidity();
    this.historialMedicoForm.get('telefono')!.updateValueAndValidity();
    this.historialMedicoForm.get('email')!.updateValueAndValidity();
  }

  imagenSeleccionada(event: any) {
    this.imagen = event.target.files[0] as File;
    this.mostrarImagen();
  }

  mostrarImagen() {
    if (this.imagen) {
      const reader = new FileReader();
      reader.readAsDataURL(this.imagen as Blob);
      reader.onload = (_event) => {
        this.url = reader.result as string;
      }
    }
  }

  findInvalidControls(formGroup: FormGroup) {
    const invalidControls: { [key: string]: any } = {};
  
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        invalidControls[key] = this.findInvalidControls(control);
      } else if (control?.invalid) {
        invalidControls[key] = control?.errors;
      }
    });
  
    return invalidControls;
  }

  guardar() {
    this.cambiarValidaciones(this.historialMedicoForm.get('paciente')!.value);
    if (!this.historialMedicoForm.invalid) {
      const historialMedico = this.historialMedicoForm.value;
  
      if (this.imagen) {
        delete historialMedico.imagen;
  
        this.historialesMedicosService.storeHistorialMedico(historialMedico, this.imagen).subscribe(
          (response) => {
            this.mensaje(response);
          },
          (error) => {
            this.error(error);
          }
        );
      } else {
        this.error({ message: 'Debes seleccionar una imagen.' });
      }
    } else {
      const camposNoValidos = Object.keys(this.historialMedicoForm.controls).filter(controlName => this.historialMedicoForm.get(controlName)?.invalid);
      const mensajes: string[] = [];
  
      camposNoValidos.forEach(controlName => {
        const control = this.historialMedicoForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });
  
      this.mensajesDeError = mensajes;
    }
  }  

  mensaje(response: any) {

    Swal.fire({
      icon: 'success',
      title: response.message,
      showConfirmButton: false,
      timer: 6500
    });

    setTimeout(() => {
      this.router.navigate(['/enfermeria/historiales-medicos']);
    }, 2000);
  }

  error(response: any) {
    Swal.fire({
      icon: 'error',
      title: response.message,
      showConfirmButton: false,
      timer: 6500 
    });
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
