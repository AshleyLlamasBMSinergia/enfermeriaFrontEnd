import { Altas } from "./altas";

export interface Revisiones {
    tipo: string,
    incapacidad_id: number,
    profesional_id: number,
    diagnostico: string,
    fecha: Date,
    dias: number,

    alta: Altas
}