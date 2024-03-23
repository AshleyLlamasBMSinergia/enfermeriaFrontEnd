import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { CapitalizarTextoService } from 'src/app/services/capitalizar-texto.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { UserService } from 'src/app/services/user.service';
import { CedisService } from 'src/app/services/cedis.service';
import { EstadosService } from 'src/app/services/estados.service';
import { Estados } from 'src/app/interfaces/estados';

@Component({
  providers: [DatePipe],
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class HistorialesMedicosCreateComponent {

  historialMedicoForm: FormGroup;
  formDireccion!: FormGroup;

  cedis: any;

  image: any;
  imagen: File | null = null;
  url: string | null = null;

  mensajesDeError: string[] = [];

  opcionesEmpleados: any[] = [];
  empleado: any;

  estados: Estados[] = [];
  localidades!: any;

  nombresDescriptivos: { [key: string]: string } = {
    cedi_id: 'cedi',
    email: 'correo electrónico',
    paciente: 'tipo de paciente',
    nombre: 'nombre',
    numero: 'número de empleado',
    RFC: 'RFC',
    CURP: 'CURP',
    IMSS: 'IMSS',
    sexo: 'sexo',
    fechaNacimiento: 'fecha de nacimiento',
    estadoCivil: 'estado civil',
    prefijoInternacional: 'prefijo internacional',
    telefono: 'teléfono',
    peso: 'peso',
    talla: 'talla',
    empleado_id: 'empleado',
    parentesco: 'parentesco',
    imagen: 'imagen',
  };

  constructor
  (
    private empleadosServices: EmpleadosService,
    private estadosService: EstadosService,
    private userService: UserService,
    private cedisService: CedisService,
    private capitalizarTextoService: CapitalizarTextoService,
    private router: Router,
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) 
  {
    this.formDireccion = this.formBuilder.group({
      calle: [null],
      interior: [null],
      exterior: [null],
      colonia: [null],
      CP: [null],
      localidad_id: [null],
    });

    this.historialMedicoForm = this.formBuilder.group({
      cedi_id: [null, [Validators.required]],
      email: [null],
      paciente: ['', [Validators.required]],
      nombre: [null, [Validators.required]],
      sexo: ['', [Validators.required]],
      fechaNacimiento: [null, [Validators.required]],
      prefijoInternacional: ['+52'],
      telefono: [null, [Validators.required, Validators.maxLength(10)]],
      numero: [null],
      puesto: [''],
      CURP: [null],
      IMSS: [null],
      RFC: [''],
      estadoCivil: [''],
      talla: [null, [Validators.required]],
      peso: [null, [Validators.required]],
      empleado_id: [null],
      parentesco: [null],
      imagen: [null],
      formDireccion: this.formDireccion
    });
  }

  ngOnInit(): void {
    this.userService.user$.subscribe(
      (user: any) => {
        this.cargarCedis(user[0].useable_id);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
    this.cargarOpcionesEmpleados();
    this.getEstados();
  }

  getEstados(){
    this.estadosService.getEstados().subscribe(
      (estados) => {
        this.estados = estados.map((estado: any) => ({
          id: estado.id,
          text: estado.nombre,
          localidades: estado.localidades
        }));
      },
      (error) => {
        console.error('Error al obtener los estados:', error);
      }
    );
  }

  onEstadosChange(event: any) {
    if (this.estados) {
      const estadoSeleccionado = this.estados.find(estado => estado.id === event);
      this.localidades = estadoSeleccionado?.localidades || [];
    }
  }
  
  cargarCedis(profesionalId:number){
    this.cedisService.getCedis(profesionalId).subscribe(
      (cedis) => {
        this.cedis = cedis.map((cedi: any) => ({
          id: cedi.id,
          text: cedi.nombre + ' (' + cedi.empresa.Nombre + ')',
        }));
      },
      (error) => {
        console.error('Error al obtener los cedis:', error);
      }
    );
  }

  getTextoCapitalizado(texto:any): string {
    return this.capitalizarTextoService.capitalizarTexto(texto);
  }

  cargarOpcionesEmpleados() {
    this.empleadosServices.getEmpleados().subscribe(
      (empleados) => {
        this.opcionesEmpleados = empleados.map((empleado: any) => ({
          id: empleado.id,
          text: empleado.nombre,
          empleado: empleado
        }));
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
  }
  
  onEmpleadoChange(event: any){
    if (this.opcionesEmpleados) {
      const empleadoSeleccionado = this.opcionesEmpleados.find(empleado => empleado.id === event);
      this.empleado = empleadoSeleccionado.empleado ? empleadoSeleccionado : null;
    }
  }

  cambiarValidaciones(tipoPaciente: string) {
    // this.historialMedicoForm.get('paciente')!.setValidators([Validators.required]);
    // this.historialMedicoForm.get('cedi_id')!.setValidators([Validators.required]);

    // this.historialMedicoForm.get('nombre')!.setValidators([Validators.required]);

    // this.historialMedicoForm.get('talla')!.setValidators([Validators.required]);
    // this.historialMedicoForm.get('peso')!.setValidators([Validators.required]);

    if (tipoPaciente === 'Empleado') {
      this.historialMedicoForm.get('numero')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('RFC')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('CURP')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('IMSS')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('estadoCivil')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('prefijoInternacional')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('email')!.setValidators([Validators.required]);
    } else {
      this.historialMedicoForm.get('numero')!.clearValidators();
      this.historialMedicoForm.get('RFC')!.clearValidators();
      this.historialMedicoForm.get('CURP')!.clearValidators();
      this.historialMedicoForm.get('IMSS')!.clearValidators();
      this.historialMedicoForm.get('estadoCivil')!.clearValidators();
      this.historialMedicoForm.get('prefijoInternacional')!.clearValidators();
      this.historialMedicoForm.get('email')!.clearValidators();
    }

    
    if (tipoPaciente === 'Dependiente') {
      this.historialMedicoForm.get('empleado_id')!.setValidators([Validators.required]);
      this.historialMedicoForm.get('parentesco')!.setValidators([Validators.required, Validators.maxLength(254)]);
      this.historialMedicoForm.get('telefono')!.setValidators([Validators.nullValidator, Validators.maxLength(254)]);

      this.historialMedicoForm.get('telefono')!.updateValueAndValidity();
    } else {
      this.historialMedicoForm.get('empleado_id')!.clearValidators();
      this.historialMedicoForm.get('parentesco')!.clearValidators();
    }

    // Actualiza las validaciones
    this.historialMedicoForm.get('numero')!.updateValueAndValidity();
    this.historialMedicoForm.get('RFC')!.updateValueAndValidity();
    this.historialMedicoForm.get('CURP')!.updateValueAndValidity();
    this.historialMedicoForm.get('IMSS')!.updateValueAndValidity();
    this.historialMedicoForm.get('estadoCivil')!.updateValueAndValidity();;
    this.historialMedicoForm.get('email')!.updateValueAndValidity();

    this.historialMedicoForm.get('empleado_id')!.updateValueAndValidity();
    this.historialMedicoForm.get('parentesco')!.updateValueAndValidity();
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

  guardarImagenDesdeUrl(url: string) {
    const xhr = new XMLHttpRequest();

    xhr.onload = () => {
      const blob = xhr.response;

      // Convierte el blob a cadena Base64
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;

        // Guarda la cadena Base64 en tu formulario
        this.historialMedicoForm.get('imagen')?.setValue(base64String);
      };

      reader.readAsDataURL(blob);
    };

    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }


  buscarEmpleado() {
    this.historialesMedicosService.buscarHistorialMedico(this.historialMedicoForm.get('cedi_id')?.value ,this.historialMedicoForm.get('numero')!.value).subscribe(
      (response) => {

        console.log(response);
        const empleado = response[0][0];

        const url = response[1];

        this.url = url;
        this.guardarImagenDesdeUrl(url);

        this.historialMedicoForm.get('nombre')?.setValue(empleado.Nombre);
        this.historialMedicoForm.get('RFC')?.setValue(empleado.RFC);
        this.historialMedicoForm.get('CURP')?.setValue(empleado.Curp);
        this.historialMedicoForm.get('sexo')?.setValue(empleado.Sexo);
        this.historialMedicoForm.get('fechaNacimiento')?.setValue(
          this.datePipe.transform(empleado.FechaNacimiento, 'yyyy-MM-dd')
        );
        this.historialMedicoForm.get('estadoCivil')?.setValue(empleado.EstadoCivil);
        this.historialMedicoForm.get('telefono')?.setValue(empleado.Telefono);
        this.historialMedicoForm.get('email')?.setValue(empleado.Correo);
        this.historialMedicoForm.get('puesto')?.setValue(empleado.Puesto);

        this.formDireccion.get('calle')?.setValue(empleado.Calle);
        this.formDireccion.get('interior')?.setValue(empleado.Interior);
        this.formDireccion.get('exterior')?.setValue(empleado.Exterior);
        this.formDireccion.get('colonia')?.setValue(empleado.Colonia);
      },
      (error) => {
        this.error(error);
      }
    );
  }

  guardar() {
    this.cambiarValidaciones(this.historialMedicoForm.get('paciente')!.value);
    if (!this.historialMedicoForm.invalid) {
      const historialMedico = this.historialMedicoForm.value;
      this.historialesMedicosService.storeHistorialMedico(historialMedico, this.imagen!).subscribe(
        (response) => {
          this.mensaje(response);
        },
        (error) => {
          this.error(error);
        }
      );
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
