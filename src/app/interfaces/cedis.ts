import { Direcciones } from "./direcciones";
import { Empresas } from "./empresas";

export interface Cedis {
    id: number;
    nombre: String,
    empresa_id: number,
    direccion_id: number

    direccion: Direcciones,
    empresa: Empresas
}