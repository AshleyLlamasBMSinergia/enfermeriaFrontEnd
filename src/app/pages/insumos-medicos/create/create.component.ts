import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { InsumosMedicosService } from '../insumos-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { Component, Output, EventEmitter } from '@angular/core';
import { InventarioDataService } from '../../inventarios/inventario-data.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class InsumosMedicosCreateComponent {

  insumosMedicosForm: FormGroup;

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
    private inventarioDataService: InventarioDataService
  ) 
  {
    const inventarioId = this.route.snapshot.paramMap.get('inventario_id');

    this.insumosMedicosForm = this.formBuilder.group({
      nombre: [null, [Validators.required, Validators.maxLength(254)]],
      piezasPorLote: [null, [Validators.required]],
      descripcion: [null, [Validators.required, Validators.maxLength(40000)]],
      precio: [null, [Validators.required]],
      inventario_id: [inventarioId, Validators.required],
    });
  }

  ngOnInit() {
    this.inventarioDataService.inventarioId$.subscribe(id => {
      this.insumosMedicosForm.get('inventario_id')?.setValue(id);
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

  guardar() {
    if (!this.insumosMedicosForm.invalid) {
      const insumosMedicos = this.insumosMedicosForm.value;
  
      if (this.imagen) {
        delete insumosMedicos.imagen;
        this.insumosMedicosService.storeInsumo(insumosMedicos, this.imagen).subscribe(
          (response) => {
            this.notificationService.mensaje(response);
            const inventarioId = this.insumosMedicosForm.value.inventario_id;
            this.router.navigate(['/enfermeria/inventarios', inventarioId]);
          },
          (error) => {
            this.notificationService.error(error.error);
          }
        );
      } else {
        this.notificationService.error('Debes seleccionar una imagen.');
      }
    } else {
      const camposNoValidos = Object.keys(this.insumosMedicosForm.controls).filter(controlName => this.insumosMedicosForm.get(controlName)?.invalid);
      const mensajes: string[] = [];
  
      camposNoValidos.forEach(controlName => {
        const control = this.insumosMedicosForm.get(controlName)!;
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
