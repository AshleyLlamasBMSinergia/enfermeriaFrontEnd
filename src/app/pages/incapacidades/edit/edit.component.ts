import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormControlName, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicosService } from '../../historiales-medicos/historiales-medicos.service';
import { IncapacidadesService } from '../incapacidades.service';
import { ImageService } from 'src/app/services/imagen.service';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpleadosService } from 'src/app/services/empleados.service';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class IncapacidadesEditComponent {
  formIncapacidad: FormGroup;

  profesional: any;
  imageProfesional: any;
  imageEmpleado: any;

  empleado?: any;
  historialMedico?: HistorialesMedicos;

  zonasAfectadas: any[] = [];

  public Editor = ClassicEditor;
  mensajesDeError: string[] = [];

  private isUpdating = false;

  consecuentesOpciones: string[] = [];

  nombresDescriptivos: { [key: string]: string } = {
    tipo: 'tipo de incapacidad',
    consecuente: 'consecuente de la incapacidad',
    fechaInicial: 'fecha inicial',
    fechaTermino: 'fecha de termino',
    fechaProxRevision: 'fecha de la proxima revisión',
    calificacionAccidente: 'calificación del accidente',
    causa: 'causa',
    diagnostico: 'diagnóstico',
    observaciones: 'observaciones',
    empleado_id: 'empleado',
    profesional_id: 'profesional',
    zonasAfectadas: 'zonas afectadas',
    dias: 'días'
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

  dias!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private imageService: ImageService,
    private empleadosService: EmpleadosService,
    private incapacidadesService: IncapacidadesService,
    private historialesMedicosService: HistorialesMedicosService,
    private sanitizer: DomSanitizer,
    private notificationService: NotificationService
  ) {
    this.formIncapacidad = this.formBuilder.group({
      tipo: ['', [Validators.required]],
      consecuente: ['', [Validators.required]],
      fechaInicial: [null, Validators.required],
      fechaTermino: [null],
      calificacionAccidente: [null, [Validators.required]],
      dias: [null, [this.diasNoNegativos()]],
      causa: [null],
      diagnostico: [null],
      observaciones: [null],
      empleado_id: [null, [Validators.required]],
      profesional_id: [null, [Validators.required]],
      zonasAfectadas: [[]]
    });
  }

  diasNoNegativos(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const dias = control.value;
  
      // Verificar si días es un número y no es negativo
      if (isNaN(dias) || dias < 0) {
        return { 'diasNoNegativos': true };
      }
  
      return null;  // La validación pasa
    };
  }

  // ngOnInit(): void {
  //   this.inicializarControles();
  //   this.getZonasAfectadas();
  // }
}
