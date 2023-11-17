
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';

@Component({
  selector: 'app-examenes-fisicos',
  templateUrl: './examenes-fisicos.component.html',
  styleUrls: ['./examenes-fisicos.component.css']
})
export class ExamenesFisicosComponent {
  @Input() historialMedico!: HistorialesMedicos;

  formEFisico: FormGroup = this.formBuilder.group({
    TA: [null],
    FR: [null],
    peso: [null],
    TC: [null],
    temperatura: [null],
    talla: [null],
    estadoConciencia: [null],
    coordinacion: [null],
    equilibrio: [null],
    marcha: [null],
    orientacion: [null],
    orientacionTiempo: [null],
    orientacionPersona: [null],
    orientacionEspacio: [null],
    historialMedico_id: [this.historialMedico?.id],

    //Cabeza
    craneo: [null],
    ojos: [null],
    nariz: [null],
    boca: [null],
    cuello: [null],
    Cobservaciones: [null],

    //Torax
    camposPulmonares: [null],
    ampAmplex: [null],
    ruidoPulmonar: [null],
    transVoz: [null],
    areaPrecordial: [null],
    FC: [null],
    tono: [null],
    ritmo: [null],
    Tobservaciones: [null],

    // Abdomen
    pared: [null],
    peristalsis: [null],
    visceromegalias: [null],
    hernias: [null],
    Aobservaciones: [null],

    // Extremidades
    toraxicas: [null],
    hombro: [null],
    codo: [null],
    muneca: [null],
    pie: [null],
    movilidad: [null],
    pelvicas: [null],
    cadera: [null],
    rodilla: [null],
    tobillo: [null],
    mano: [null],
    fuerza: [null],
    Eobservaciones: [null],

    // Columna vertebral
    lordosis: [null],
    flexion: [null],
    lateralizacion: [null],
    puntosDolor: [null],
    xifosis: [null],
    extension: [null],
    rotacion: [null],
    otros: [null],
    CVobservaciones: [null],

    //Organos de los sentidos
    vista: [null],
    oido: [null],
    olfato: [null],
    tacto: [null],
    OSobservaciones: [null],
  });

  mostrarFormularioEFisico = false;

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(){
    if (this.historialMedico?.examenes_fisicos?.length == 0) {
      this.mostrarFormularioEFisico = true;
    }

    this.formEFisico.get('historialMedico_id')?.setValue(this.historialMedico.id);
  }

  storeEFisico() {
    const formData = this.formEFisico.value;

    this.historialesMedicosService.storeExamenesFisicos(formData)
    .subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        console.error('Error al generar los exámenes físicos:', error);
      }
    );
  }

  abrirFormularioEFisico() {
    this.mostrarFormularioEFisico = !this.mostrarFormularioEFisico;
  }

  async destroyEFisico(EFisicoId: number) {
    const confirmacion = await this.notificationService.confirmarEliminacion('examen físico');

    if (confirmacion) {
      this.historialesMedicosService.destroyEFisico(EFisicoId).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al eliminar el examen físico:', error);
          this.notificationService.error('Hubo un error al eliminar el examen físico');
        }
      );
    }
  }
}
