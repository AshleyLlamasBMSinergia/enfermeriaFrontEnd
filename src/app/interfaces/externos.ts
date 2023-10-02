import { HistorialesMedicos } from "./historiales-medicos";

export interface Externos {
  id: number;
  paterno: string;
  materno: string;
  nombre: string;

  historial_medico: HistorialesMedicos;
}