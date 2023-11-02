import { Insumos } from "./insumos";
import { Lotes } from "./lotes";

export interface Inventarios {
    id: number;
    nombre: string;

    insumos: Insumos[]
    lotes: Lotes[]
}
