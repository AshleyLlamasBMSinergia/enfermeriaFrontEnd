import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';


@Component({
  selector: 'app-antecedentes-heredofamiliares',
  templateUrl: './antecedentes-heredofamiliares.component.html',
  styleUrls: ['./antecedentes-heredofamiliares.component.css']
})
export class AntecedentesHeredofamiliaresComponent {
  @Input() historialMedico!: HistorialesMedicos;

  editandoAHeredofamiliares: boolean = false;

  formAHeredofamiliares: FormGroup = this.formBuilder.group({
    historialMedico_id: [this.historialMedico?.id],
    padresViven: [''],
    hermanosViven: [''],
    hermanasViven: [''],
    diabetes: [''],
    espDiabetes: [''],
    obecidad: [''],
    espObecidad: [''],
    hipertensionArterial: [''],
    espHipertensionArterial: [''],
    psoriasisVitiligo: [''],
    espPsoriasisVitiligo: [''],
    cardiopatias: [''],
    espCardiopatias: [''],
    lepra: [''],
    espLepra: [''],
    neoplasicos: [''],
    espNeoplasicos: [''],
    fimicos: [''],
    espFimicos: [''],
    tiroideos: [''],
    espTiroideos: [''],
    psiquiatricos: [''],
    espPsiquiatricos: [''],
    alergias: [''],
    espAlergias: [''],
    colagenopatias: [''],
    espColagenopatias: [''],
    probMentales: [''],
    espProbMentales: [''],
    otros: [''],
  });

  espFieldsAHeredofamiliares: { [key: string]: string } = {
    diabetes: 'espDiabetes',
    obecidad: 'espObecidad',
    hipertensionArterial: 'espHipertensionArterial',
    psoriasisVitiligo: 'espPsoriasisVitiligo',
    cardiopatias: 'espCardiopatias',
    lepra: 'espLepra',
    neoplasicos: 'espNeoplasicos',
    fimicos: 'espFimicos',
    tiroideos: 'espTiroideos',
    psiquiatricos: 'espPsiquiatricos',
    alergias: 'espAlergias',
    colagenopatias: 'espColagenopatias',
    probMentales: 'espProbMentales',
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService
  ) {
  }
  
  ngOnInit(){
    this.formAHeredofamiliares.get('historialMedico_id')?.setValue(this.historialMedico.id);
  }

  //AHeredofamiliares
  guardarAHeredofamiliares() {
    if (this.editandoAHeredofamiliares) {
      this.updateAntecedentesHeredofamiliares();
    } else {
      this.storeAntecedentesHeredofamiliares();
    }
  }

  private mapMainToespFieldsAHeredofamiliares(formData: any, espFieldsAHeredofamiliares: { [key: string]: string }) {
    for (const mainField in espFieldsAHeredofamiliares) {
      if (espFieldsAHeredofamiliares.hasOwnProperty(mainField)) {
        const espField = espFieldsAHeredofamiliares[mainField];
        const mainValue = formData[mainField];

        if (mainValue === 'No') {
          formData[espField] = this.espFieldsAHeredofamiliares[espField];
        }
      }
    }
  }

  storeAntecedentesHeredofamiliares() {
    const formData = this.formAHeredofamiliares.value;
    this.mapMainToespFieldsAHeredofamiliares(formData, this.espFieldsAHeredofamiliares);

    this.historialesMedicosService.storeAntecedentesHeredofamiliares(formData)
    .subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        console.error('Error al generar los antecedentes heredofamiliares:', error);
      }
    );
  }

  editAntecedentesHeredofamiliares(){
    this.editandoAHeredofamiliares = true;

    this.formAHeredofamiliares.patchValue({
      padresViven: this.historialMedico?.antecedentes_heredofamiliares?.padresViven || '',
      hermanosViven: this.historialMedico?.antecedentes_heredofamiliares?.hermanosViven || '',
      hermanasViven: this.historialMedico?.antecedentes_heredofamiliares?.hermanasViven || '',
      diabetes: this.historialMedico?.antecedentes_heredofamiliares?.diabetes || '',
      espDiabetes: this.historialMedico?.antecedentes_heredofamiliares?.espDiabetes || '',
      obecidad: this.historialMedico?.antecedentes_heredofamiliares?.obecidad || '',
      espObecidad: this.historialMedico?.antecedentes_heredofamiliares?.espObecidad || '',
      hipertensionArterial: this.historialMedico?.antecedentes_heredofamiliares?.hipertensionArterial || '',
      espHipertensionArterial: this.historialMedico?.antecedentes_heredofamiliares?.espHipertensionArterial || '',
      psoriasisVitiligo: this.historialMedico?.antecedentes_heredofamiliares?.psoriasisVitiligo || '',
      espPsoriasisVitiligo: this.historialMedico?.antecedentes_heredofamiliares?.espPsoriasisVitiligo || '',
      cardiopatias: this.historialMedico?.antecedentes_heredofamiliares?.cardiopatias || '',
      espCardiopatias: this.historialMedico?.antecedentes_heredofamiliares?.espCardiopatias || '',
      lepra: this.historialMedico?.antecedentes_heredofamiliares?.lepra || '',
      espLepra: this.historialMedico?.antecedentes_heredofamiliares?.espLepra || '',
      neoplasicos: this.historialMedico?.antecedentes_heredofamiliares?.neoplasicos || '',
      espNeoplasicos: this.historialMedico?.antecedentes_heredofamiliares?.espNeoplasicos || '',
      fimicos: this.historialMedico?.antecedentes_heredofamiliares?.fimicos || '',
      espFimicos: this.historialMedico?.antecedentes_heredofamiliares?.espFimicos || '',      
      tiroideos: this.historialMedico?.antecedentes_heredofamiliares?.tiroideos || '',
      espTiroideos: this.historialMedico?.antecedentes_heredofamiliares?.espTiroideos || '',
      psiquiatricos: this.historialMedico?.antecedentes_heredofamiliares?.psiquiatricos || '',
      espPsiquiatricos: this.historialMedico?.antecedentes_heredofamiliares?.espPsiquiatricos || '',
      alergias: this.historialMedico?.antecedentes_heredofamiliares?.alergias || '',
      espAlergias: this.historialMedico?.antecedentes_heredofamiliares?.espAlergias || '',
      colagenopatias: this.historialMedico?.antecedentes_heredofamiliares?.colagenopatias || '',
      espColagenopatias: this.historialMedico?.antecedentes_heredofamiliares?.espColagenopatias || '',
      probMentales: this.historialMedico?.antecedentes_heredofamiliares?.probMentales || '',
      espProbMentales: this.historialMedico?.antecedentes_heredofamiliares?.espProbMentales || '',
      otros: this.historialMedico?.antecedentes_heredofamiliares?.otros || '',
    });
  }
  
  updateAntecedentesHeredofamiliares(){
    const formulario = this.formAHeredofamiliares.value;
    this.mapMainToespFieldsAHeredofamiliares(formulario, this.espFieldsAHeredofamiliares);

    this.historialesMedicosService.updateAntecedentesHeredofamiliares(
      this.historialMedico!.AHeredofamiliares_id,
      formulario
      ).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al actualizar los antecedentes heredofamiliares:', error);
          this.notificationService.mensaje('¡Uy!, hubo un error al actualizar los antecedentes heredofamiliares.');
        }
      );
  }
}
