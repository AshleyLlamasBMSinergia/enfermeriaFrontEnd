import { Lotes } from "../lotes-medicos/lotes"

export interface Insumos {
    id: number,
    nombre: string,
    piezasPorLote: number,

    lotes: Lotes[]
}
