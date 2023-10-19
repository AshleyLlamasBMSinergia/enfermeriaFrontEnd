

export interface Movimientos {
    id: number,
    tipo: string,
    folio: string,
    fecha: Date,
    profesional_id: number,
    lote_id: number,
    typable_id: number,
    typable_type: string,
    created_at: Date,
    updated_at: Date,
    typable: {
        id: 3,
        motivo: string,
        detalles: string,
        inventario_id: number,
        created_at: Date,
        updated_at: Date
    }
}