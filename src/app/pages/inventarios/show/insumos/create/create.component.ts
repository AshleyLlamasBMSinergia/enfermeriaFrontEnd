import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { NotificationService } from 'src/app/services/notification.service';
import { Component } from '@angular/core';
import { InsumosMedicosService } from 'src/app/pages/insumos-medicos/insumos-medicos.service';
import { Insumos } from 'src/app/interfaces/insumos';
import { Observable, of } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { catchError, map } from 'rxjs/operators';
import { ImageService } from 'src/app/services/imagen.service';
import { Reactivos } from 'src/app/interfaces/reactivos';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class InsumoCreateComponent {

  opcionesInsumos: any[] = [];
  mostrarGenerarInsumoMedicoForm: boolean = false;
  
  insumo!: Insumos | null;
  image: any;

  reactivos: any[] = [];

  generarInsumoMedicoForm: FormGroup;
  agregarInsumoMedicoForm: FormGroup;

  imagen: File | null = null;
  url: string | null = null;

  public Editor = ClassicEditor;

  nombresDescriptivos: { [key: string]: string } = {
    nombre: 'nombre',
    piezasPorLote: 'piezas por lote',
    descripcion: 'descripción',
    precio: 'precio',
  };

  mensajesDeError: string[] = [];

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

  constructor
  (
    private router: Router,
    private formBuilder: FormBuilder,
    private insumosMedicosService: InsumosMedicosService,
    private notificationService: NotificationService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private imageService: ImageService
  ) 
  {
    const inventarioId = this.route.snapshot.paramMap.get('inventarioId');

    this.cargarOpcionesInsumos(inventarioId!);

    this.generarInsumoMedicoForm = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.maxLength(254)]],
      piezasPorLote: [null, [Validators.required]],
      descripcion: [null, [Validators.maxLength(40000)]],
      precio: [null, [Validators.required]],
      inventario_id: [inventarioId, Validators.required],
      reactivos: [[]]
    });

    this.agregarInsumoMedicoForm = this.formBuilder.group({
      insumo_id: [null, Validators.required],
      inventario_id: [inventarioId, Validators.required],
    });

    this.getReactivos();
  }

  togglegenerarInsumoMedicoForm(){
    this.mostrarGenerarInsumoMedicoForm = !this.mostrarGenerarInsumoMedicoForm;
  }

  getReactivos(){
    this.insumosMedicosService.getReactivos().subscribe(
      (reactivos) => {
        this.reactivos = reactivos.map((reactivo: any) => ({
          id: reactivo.id,
          text: reactivo.nombre,
        }));
      },
      (error) => {
        console.log(error);
      }
    );
  }

  cargarDatosInsumo($id: number) {

    this.insumosMedicosService.getInsumo($id)
      .subscribe(insumo => {
        
        this.insumo = insumo;

        if (insumo.image?.url) {
          this.obtenerImagen(insumo.image?.url).subscribe((imagen) => {
            this.image = imagen;
          });
        }else{
          this.image = '/assets/dist/img/image.jpg';
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
        console.log(error);
        return of('/assets/dist/img/image.jpg');
      })
    );
  }

  cargarOpcionesInsumos(inventarioId: string) {
    this.insumosMedicosService.getInsumosQueNoTieneInventario(inventarioId).subscribe(
      (insumos) => {
        this.opcionesInsumos = insumos.map((insumo: any) => ({
          id: insumo.id,
          text: insumo.nombre,
        }));
      },
      (error) => {
        console.error('Error al obtener empleados:', error);
      }
    );
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

  generarInsumo() {
    if (!this.generarInsumoMedicoForm.invalid) {
      const insumosMedicos = this.generarInsumoMedicoForm.value;
  
      if (this.imagen) {
        delete insumosMedicos.imagen;
        this.insumosMedicosService.storeInsumo(insumosMedicos, this.imagen).subscribe(
          (response) => {
            this.notificationService.mensaje(response);
            const inventarioId = this.generarInsumoMedicoForm.value.inventario_id;
            this.router.navigate(['/enfermeria/inventarios', inventarioId]);
          },
          (error) => {
            this.notificationService.error(error);
          }
        );
      } else {
        this.notificationService.error('Debes seleccionar una imagen.');
      }
    } else {
      const camposNoValidos = Object.keys(this.generarInsumoMedicoForm.controls).filter(controlName => this.generarInsumoMedicoForm.get(controlName)?.invalid);
      const mensajes: string[] = [];
  
      camposNoValidos.forEach(controlName => {
        const control = this.generarInsumoMedicoForm.get(controlName)!;
        const errores = this.obtenerMensajesDeError(control).join(', ');
        mensajes.push(`El campo ${this.nombresDescriptivos[controlName]} ${errores}`);
      });
  
      this.mensajesDeError = mensajes;
    }
  }

  agregarInsumo() {
    if (!this.agregarInsumoMedicoForm.invalid) {
      const insumosMedicos = this.agregarInsumoMedicoForm.value;
  
      this.insumosMedicosService.addInsumo(insumosMedicos).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
          const inventarioId = this.agregarInsumoMedicoForm.value.inventario_id;
          this.router.navigate(['/enfermeria/inventarios', inventarioId]);
        },
        (error) => {
          this.notificationService.error(error);
        }
      );

    } else {
      const camposNoValidos = Object.keys(this.agregarInsumoMedicoForm.controls).filter(controlName => this.agregarInsumoMedicoForm.get(controlName)?.invalid);
      const mensajes: string[] = [];
  
      camposNoValidos.forEach(controlName => {
        const control = this.agregarInsumoMedicoForm.get(controlName)!;
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
