import { Insumos } from "../insumos-medicos/insumos";

export interface Lotes {
    id: number,
    lote: string,
    fechaCaducidad: Date,
    fechaIngreso: Date,
    descripcion: string,
    piezasDisponibles: number,

    insumos_id: number,
    insumos: Insumos,
  }