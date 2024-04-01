import { Accidentes } from "./accidentes"
import { Archivos } from "./archivos"
import { Empleados } from "./empleados";
import { Incapacidades } from "./incapacidades"

export interface Casos {
    id: number,
    departamento_id: number,
    empleado_id: number,
    accidente_id: number,
    doctos: string,
    estatus: string,

    accidente: Accidentes,
    departamento: any,
    empleado: Empleados,

    archivosPorCategoria: Record<string, Archivos[]>, 

    incapacidades: Incapacidades[],
}