import { Component, OnInit } from '@angular/core';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { ActivatedRoute } from '@angular/router';
import { HistorialesMedicos } from '../historiales-medicos';
import { differenceInYears } from 'date-fns';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImageService } from 'src/app/services/imagen.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})

export class HistorialesMedicosShowComponent implements OnInit {
  historialMedico!: HistorialesMedicos | null;
  edad: number | null = null;
  terminado: boolean = false;

  image: any;

  editandoAPPatologicos: boolean = false;
  editandoAPNPatologicos: boolean = false;
  editandoAHeredofamiliares: boolean = false;

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
    asma: 'epilepsia',
    enfDentales: 'espEnfDentales',
    enfOpticas: 'espEnfOpticas',
    altPsicologicas: 'espAltPsicologicas',
  };

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
    private route: ActivatedRoute,
    private imageService: ImageService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.getHistorialMedico();
  }

  calcularEdad() {
    if (this.historialMedico!.pacientable?.fechaNacimiento) {
      const fechaNacimiento = new Date(this.historialMedico!.pacientable?.fechaNacimiento);
      this.edad = differenceInYears(new Date(), fechaNacimiento);
    }
  }

  getHistorialMedico() {
    const historialMedicoId = +this.route.snapshot.paramMap.get('HistorialMedico')!;
    this.historialesMedicosService.getHistorialMedico(historialMedicoId)
      .subscribe(historialMedico => {
        // console.table(historialMedico)
        this.historialMedico = historialMedico;
        this.calcularEdad();
        this.terminado = true;
        
        if (historialMedico?.examenes_fisicos?.length == 0) {
          this.mostrarFormularioEFisico = true;
        }

        this.formAPPatologicos.get('historialMedico_id')?.setValue(historialMedico.id);
        this.formAPNPatologicos.get('historialMedico_id')?.setValue(historialMedico.id);
        this.formAHeredofamiliares.get('historialMedico_id')?.setValue(historialMedico.id);
        this.formEFisico.get('historialMedico_id')?.setValue(historialMedico.id);

        const imageUrl = historialMedico.pacientable?.image?.url;

        if (imageUrl) {
          this.imageService.getImagen(imageUrl).subscribe(
            (response: any) => {
              const blob = new Blob([response], { type: 'image/jpeg' });
              this.image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(blob));
            },
            (error) => {
              console.error('Error al obtener la imagen', error);
            }
          );
        } else {
          console.error('La URL de la imagen es indefinida');
        }
      });
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
        this.mensaje(response);
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
          this.mensaje(response);
        },
        (error) => {
          console.error('Error al actualizar los antecedentes personales patológicos:', error);
          this.mensaje('¡Uy!, hubo un error al actualizar los antecedentes personales patológicos.');
        }
      );
  }

  // APNPatologicos
  guardarAPNPatologicos() {
    if (this.editandoAPPatologicos) {
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
        this.mensaje(response);
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
          this.mensaje(response);
        },
        (error) => {
          console.error('Error al actualizar los antecedentes personales no patológicos:', error);
          this.mensaje('¡Uy!, hubo un error al actualizar los antecedentes personales no patológicos.');
        }
      );
  }

  //AHeredofamiliares
  guardarAHeredofamiliares() {
    if (this.editandoAPPatologicos) {
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
        this.mensaje(response);
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
    this.mapMainToespFieldsAPPatologicos(formulario, this.espFieldsAHeredofamiliares);

    this.historialesMedicosService.updateAntecedentesHeredofamiliares(
      this.historialMedico!.AHeredofamiliares_id,
      formulario
      ).subscribe(
        (response) => {
          this.mensaje(response);
        },
        (error) => {
          console.error('Error al actualizar los antecedentes heredofamiliares:', error);
          this.mensaje('¡Uy!, hubo un error al actualizar los antecedentes heredofamiliares.');
        }
      );
  }

  storeEFisico() {
    const formData = this.formEFisico.value;

    this.historialesMedicosService.storeExamenesFisicos(formData)
    .subscribe(
      (response) => {
        this.mensaje(response);
      },
      (error) => {
        console.error('Error al generar los exámenes físicos:', error);
      }
    );
  }

  abrirFormularioEFisico() {
    this.mostrarFormularioEFisico = !this.mostrarFormularioEFisico;
  }

  destroyEFisico(EFisicoId: number) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: '¿Estás seguro de eliminar los examenes físicos?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.historialesMedicosService.destroyEFisico(EFisicoId).subscribe(
            (response) => {
              this.mensaje(response);
            },
            (error) => {
              console.error('Error al eliminar los exámenes físicos:', error);
              swalWithBootstrapButtons.fire('Error', 'Hubo un error al eliminar los exámenes físicos.', 'error');
            }
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire('Cancelado', 'Tus exámenes físcos están seguros :)', 'error');
        }
      });
  }

  mensaje(response: any) {
    // Mostrar notificación de éxito con mensaje personalizado del backend
    Swal.fire({
      icon: 'success',
      title: response.message, // Usar el mensaje del backend
      showConfirmButton: false,
      timer: 6500 // Duración de la notificación en milisegundos
    });
  
    // Esperar unos segundos antes de recargar la página
    setTimeout(() => {
      // Refrescar la página
      window.location.reload();
    }, 2000); // Cambia el valor si deseas ajustar el tiempo de espera
  }
}
