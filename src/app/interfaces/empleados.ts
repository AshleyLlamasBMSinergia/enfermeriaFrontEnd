import { HistorialesMedicos } from "./historiales-medicos";
import { Image } from "./image";

export interface Empleados {
  id: number;
  numero: number;
  nombre: string;
  fechaNacimiento: Date;

  historial_medico: HistorialesMedicos;

  image: Image;
}