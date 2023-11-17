import { Altas } from "./altas";
import { Archivos } from "./archivos";
import { Empleados } from "./empleados";
import { Profesionales } from "./profesionales";
import { Revisiones } from "./revisiones";
import { zonasAfectadas } from "./zonas-afectadas";

export interface Incapacidades {
    id: number,
    tipo: string,
    consecuente: string,
    fechaInicial: Date,
    fechaTermino: Date,
    dias: number,

    fechaProxRevision: Date,

    calificacionAccidente: string,
    causa: string,
    diagnostico: string,
    observaciones: string,
    empleado_id: number,
    profesional_id: number,

    empleado: Empleados;
    profesional: Profesionales;

    revisiones: Revisiones;

    zonas_afectadas: zonasAfectadas[];

    archivosPorCategoria: Record<string, Archivos[]>; 
}