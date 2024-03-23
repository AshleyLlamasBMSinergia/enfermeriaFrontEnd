import { Profesionales } from "./profesionales";

export interface Pendiente {
    id: number,
    estatus: boolean,
    titulo: string,
    profesional: Profesionales,
  }