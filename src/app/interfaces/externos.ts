import { HistorialesMedicos } from "./historiales-medicos";

export interface Externos {
  id: number;
  nombre: string;

  historial_medico: HistorialesMedicos;
}