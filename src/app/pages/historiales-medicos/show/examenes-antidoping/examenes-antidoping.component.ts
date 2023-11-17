
import { Component, Input } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';

@Component({
  selector: 'app-examenes-antidoping',
  templateUrl: './examenes-antidoping.component.html',
  styleUrls: ['./examenes-antidoping.component.css']
})
export class ExamenesAntidopingComponent {
  @Input() historialMedico!: HistorialesMedicos;

  formEAntidoping: any;

  mostrarFormularioEAntidoping = false;

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService
  ) {
  }

  sustancias = [
    { id: 'Cocaina', text: 'Cocaina' },
    { id: 'THC', text: 'THC' },
    { id: 'Anfetaminas', text: 'Anfetaminas' },
    { id: 'Metanfetaminas', text: 'Metanfetaminas' },
    { id: 'Heroina', text: 'Heroina' },
  ];

  ngOnInit(){
    this.formEAntidoping = this.formBuilder.group({
      tipo: [null],
      examen: [null],
      historialMedico_id: [this.historialMedico?.id],
      sustancias: [[]] 
    });

    if (this.historialMedico?.examenes_antidoping?.length == 0) {
      this.mostrarFormularioEAntidoping = true;
    }

    this.formEAntidoping.get('historialMedico_id')?.setValue(this.historialMedico.id);
  }

  storeEAntidoping() {
    const formData = this.formEAntidoping.value;

    this.historialesMedicosService.storeExamenAntidoping(formData)
    .subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        console.error('Error al generar el examen antidoping:', error);
      }
    );
  }

  abrirFormularioEAntidoping() {
    this.mostrarFormularioEAntidoping = !this.mostrarFormularioEAntidoping;
  }


  async destroyEAntidoping(EAntidopingId: number) {
    const confirmacion = await this.notificationService.confirmarEliminacion('examen de antidoping');

    if (confirmacion) {
      this.historialesMedicosService.destroyEAntidoping(EAntidopingId).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al eliminar el examen de antidoping:', error);
          this.notificationService.error('Hubo un error al eliminar el examen de antidoping');
        }
      );
    }
  }
}
