import { HistorialesMedicos } from '../../historiales-medicos';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup} from '@angular/forms';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-examenes-vista',
  templateUrl: './examenes-vista.component.html',
  styleUrls: ['./examenes-vista.component.css']
})
export class ExamenesVistaComponent {
  @Input() historialMedico!: HistorialesMedicos;

  formEVista: FormGroup = this.formBuilder.group({
    historialMedico_id: [this.historialMedico?.id],
    tipo: [],
    necesitaLentes: [],
    usaLentes: [],
    comentarios: [],
  });

  mostrarFormularioEVista = false;

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(){
    if (this.historialMedico?.examenes_vista?.length == 0) {
      this.mostrarFormularioEVista = true;
    }

    this.formEVista.get('historialMedico_id')?.setValue(this.historialMedico.id);
  }

  abrirFormularioEVista() {
    this.mostrarFormularioEVista = !this.mostrarFormularioEVista;
  }

  storeEVista() {
    const formData = this.formEVista.value;

    this.historialesMedicosService.storeExamenVista(formData)
    .subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        console.error('Error al generar el examen de vista:', error);
      }
    );
  }

  async destroyEVista(EVistaId: number) {
    const confirmacion = await this.notificationService.confirmarEliminacion('examen de vista');

    if (confirmacion) {
      this.historialesMedicosService.destroyEVista(EVistaId).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al eliminar el examen de vista:', error);
          this.notificationService.error('Hubo un error al eliminar el examen de vista');
        }
      );
    }
  }
}
