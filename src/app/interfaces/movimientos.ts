import { MovimientoMovs } from "./movimientoMovs"


export interface Movimientos {
    id: number,
    fecha: Date,
    profesional_id: number,
    inventario_id: number,
    movimientoTipo_id: number,
    created_at: Date,
    updated_at: Date,

    profesional: {
      id: number,
      nombre: string,
    }

    tipo_de_movimiento: {
        id: number,
        tipoDeMovimiento: string,
        afecta: number
    }
    movimiento_movs: MovimientoMovs[];
}