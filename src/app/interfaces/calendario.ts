
import { HistorialesMedicos } from "./historiales-medicos";
import { Profesionales } from "./profesionales";

export interface Calendario {
    id: number;
    fecha: Date;
    tipo: string;
    color: string;
    motivo: string;
    paciente?: HistorialesMedicos;
    profesional?: Profesionales;
}