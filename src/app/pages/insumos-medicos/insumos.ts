import { Lotes } from "../lotes-medicos/lotes"

export interface Insumos {
    id: number,
    nombre: string,
    piezasPorLote: number,
    descripcion: string,
    requisicion_id: number,
    precio: number;

    // requisicion: Requisicion
    lotes: Lotes[]
}
