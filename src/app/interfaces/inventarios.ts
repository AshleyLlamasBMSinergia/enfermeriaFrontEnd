import { Insumos } from "./insumos";

export interface Inventarios {
    id: number;
    nombre: string;

    insumos: Insumos[]
}
