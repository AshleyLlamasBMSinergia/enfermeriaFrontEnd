import { HistorialesMedicos } from "./historiales-medicos";
import { Image } from "./image";

export interface Empleados {
  id: number;
  paterno: string;
  materno: string;
  nombre: string;
  fechaNacimiento: Date;

  historial_medico: HistorialesMedicos;

  image: Image;
}