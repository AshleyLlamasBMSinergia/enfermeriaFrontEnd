import { Lotes } from "src/app/interfaces/lotes"
import { Image } from "./image";

export interface Insumos {
    id: number;
    nombre: string;
    piezasPorLote: number;
    descripcion: string;
    requisicion_id: number;
    precio: number;

    // requisicion: Requisicion
    lotes: Lotes[];
    image: Image;
}
