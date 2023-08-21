import { Component, OnInit } from '@angular/core';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { ActivatedRoute } from '@angular/router';
import { HistorialesMedicos } from '../historiales-medicos';
import { differenceInYears } from 'date-fns';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class HistorialesMedicosShowComponent implements OnInit {
  
  historialMedico!: HistorialesMedicos | null;
  edad: number | null = null;
  
  terminado: boolean = false;
  formAPPatologicos: boolean = false;

  //Formulario APPatologicos
  cirujias: string = '';
  espCirujias: string = '';
  contusiones: string = '';
  espContusiones: string = '';
  lumbalgias: string = '';
  espLumbalgias: string = '';
  hernias: string = '';
  espHernias: string = '';
  fracturas: string = '';
  espFracturas: string = '';
  dorsalgias: string = '';
  espDorsalgias: string = '';
  hospitalizaciones: string = '';
  espHospitalizaciones: string = '';
  esguinces: string = '';
  espEsguinces: string = '';
  lesionesArteriales: string = '';
  espLesionesArteriales: string = '';
  transfusiones: string = '';
  espTransfusiones: string = '';
  luxaciones: string = '';
  espLuxaciones: string = '';
  tetanias: string = '';
  espTetanias: string = '';
  alergias: string = '';
  espAlergias: string = '';
  asma: string = '';
  epilepsia: string = '';
  enfDentales: string = '';
  espEnfDentales: string = '';
  enfOpticas: string = '';
  espEnfOpticas: string = '';
  altPsicologicas: string = '';
  espAltPsicologicas: string = '';

  espFields: { [key: string]: string } = {
    'Cirujias': '',
    'Contusiones': '',
    'Lumbalgias': '',
    'Hernias': '',
    'Fracturas': '',
    'Dorsalgias': '',
    'Hospitalizaciones': '',
    'Esguinces': '',
    'LesionesArteriales': '',
    'Transfusiones': '',
    'Luxaciones': '',
    'Tetanias': '',
    'Alergias': '',
    'EnfDentales': '',
    'EnfOticas': '',
    'AltPsicologicas': '',
  };

  constructor(
    private historialesMedicosService: HistorialesMedicosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getHistorialMedico();
  }

  calcularEdad() {
    if (this.historialMedico!.pacientable?.FechaNacimiento) {
      const fechaNacimiento = new Date(this.historialMedico!.pacientable?.FechaNacimiento);
      this.edad = differenceInYears(new Date(), fechaNacimiento);
    }
  }

  getHistorialMedico() {
    const historialMedicoId = +this.route.snapshot.paramMap.get('HistorialMedico')!;
    this.historialesMedicosService.getHistorialMedico(historialMedicoId)
      .subscribe(historialMedico => {
        console.table(historialMedico)
        this.historialMedico = historialMedico;
        this.calcularEdad();
        this.terminado = true;
      });
  }

  private mapAntecedentesPersonalesPatologicosToRequestBody(): { [key: string]: string } {
    const antecedentesPersonalesPatologicos: { [key: string]: string } = {
      Cirujias: this.cirujias,
      EspCirujias: this.espCirujias,
      Contusiones: this.contusiones,
      EspContusiones: this.espContusiones,
      Lumbalgias: this.lumbalgias,
      EspLumbalgias: this.espLumbalgias,
      Hernias: this.hernias,
      EspHernias: this.espHernias,
      Fracturas: this.fracturas,
      EspFracturas: this.espFracturas,
      Dorsalgias: this.dorsalgias,
      EspDorsalgias: this.espDorsalgias,
      Hospitalizaciones: this.hospitalizaciones,
      EspHospitalizaciones: this.espHospitalizaciones,
      Esguinces: this.esguinces,
      EspEsguinces: this.espEsguinces,
      LesionesArteriales: this.lesionesArteriales,
      EspLesionesArteriales: this.espLesionesArteriales,
      Transfusiones: this.transfusiones,
      EspTransfusiones: this.espTransfusiones,
      Luxaciones: this.luxaciones,
      EspLuxaciones: this.espLuxaciones,
      Tetanias: this.tetanias,
      EspTetanias: this.espTetanias,
      Alergias: this.alergias,
      EspAlergias: this.espAlergias,
      Asma: this.asma,
      Epilepsia: this.epilepsia,
      EnfDentales: this.enfDentales,
      EspEnfDentales: this.espEnfDentales,
      enfOpticas: this.enfOpticas,
      EspEnfOpticas: this.espEnfOpticas,
      AltPsicologicas: this.altPsicologicas,
      EspAltPsicologicas: this.espAltPsicologicas,
      HistorialMedico: this.historialMedico?.HistorialMedico !== undefined
      ? this.historialMedico?.HistorialMedico.toString()
      : ''
    };
  
    const espFieldsMap: Map<string, string> = new Map([
      ['Cirujias', 'EspCirujias'],
      ['Contusiones', 'EspContusiones'],
      ['Lumbalgias', 'EspLumbalgias'],
      ['Hernias', 'EspHernias'],
      ['Fracturas', 'EspFracturas'],
      ['Dorsalgias', 'EspDorsalgias'],
      ['Hospitalizaciones', 'EspHospitalizaciones'],
      ['Esguinces', 'EspEsguinces'],
      ['LesionesArteriales', 'EspLesionesArteriales'],
      ['Transfusiones', 'EspTransfusiones'],
      ['Luxaciones', 'EspLuxaciones'],
      ['Tetanias', 'EspTetanias'],
      ['Alergias', 'EspAlergias'],
      ['EnfDentales', 'EspEnfDentales'],
      ['enfOpticas', 'EspenfOpticas'],
      ['AltPsicologicas', 'EspAltPsicologicas'],
    ]);
  
    espFieldsMap.forEach((espField, mainField) => {
      if (antecedentesPersonalesPatologicos[mainField] === 'No') {
        antecedentesPersonalesPatologicos[espField] = this.espFields[espField];
      }
    });
  
    if (this.historialMedico?.HistorialMedico !== undefined) {
      antecedentesPersonalesPatologicos['HistorialMedico'] = this.historialMedico.HistorialMedico.toString();
    }
  
    return antecedentesPersonalesPatologicos;
  }

  createAntecedentesPersonalesPatologicos() {

    const antecedentesPersonalesPatologicos = this.mapAntecedentesPersonalesPatologicosToRequestBody();
  
    this.historialesMedicosService.storeAntecedentespersonalesPatologicos(antecedentesPersonalesPatologicos)
      .subscribe(
        (response) => {
          this.mensaje(response); // Llamar a la función mensaje() con la respuesta
        },
        (error) => {
          console.error('Error al generar los antecedentes personales patológicos:', error);
          this.mensaje('¡Uy!, hubo un error al guardar los antecedentes personales patológicos.');
        }
      );
  }

  editAntecedentesPersonalesPatologicos(){
    this.cirujias = this.historialMedico?.antecedentes_personales_patologicos?.Cirujias || '';
    this.espCirujias = this.historialMedico?.antecedentes_personales_patologicos?.EspCirujias || '';
    this.contusiones = this.historialMedico?.antecedentes_personales_patologicos?.Contusiones || '';
    this.espContusiones = this.historialMedico?.antecedentes_personales_patologicos?.EspContusiones || '';
    this.lumbalgias = this.historialMedico?.antecedentes_personales_patologicos?.Lumbalgias || '';
    this.espLumbalgias = this.historialMedico?.antecedentes_personales_patologicos?.EspLumbalgias || '';
    this.hernias = this.historialMedico?.antecedentes_personales_patologicos?.Hernias || '';
    this.espHernias = this.historialMedico?.antecedentes_personales_patologicos?.EspHernias || '';
    this.fracturas = this.historialMedico?.antecedentes_personales_patologicos?.Fracturas || '';
    this.espFracturas = this.historialMedico?.antecedentes_personales_patologicos?.EspFracturas || '';
    this.dorsalgias = this.historialMedico?.antecedentes_personales_patologicos?.Dorsalgias || '';
    this.espDorsalgias = this.historialMedico?.antecedentes_personales_patologicos?.EspDorsalgias || '';
    this.hospitalizaciones = this.historialMedico?.antecedentes_personales_patologicos?.Hospitalizaciones || '';
    this.espHospitalizaciones = this.historialMedico?.antecedentes_personales_patologicos?.EspHospitalizaciones || '';
    this.esguinces = this.historialMedico?.antecedentes_personales_patologicos?.Esguinces || '';
    this.espEsguinces = this.historialMedico?.antecedentes_personales_patologicos?.EspEsguinces || '';
    this.lesionesArteriales = this.historialMedico?.antecedentes_personales_patologicos?.LesionesArteriales || '';
    this.espLesionesArteriales = this.historialMedico?.antecedentes_personales_patologicos?.EspLesionesArteriales || '';
    this.transfusiones = this.historialMedico?.antecedentes_personales_patologicos?.Transfusiones || '';
    this.espTransfusiones = this.historialMedico?.antecedentes_personales_patologicos?.EspTransfusiones || '';
    this.luxaciones = this.historialMedico?.antecedentes_personales_patologicos?.Luxaciones || '';
    this.espLuxaciones = this.historialMedico?.antecedentes_personales_patologicos?.EspLuxaciones || '';
    this.tetanias = this.historialMedico?.antecedentes_personales_patologicos?.Tetanias || '';
    this.espTetanias = this.historialMedico?.antecedentes_personales_patologicos?.EspTetanias || '';
    this.alergias = this.historialMedico?.antecedentes_personales_patologicos?.Alergias || '';
    this.espAlergias = this.historialMedico?.antecedentes_personales_patologicos?.EspAlergias || '';
    this.asma = this.historialMedico?.antecedentes_personales_patologicos?.Asma || '';
    this.epilepsia = this.historialMedico?.antecedentes_personales_patologicos?.Epilepsia || '';
    this.enfDentales = this.historialMedico?.antecedentes_personales_patologicos?.EnfDentales || '';
    this.espEnfDentales = this.historialMedico?.antecedentes_personales_patologicos?.EspEnfDentales || '';
    this.enfOpticas = this.historialMedico?.antecedentes_personales_patologicos?.EnfOpticas || '';
    this.espEnfOpticas = this.historialMedico?.antecedentes_personales_patologicos?.EspEnfOpticas || '';
    this.altPsicologicas = this.historialMedico?.antecedentes_personales_patologicos?.AltPsicologicas || '';
    this.espAltPsicologicas = this.historialMedico?.antecedentes_personales_patologicos?.EspAltPsicologicas || '';
  
    // Cambiar el valor de formAPPatologicos para mostrar el formulario de edición
    this.formAPPatologicos = true;
  }

  updateAntecedentesPersonalesPatologicos(){
    const antecedentesPersonalesPatologicos = this.mapAntecedentesPersonalesPatologicosToRequestBody();

    this.historialesMedicosService.updateAntecedentespersonalesPatologicos(
      this.historialMedico!.APPatologicos,
      antecedentesPersonalesPatologicos
    ).subscribe(
      (response) => {
        this.mensaje(response);
      },
      (error) => {
        console.error('Error al actualizar los antecedentes personales patológicos:', error);
        // this.mensaje('¡Uy!, hubo un error al actualizar los antecedentes personales patológicos.');
      }
    );
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
