import { DecimalPipe } from "@angular/common";
import { Calendario } from "src/app/interfaces/calendario";
import { Empleados } from "src/app/interfaces/empleados";
import { Image } from "./image";
import { HistorialesMedicos } from "./historiales-medicos";

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

      image: Image;
      historial_medico: HistorialesMedicos;
    };

    triajeClasificacion: number;
    precionDiastolica: number;
    frecuenciaRespiratoria: number;
    frecuenciaCardiaca: number;
    temperatura: number;
    edad: number;
    peso: DecimalPipe;
    talla: DecimalPipe;
    altura: DecimalPipe;
    grucemiaCapilar: string;
    subjetivo: string;
    objetivo: string;
    analisis: string;
    plan: string;
    diagnostico: string;
    receta: string;
    pronostico: string;
    incapacidad: boolean;
}
