import { Empleados } from "./empleados";
import { HistorialesMedicos } from "./historiales-medicos";

export interface Calendario {
    id: number;
    fecha: Date;
    tipo: string;
    color: string;
    motivo: string;
    paciente?: HistorialesMedicos;
    profesional?: Empleados;
}