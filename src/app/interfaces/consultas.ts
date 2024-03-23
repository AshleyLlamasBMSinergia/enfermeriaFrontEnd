import { DecimalPipe } from "@angular/common";
import { Calendario } from "src/app/interfaces/calendario";
import { Image } from "./image";
import { HistorialesMedicos } from "./historiales-medicos";
import { Profesionales } from "./profesionales";

export interface Consultas {
    id: number,
    cita_id: number,

    cita: Calendario,

    fecha: Date;

    profesional: Profesionales;

    pacientable_id: number;
    pacientable_type: string;

    pacientable?: {
      id: number;
      nombre: string;
      RFC: string;
      CURP: string;

      image: Image;
      historial_medico: HistorialesMedicos;
    };

    triajeClasificacion: number;
    presionSistolica: number;
    presionDiastolica: number;
    frecuenciaRespiratoria: number;
    frecuenciaCardiaca: number;
    temperatura: number;
    edad: number;
    peso: DecimalPipe;
    talla: DecimalPipe;
    mg: number;
    dl: number;

    subjetivo: string;
    objetivo: string;
    analisis: string;
    plan: string;

    diagnostico_id: number;
    complemento: string;
    receta: string;

    pronostico: string;
    incapacidad: boolean;

    diagnostico: {
      nombre: string;
    }

    created_at: Date;
}
