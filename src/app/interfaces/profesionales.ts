import { Direcciones } from "./direcciones";
import { Image } from "./image";

export interface Profesionales {
    id: number;
    nombre: string,
    telefono: string,
    correo: string,
    cedula: string,
    cedis_id: number,
    direccion_id: number,
    estatus: string,
    puesto_id: number,
    receta: string,

    direccion: Direcciones;

    image: Image,
}