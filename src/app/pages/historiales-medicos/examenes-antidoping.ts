import { Sustancias } from "./sustancias";

export interface ExamenesAntidopings {
    id: number,
    fecha: Date;
    tipo: string;
    examen: string;
    historialMedico_id: number;

    sustancias?: Sustancias [];
  }