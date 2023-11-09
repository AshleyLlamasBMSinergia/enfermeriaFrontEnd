import { Lotes } from "./lotes";


export interface MovimientoMovs {
    id: number,
    lote_id: number,
    unidades: number,
    precio: number,

    lote: Lotes;
}