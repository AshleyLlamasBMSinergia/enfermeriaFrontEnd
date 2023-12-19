import { Component, Input } from '@angular/core';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Dependientes } from 'src/app/interfaces/dependientes';
import { ImageService } from 'src/app/services/imagen.service';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';
import { CapitalizarTextoService } from 'src/app/services/capitalizar-texto.service';


@Component({
  selector: 'app-dependientes',
  templateUrl: './dependientes.component.html',
  styleUrls: ['./dependientes.component.css']
})
export class DependientesComponent {
  @Input() historialMedico!: HistorialesMedicos;

  dependienteForm: FormGroup;

  image: any;

  //Subir imagen
  imagen: File | null = null;
  url: string | null = null;

  modoEdicion = false;
  id: number | null = null;

  dependientes!: any;

  mensajesDeError: string[] = [];
  nombresDescriptivos: { [key: string]: string } = {
    nombre: 'nombre',
    sexo: 'sexo',
    fechaNacimiento: 'fecha de nacimiento',
    parentesco: 'parentesco',
    imagen: 'fotografía'
  };
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private historialesMedicosService: HistorialesMedicosService,
    private capitalizarTextoService: CapitalizarTextoService,
    private imageService: ImageService,
    private sanitizer: DomSanitizer,
  ) {
    this.dependienteForm = this.formBuilder.group({
      empleado_id: [null],
      imagen: [null],
      nombre: [null, [Validators.required, Validators.maxLength(255)]],
      sexo: ['', [Validators.required]],
      fechaNacimiento: [null,  [Validators.required]],
      parentesco: ['', [Validators.required, Validators.maxLength(255)]],
    });
  }

  ngOnInit() {
    this.dependienteForm.get('empleado_id')?.setValue(this.historialMedico.pacientable_id);
  }

  getTextoCapitalizado(texto:any): string {
    return this.capitalizarTextoService.capitalizarTexto(texto);
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

  guardar() {
    if (this.dependienteForm.invalid) {
      const camposNoValidos = Object.keys(this.dependienteForm.controls).filter(controlName => this.dependienteForm.get(controlName)?.invalid);
      const mensajes: string[] = [];

      camposNoValidos.forEach(controlName => {
        const control = this.dependienteForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });

      this.mensajesDeError = mensajes;

    } else {
      const dependiente = this.dependienteForm.value;
      
      if(this.id){
        this.historialesMedicosService.updateDependiente(this.id, dependiente, this.imagen!).subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            console.log(error)
            this.notificationService.error(error.error);
          }
        );
      }else{
        this.historialesMedicosService.storeDependientes(dependiente, this.imagen!).subscribe(
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
  } 

  crearDependiente(){
    this.modoEdicion = false;
  }

  editarDependiente(dependiente: Dependientes) {

    this.modoEdicion = true;
    this.id = dependiente.id;

    if (dependiente?.image?.url) {
      this.obtenerImagen(dependiente?.image?.url).subscribe((imagen) => {
        this.image = imagen;
      });
    }else{
        this.image = '/assets/dist/img/user.png';
    }

    const fechaNacimiento = new Date(dependiente.fechaNacimiento);

    this.dependienteForm.setValue({
      imagen: null,
      empleado_id: dependiente.empleado_id,
      nombre: dependiente.nombre,
      sexo: dependiente.sexo,
      fechaNacimiento: fechaNacimiento,

      parentesco: dependiente.parentesco,
    });
  }

  cerrarModal(){
    this.url = null;
    this.image = null;

    this.dependienteForm.setValue({
      imagen: null,
      empleado_id: null,
      nombre: null,
      sexo: '',
      fechaNacimiento: null,
      parentesco: '',
    });
  }

  showHistorialMedico(id: number | undefined) {
    if (id !== undefined) {
        window.open(`#/enfermeria/historiales-medicos/${id}`, '_blank');

    } else {
        this.notificationService.error('No se encontró el historial médico');
    }
  }

  async destroyHistorialMedico(id: number | undefined) {
    if (id !== undefined) {
      const confirmacion = await this.notificationService.confirmarEliminacion('dependiente con sus citas');
  
      if (confirmacion) {
        this.historialesMedicosService.destroyHistorialMedico(id).subscribe(
          (response) => {
            this.notificationService.mensaje(response);
          },
          (error) => {
            console.error('Error al eliminar el dependiente:', error);
            this.notificationService.error('Hubo un error al eliminar el dependiente');
          }
        );
      }
    } else {
      this.notificationService.error('No se encontró el historial médico');
    }
  }
}
