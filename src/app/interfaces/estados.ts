import { Localidades } from "./localidades";

export interface Estados {
    id: number,
    estado: string,
    nombre: string,
    clave: string,

    localidades: Localidades[];
}