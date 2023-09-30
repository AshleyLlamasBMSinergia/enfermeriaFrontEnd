import { HistorialesMedicos } from '../../historiales-medicos';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-antecedentes-personales-no-patologicos',
  templateUrl: './antecedentes-personales-no-patologicos.component.html',
  styleUrls: ['./antecedentes-personales-no-patologicos.component.css']
})
export class AntecedentesPersonalesNoPatologicosComponent {
  @Input() historialMedico!: HistorialesMedicos;

  editandoAPNPatologicos: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(){
    this.formAPNPatologicos.get('historialMedico_id')?.setValue(this.historialMedico.id);
  }

  formAPNPatologicos: FormGroup = this.formBuilder.group({
    historialMedico_id: [this.historialMedico?.id],
    anticonceptivos: [''],
    espAnticonceptivos: [''],
    obstetrico: [''],
    espObstetrico: [''],
    menarca: [''],
    espMenarca: [''],
    alcoholismo: [''],
    tabaquismo: [''],
    toxicomanias: [''],
    espToxicomanias: [''],
    religion: [''],
    espReligion: [''],
    pasatiempos: [''],
    tipoYRH: [''],
    inmunizaciones: [''],
    espInmunizaciones: [''],
    alimentacion: [''],
    aseoPersonal: [''],
    deportes: [''],
    espDeportes: [''],
    bajo: [''],
    sobrePeso: [''],
    hacinamiento: [''],
    promiscuidad: [''],
  });

  espFieldsAPNPatologicos: { [key: string]: string } = {
    cirujias: 'espCirujias',
    anticonceptivos: 'espAnticonceptivos',
    obstetrico: 'espObstetrico',
    menarca: 'espMenarca',
    toxicomanias: 'espToxicomanias',
    religion: 'espReligion',
    inmunizaciones: 'espInmunizaciones',
    deportes: 'espDeportes',
  };

  // APNPatologicos
  guardarAPNPatologicos() {
    if (this.editandoAPNPatologicos) {
      this.updateAntecedentesPersonalesNoPatologicos();
    } else {
      this.storeAntecedentesPersonalesNoPatologicos();
    }
  }

  private mapMainToespFieldsAPNPatologicos(formData: any, espFieldsAPNPatologicos: { [key: string]: string }) {
    for (const mainField in espFieldsAPNPatologicos) {
      if (espFieldsAPNPatologicos.hasOwnProperty(mainField)) {
        const espField = espFieldsAPNPatologicos[mainField];
        const mainValue = formData[mainField];

        if (mainValue === 'No') {
          formData[espField] = this.espFieldsAPNPatologicos[espField];
        }
      }
    }
  }

  storeAntecedentesPersonalesNoPatologicos() {
    const formData = this.formAPNPatologicos.value;
    this.mapMainToespFieldsAPNPatologicos(formData, this.espFieldsAPNPatologicos);

    this.historialesMedicosService.storeAntecedentespersonalesNoPatologicos(formData)
    .subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        console.error('Error al generar los antecedentes personales no patológicos:', error);
      }
    );
  }

  editAntecedentesPersonalesNoPatologicos(){
    this.editandoAPNPatologicos = true;

    this.formAPNPatologicos.patchValue({
      anticonceptivos: this.historialMedico?.antecedentes_personales_no_patologicos?.anticonceptivos || '',
      espAnticonceptivos: this.historialMedico?.antecedentes_personales_no_patologicos?.espAnticonceptivos || '',
      obstetrico: this.historialMedico?.antecedentes_personales_no_patologicos?.obstetrico || '',
      espObstetrico: this.historialMedico?.antecedentes_personales_no_patologicos?.espObstetrico || '',
      menarca: this.historialMedico?.antecedentes_personales_no_patologicos?.menarca || '',
      espMenarca: this.historialMedico?.antecedentes_personales_no_patologicos?.espMenarca || '',
      alcoholismo: this.historialMedico?.antecedentes_personales_no_patologicos?.alcoholismo || '',
      tabaquismo: this.historialMedico?.antecedentes_personales_no_patologicos?.tabaquismo || '',
      toxicomanias: this.historialMedico?.antecedentes_personales_no_patologicos?.toxicomanias || '',
      espToxicomanias: this.historialMedico?.antecedentes_personales_no_patologicos?.espToxicomanias || '',
      religion: this.historialMedico?.antecedentes_personales_no_patologicos?.religion || '',
      espReligion: this.historialMedico?.antecedentes_personales_no_patologicos?.espReligion || '',
      pasatiempos: this.historialMedico?.antecedentes_personales_no_patologicos?.pasatiempos || '',
      tipoYRH: this.historialMedico?.antecedentes_personales_no_patologicos?.tipoYRH || '',
      inmunizaciones: this.historialMedico?.antecedentes_personales_no_patologicos?.inmunizaciones || '',
      espInmunizaciones: this.historialMedico?.antecedentes_personales_no_patologicos?.espInmunizaciones || '',
      alimentacion: this.historialMedico?.antecedentes_personales_no_patologicos?.alimentacion || '',
      aseoPersonal: this.historialMedico?.antecedentes_personales_no_patologicos?.aseoPersonal || '',
      deportes: this.historialMedico?.antecedentes_personales_no_patologicos?.deportes || '',
      espDeportes: this.historialMedico?.antecedentes_personales_no_patologicos?.espDeportes || '',
      bajo: this.historialMedico?.antecedentes_personales_no_patologicos?.bajo || '',
      sobrePeso: this.historialMedico?.antecedentes_personales_no_patologicos?.sobrePeso || '',
      hacinamiento: this.historialMedico?.antecedentes_personales_no_patologicos?.hacinamiento || '',
      promiscuidad: this.historialMedico?.antecedentes_personales_no_patologicos?.promiscuidad || '',
    });
  }
  
  updateAntecedentesPersonalesNoPatologicos(){
    const formulario = this.formAPNPatologicos.value;
    this.mapMainToespFieldsAPNPatologicos(formulario, this.espFieldsAPNPatologicos);

    this.historialesMedicosService.updateAntecedentespersonalesNoPatologicos(
      this.historialMedico!.APNPatologicos_id,
      formulario
      ).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al actualizar los antecedentes personales no patológicos:', error);
          this.notificationService.error('¡Uy!, hubo un error al actualizar los antecedentes personales no patológicos.');
        }
      );
  }

}
