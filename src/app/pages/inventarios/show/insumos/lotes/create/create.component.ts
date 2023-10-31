import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LotesMedicosService } from 'src/app/pages/lotes-medicos/lotes-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UserService } from 'src/app/services/user.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class LotesCreateComponent {
  lotesMedicosForm: FormGroup;

  public Editor = ClassicEditor;

  nombresDescriptivos: { [key: string]: string } = {
    lote: 'lote',
    fechaCaducidad: 'fecha de caducidad',
    piezasDisponibles: 'piezas disponibles',
    insumo_id: 'insumo',
    profesional_id:'profesional_id',
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
    private lotesMedicosService: LotesMedicosService,
    private userService: UserService,
  ) 
  {
    this.lotesMedicosForm = this.formBuilder.group({
      lote: [null, [Validators.required, Validators.maxLength(254)]],
      fechaCaducidad: [null, [Validators.required]],
      piezasDisponibles: [null, [Validators.required]],
      insumo_id:  [null, [Validators.required]],
      profesional_id:  [null, [Validators.required]],
      inventario_id:  [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const inventarioId = params['inventarioId']; // Obtén el ID del inventario
      const insumoId = params['insumoId']; // Obtén el ID del insumo

      this.lotesMedicosForm.get('inventario_id')?.setValue(inventarioId);
      this.lotesMedicosForm.get('insumo_id')?.setValue(insumoId);
    });

    this.userService.user$.subscribe(
      (user: any) => {
        this.lotesMedicosForm.get('profesional_id')?.setValue(user[0].useable_id);
      },
      (error) => {
        console.error('Error al obtener los datos del usuario', error);
      }
    );
  }

  guardar() {
    if (!this.lotesMedicosForm.invalid) {
      const lotesMedicos = this.lotesMedicosForm.value;
  
      this.lotesMedicosService.storeLote(lotesMedicos).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
          this.router.navigate([
            '/enfermeria/inventarios', 
            this.lotesMedicosForm.get('inventario_id')?.value, 
            'insumos', 
            this.lotesMedicosForm.get('insumo_id')?.value
          ]);
          
        },
        (error) => {
          this.notificationService.error(error.error);
          console.log(error);
        }
      );
    } else {
      const camposNoValidos = Object.keys(this.lotesMedicosForm.controls).filter(controlName => this.lotesMedicosForm.get(controlName)?.invalid);
      const mensajes: string[] = [];
  
      camposNoValidos.forEach(controlName => {
        const control = this.lotesMedicosForm.get(controlName)!;
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
