import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor
  (
    private router: Router,
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService
  ) 
  {
    this.historialMedicoForm = this.formBuilder.group({
      nickname: [null],
      email: [null],
      paciente: [''],
      nombre: [null],

      RFC: [null],
      CURP: [null],
      IMSS: [null],
      sexo: [''],
      fechaNacimiento: [null],
      estadoCivil: [''],
      prefijoInternacional: ['+52'],
      telefono: [null],
    });
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
      const invalidControls = this.findInvalidControls(this.historialMedicoForm);
      console.log('Campos inválidos:', invalidControls);
      this.error({ message: 'Faltan campos por llenar'});
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
}
