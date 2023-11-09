import { Archivos } from "./archivos";
import { Inventarios } from "./inventarios";
import { MovimientoMovs } from "./movimientoMovs"
import { Profesionales } from "./profesionales";


export interface Movimientos {
    id: number,
    fecha: Date,
    profesional_id: number,
    inventario_id: number,
    movimientoTipo_id: number,
    created_at: Date,
    updated_at: Date,

    profesional: Profesionales;

    tipo_de_movimiento: {
        id: number,
        tipoDeMovimiento: string,
        afecta: number,
        clave: number
    }
    movimiento_movs: MovimientoMovs[];

    inventario: Inventarios;

    archivos: Archivos[];
    archivosPorCategoria: Record<string, Archivos[]>; 
}