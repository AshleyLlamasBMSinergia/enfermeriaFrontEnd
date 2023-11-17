
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';

@Component({
  selector: 'app-examenes-embarazo',
  templateUrl: './examenes-embarazo.component.html',
  styleUrls: ['./examenes-embarazo.component.css']
})
export class ExamenesEmbarazoComponent {
  @Input() historialMedico!: HistorialesMedicos;

  formEEmbarazo: FormGroup = this.formBuilder.group({
    historialMedico_id: [this.historialMedico?.id],
    tipo: [],
    resultado: [],
    comentarios: [],
  });

  mostrarFormularioEEmbarazo = false;

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(){
    if (this.historialMedico?.examenes_embarazo?.length == 0) {
      this.mostrarFormularioEEmbarazo = true;
    }

    this.formEEmbarazo.get('historialMedico_id')?.setValue(this.historialMedico.id);
  }

  storeEEmbarazo() {
    const formData = this.formEEmbarazo.value;

    this.historialesMedicosService.storeExamenEmbarazo(formData)
    .subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        console.error('Error al generar el examen embarazo:', error);
      }
    );
  }

  abrirFormularioEEmbarazo() {
    this.mostrarFormularioEEmbarazo = !this.mostrarFormularioEEmbarazo;
  }

  async destroyEEmbarazo(EEmbarazoId: number) {
    const confirmacion = await this.notificationService.confirmarEliminacion('examen de embarazo');

    if (confirmacion) {
      this.historialesMedicosService.destroyEEmbarazo(EEmbarazoId).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al eliminar el examen de embarazo:', error);
          this.notificationService.error('Hubo un error al eliminar el examen de embarazo');
        }
      );
    }
  }
}
