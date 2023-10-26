import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HistorialesMedicos } from '../historiales-medicos';
import { NotificationService } from 'src/app/services/notification.service';
import { Observable, of } from 'rxjs';
import { ImageService } from 'src/app/services/imagen.service';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class HistorialesMedicosEditComponent implements OnInit {

  historialMedicoForm: FormGroup;
  historialMedico!: HistorialesMedicos;

  image: any;

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
    talla: 'talla',
    peso: 'peso',
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) {
    this.historialMedicoForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      paciente: ['', [Validators.required]],
      nombre: [null, [Validators.required, Validators.maxLength(254)]],
      sexo: ['', [Validators.required, Validators.maxLength(254)]],
      fechaNacimiento: [null, [Validators.required]],
      prefijoInternacional: ['+52', [Validators.required]],
      telefono: [null, [Validators.required, Validators.maxLength(10), Validators.minLength(10)]],
      CURP: ['', [Validators.required, Validators.maxLength(254)]],
      IMSS: ['', [Validators.required, Validators.maxLength(254)]],
      RFC: ['', [Validators.required, Validators.maxLength(254)]],
      estadoCivil: ['', [Validators.required, Validators.maxLength(254)]],
      peso: [null],
      talla: [null],
    });
  }

  ngOnInit() {
    const historialMedicoId = +this.route.snapshot.paramMap.get('HistorialMedico')!;
    this.historialesMedicosService.getHistorialMedico(historialMedicoId)
      .subscribe(historialMedico => {
        this.historialMedico = historialMedico;

        let paciente = '';

        switch(historialMedico.pacientable_type){
          case 'App\\Models\\NomEmpleado':
            paciente = 'Empleado';
            break;
          case 'App\\Models\\Externo':
            paciente = 'Externo';
            break;
        }

        const telefonoCompleto = historialMedico.pacientable?.telefono;
        const telefono = telefonoCompleto?.slice(-10); // Obtener los últimos 10 dígitos
        const prefijoInternacional = telefonoCompleto?.slice(0, -10); // Obtener el resto

        this.historialMedicoForm.patchValue({
          email: historialMedico.pacientable?.correo,
          paciente: paciente,
          nombre: historialMedico.pacientable?.nombre,
          sexo: historialMedico.pacientable?.sexo,
          fechaNacimiento: historialMedico.pacientable?.fechaNacimiento,
          prefijoInternacional: prefijoInternacional,
          telefono: telefono,
          CURP: historialMedico.pacientable?.curp,
          IMSS: historialMedico.pacientable?.IMSS,
          RFC: historialMedico.pacientable?.RFC,
          estadoCivil: historialMedico.pacientable?.estadoCivil,
          talla: historialMedico.talla,
          peso: historialMedico.peso,
        });

        if (historialMedico.pacientable?.image?.url) {
          this.obtenerImagen(historialMedico.pacientable?.image?.url).subscribe((imagen) => {
            this.image = imagen;
          });
        }else{
            this.image = '/assets/dist/img/user.png';
            console.log('El paciente del historial médico no tiene imagen');
        }
    });
  }

  obtenerImagen(url: string): Observable<any> {
    return this.imageService.getImagen(url).pipe(
      map((response: any) => {
        const blob = new Blob([response], { type: 'image/jpeg' });
        return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
      }),
      catchError((error) => {
        return of('/assets/dist/img/user.png');
      })
    );
  }

  cambiarValidaciones(tipoPaciente: string) {
    if (tipoPaciente === 'Empleado') {
      this.historialMedicoForm.get('RFC')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('CURP')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('IMSS')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('estadoCivil')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('prefijoInternacional')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('telefono')!.setValidators([Validators.required, Validators.maxLength(10)]);
    } else {
      this.historialMedicoForm.get('RFC')!.clearValidators();
      this.historialMedicoForm.get('CURP')!.clearValidators();
      this.historialMedicoForm.get('IMSS')!.clearValidators();
      this.historialMedicoForm.get('estadoCivil')!.clearValidators();
      this.historialMedicoForm.get('prefijoInternacional')!.clearValidators();
      this.historialMedicoForm.get('telefono')!.clearValidators();
    }
  
    // Actualiza las validaciones
    this.historialMedicoForm.get('RFC')!.updateValueAndValidity();
    this.historialMedicoForm.get('CURP')!.updateValueAndValidity();
    this.historialMedicoForm.get('IMSS')!.updateValueAndValidity();
    this.historialMedicoForm.get('estadoCivil')!.updateValueAndValidity();
    this.historialMedicoForm.get('prefijoInternacional')!.updateValueAndValidity();
    this.historialMedicoForm.get('telefono')!.updateValueAndValidity();
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
  
      if (this.imagen || this.image) {

        let imagenParaEnviar = this.imagen;
        if(!imagenParaEnviar){
          imagenParaEnviar = null;
        }
  
        this.historialesMedicosService.updateHistorialMedico(this.historialMedico.id, historialMedico, imagenParaEnviar!).subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            this.notificationService.error(error.error);
            console.log(error);
          }
        );
      } else {
        this.notificationService.error('Debes seleccionar una imagen');
        console.log('Debes seleccionar una imagen');
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
