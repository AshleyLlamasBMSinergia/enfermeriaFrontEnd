
import { Cedis } from "./cedis";

export interface Empresas {
    id: number,
    RFC: string,
    Nombre: String,
    NombreLargo: String,
    Path: String,
    Path2: String,

    cedis: Cedis[]
}