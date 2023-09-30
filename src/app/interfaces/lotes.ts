import { Insumos } from "src/app/interfaces/insumos";

export interface Lotes {
    id: number,
    lote: string;
    fechaCaducidad: Date;
    fechaIngreso: Date;
    piezasDisponibles: number;
    insumos_id: number;
  }