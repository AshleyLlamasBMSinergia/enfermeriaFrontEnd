import { DecimalPipe } from "@angular/common";
import { Calendario } from "../calendario/calendario";
import { Empleados } from "../empleados/empleados";

export interface Consultas {
    id: number,
    cita_id: number,

    cita: Calendario,

    fecha: Date;

    profesional: Empleados;

    pacientable_id: number;
    pacientable_type: string;

    pacientable?: {
      id: number;
      paterno: string;
      materno: string;
      nombre: string;
      RFC: string;
      CURP: string;
    };

    triajeClasificacion: number;
    pecionDiastolica: number;
    frecuenciaRespiratoria: number;
    frecuenciaCardiaca: number;
    temperatura: number;
    edad: number;
    peso: DecimalPipe;
    talla: DecimalPipe;
    altura: DecimalPipe;
    grucemiaCapilar: DecimalPipe;
    subjetivo: string;
    objetivo: string;
    analisis: string;
    plan: string;
    diagnostico: string;
    receta: string;
    pronostico: string;
    incapacidad: boolean;
}
