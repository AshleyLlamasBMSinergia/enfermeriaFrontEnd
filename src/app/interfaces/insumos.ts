import { Lotes } from "src/app/interfaces/lotes"
import { Image } from "./image";
import { Reactivos } from "./reactivos";

export interface Insumos {
    id: number;
    nombre: string;
    piezasPorLote: number;
    descripcion: string;
    requisicion_id: number;
    precio: number;

    lotes: Lotes[];
    reactivos: Reactivos[];
    image: Image;
}
