import { HistorialesMedicos } from '../../historiales-medicos';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HistorialesMedicosService } from '../../historiales-medicos.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-antecedentes-personales-patologicos',
  templateUrl: './antecedentes-personales-patologicos.component.html',
  styleUrls: ['./antecedentes-personales-patologicos.component.css']
})
export class AntecedentesPersonalesPatologicosComponent {
  @Input() historialMedico!: HistorialesMedicos;

  editandoAPPatologicos: boolean = false;

  formAPPatologicos: FormGroup = this.formBuilder.group({
    historialMedico_id: [this.historialMedico?.id],
    cirujias: [''],
    espCirujias: [''],
    contusiones: [''],
    espContusiones: [''],
    lumbalgias: [''],
    espLumbalgias: [''],
    hernias: [''],
    espHernias: [''],
    fracturas: [''],
    espFracturas: [''],
    dorsalgias: [''],
    espDorsalgias: [''],
    hospitalizaciones: [''],
    espHospitalizaciones: [''],
    esguinces: [''],
    espEsguinces: [''],
    lesionesArteriales: [''],
    espLesionesArteriales: [''],
    transfusiones: [''],
    espTransfusiones: [''],
    luxaciones: [''],
    espLuxaciones: [''],
    tetanias: [''],
    espTetanias: [''],
    alergias: [''],
    espAlergias: [''],
    asma: [''],
    epilepsia: [''],
    enfDentales: [''],
    espEnfDentales: [''],
    enfOpticas: [''],
    espEnfOpticas: [''],
    altPsicologicas: [''],
    espAltPsicologicas: [''],
  });

  espFieldsAPPatologicos: { [key: string]: string } = {
    cirujias: 'espCirujias',
    contusiones: 'espContusiones',
    lumbalgias: 'espLumbalgias',
    hernias: 'espHernias',
    fracturas: 'espFracturas',
    dorsalgias: 'espDorsalgias',
    hospitalizaciones: 'espHospitalizaciones',
    esguinces: 'espEsguinces',
    lesionesArteriales: 'espLesionesArteriales',
    transfusiones: 'espTransfusiones',
    luxaciones: 'espLuxaciones',
    tetanias: 'espTetanias',
    alergias: 'espAlergias',
    enfDentales: 'espEnfDentales',
    enfOpticas: 'espEnfOpticas',
    altPsicologicas: 'espAltPsicologicas',
  };

  constructor(
    private formBuilder: FormBuilder,
    private historialesMedicosService: HistorialesMedicosService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit(){
    this.formAPPatologicos.get('historialMedico_id')?.setValue(this.historialMedico.id);
  }

  // APPatologicos
  guardarAPPatologicos() {
    if (this.editandoAPPatologicos) {
      this.updateAntecedentesPersonalesPatologicos();
    } else {
      this.storeAntecedentesPersonalesPatologicos();
    }
  }
  
  private mapMainToespFieldsAPPatologicos(formData: any, espFieldsAPPatologicos: { [key: string]: string }) {
    for (const mainField in espFieldsAPPatologicos) {
      if (espFieldsAPPatologicos.hasOwnProperty(mainField)) {
        const espField = espFieldsAPPatologicos[mainField];
        const mainValue = formData[mainField];

        if (mainValue === 'No') {
          formData[espField] = this.espFieldsAPPatologicos[espField];
        }
      }
    }
  }
  
  storeAntecedentesPersonalesPatologicos() {
    const formData = this.formAPPatologicos.value;
    this.mapMainToespFieldsAPPatologicos(formData, this.espFieldsAPPatologicos);

    this.historialesMedicosService.storeAntecedentespersonalesPatologicos(formData)
    .subscribe(
      (response) => {
        this.notificationService.mensaje(response);
      },
      (error) => {
        console.error('Error al generar los antecedentes personales patológicos:', error);
      }
    );
  }
  
  editAntecedentesPersonalesPatologicos(){
    this.editandoAPPatologicos = true;

    this.formAPPatologicos.patchValue({
      cirujias: this.historialMedico?.antecedentes_personales_patologicos?.cirujias || '',
      espCirujias: this.historialMedico?.antecedentes_personales_patologicos?.espCirujias || '',
      contusiones: this.historialMedico?.antecedentes_personales_patologicos?.contusiones || '',
      espContusiones: this.historialMedico?.antecedentes_personales_patologicos?.espContusiones || '',
      lumbalgias: this.historialMedico?.antecedentes_personales_patologicos?.lumbalgias || '',
      espLumbalgias: this.historialMedico?.antecedentes_personales_patologicos?.espLumbalgias || '',
      hernias: this.historialMedico?.antecedentes_personales_patologicos?.hernias || '',
      espHernias: this.historialMedico?.antecedentes_personales_patologicos?.espHernias || '',
      fracturas: this.historialMedico?.antecedentes_personales_patologicos?.fracturas || '',
      espFracturas: this.historialMedico?.antecedentes_personales_patologicos?.espFracturas || '',
      dorsalgias: this.historialMedico?.antecedentes_personales_patologicos?.dorsalgias || '',
      espDorsalgias: this.historialMedico?.antecedentes_personales_patologicos?.espDorsalgias || '',
      hospitalizaciones: this.historialMedico?.antecedentes_personales_patologicos?.hospitalizaciones || '',
      espHospitalizaciones: this.historialMedico?.antecedentes_personales_patologicos?.espHospitalizaciones || '',
      esguinces: this.historialMedico?.antecedentes_personales_patologicos?.esguinces || '',
      espEsguinces: this.historialMedico?.antecedentes_personales_patologicos?.espEsguinces || '',
      lesionesArteriales: this.historialMedico?.antecedentes_personales_patologicos?.lesionesArteriales || '',
      espLesionesArteriales: this.historialMedico?.antecedentes_personales_patologicos?.espLesionesArteriales || '',
      transfusiones: this.historialMedico?.antecedentes_personales_patologicos?.transfusiones || '',
      espTransfusiones: this.historialMedico?.antecedentes_personales_patologicos?.espTransfusiones || '',
      luxaciones: this.historialMedico?.antecedentes_personales_patologicos?.luxaciones || '',
      espLuxaciones: this.historialMedico?.antecedentes_personales_patologicos?.espLuxaciones || '',
      tetanias: this.historialMedico?.antecedentes_personales_patologicos?.tetanias || '',
      espTetanias: this.historialMedico?.antecedentes_personales_patologicos?.espTetanias || '',
      alergias: this.historialMedico?.antecedentes_personales_patologicos?.alergias || '',
      espAlergias: this.historialMedico?.antecedentes_personales_patologicos?.espAlergias || '',
      asma: this.historialMedico?.antecedentes_personales_patologicos?.asma || '',
      epilepsia: this.historialMedico?.antecedentes_personales_patologicos?.epilepsia || '',
      enfDentales: this.historialMedico?.antecedentes_personales_patologicos?.enfDentales || '',
      espEnfDentales: this.historialMedico?.antecedentes_personales_patologicos?.espEnfDentales || '',
      enfOpticas: this.historialMedico?.antecedentes_personales_patologicos?.enfOpticas || '',
      espEnfOpticas: this.historialMedico?.antecedentes_personales_patologicos?.espEnfOpticas || '',
      altPsicologicas: this.historialMedico?.antecedentes_personales_patologicos?.altPsicologicas || '',
      espAltPsicologicas: this.historialMedico?.antecedentes_personales_patologicos?.espAltPsicologicas || '',
    });
  }
    
  updateAntecedentesPersonalesPatologicos(){
    const formulario = this.formAPPatologicos.value;
    this.mapMainToespFieldsAPPatologicos(formulario, this.espFieldsAPPatologicos);
    // this.formAPPatologicos.patchValue(formulario);

    this.historialesMedicosService.updateAntecedentespersonalesPatologicos(
      this.historialMedico!.APPatologicos_id,
      formulario
      ).subscribe(
        (response) => {
          this.notificationService.mensaje(response);
        },
        (error) => {
          console.error('Error al actualizar los antecedentes personales patológicos:', error);
          this.notificationService.mensaje('¡Uy!, hubo un error al actualizar los antecedentes personales patológicos.');
        }
      );
  }
}
