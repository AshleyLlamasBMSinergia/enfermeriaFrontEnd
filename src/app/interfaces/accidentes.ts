import { Empleados } from "./empleados";
import { Diagnosticos } from "./diagnosticos";

export interface Accidentes {
    id: number,
    fecha: Date,
    empleado_id: number,
    lugar: string,
    descripcion: string,
    diagnostico_id: number,
    causa: string,
    canalizado: string,
    clinica: string,
    diasIncInterna: number,
    costoIncInterna: number,
    costoEstudio: number,
    costoConsulta: number,
    costoMedicamento: number,
    costoTotalAccidente: number,
    incIMSS: boolean,
    diasIncIMSS: number,
    altaST2: boolean,
    calificacion: boolean,
    observaciones: string,
    incapacidad_id: number,
    antiguedad:  string,
    salario:  number,
    turno:  string,

    resultado: string,
    accidente_cost_estudios: any,
    empleado: Empleados,
    diagnostico: Diagnosticos,
}