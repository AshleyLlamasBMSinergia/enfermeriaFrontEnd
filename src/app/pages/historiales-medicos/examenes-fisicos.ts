import { DecimalPipe } from "@angular/common";
import { ExamenesCabezas } from "./examenes-cabeza";
import { ExamenesToraxs } from "./examenes-torax";
import { ExamenesAbodomen } from "./examenes-abdomen";
import { ExamenesExtremidad } from "./examenes-extremidad";
import { ExamenesColumnaVertebral } from "./examenes-columna-vertebral";
import { ExamenesOrganoSentido } from "./examenes-organo-sentido";

export interface ExamenesFisicos {
    id: number,
    fecha: Date,
    TA: string,
    FR: string,
    peso: DecimalPipe,
    TC: string,
    temperatura: number,
    talla: string,
    estadoConciencia: string,
    coordinacion: string,
    equilibrio: string,
    marcha: string,
    orientacion: string,
    orientacionTiempo: string,
    orientacionPersona: string,
    orientacionEspacio: string,
    historialMedico_id: number,
    EOrganoSentido_id: number,
    ECabeza_id: number,
    ETorax_id: number,
    EAbdomen_id: number,
    EExtremidad_id: number,
    EColumnaVertebral_id: number,

    cabeza: ExamenesCabezas;
    torax: ExamenesToraxs;
    abdomen: ExamenesAbodomen;
    extremidad: ExamenesExtremidad;
    columna_vertebral: ExamenesColumnaVertebral;
    organo_sentido: ExamenesOrganoSentido;
  }