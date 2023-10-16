import { Insumos } from "src/app/interfaces/insumos";
import { Movimientos } from "./movimientos";

export interface Lotes {
    id: number,
    lote: string;
    fechaCaducidad: Date;
    fechaIngreso: Date;
    piezasDisponibles: number;
    insumos_id: number;

    insumo: Insumos;
    movimientos: Movimientos[];
  }