import { Archivos } from "./archivos";

export interface Examenes {
    id: number,
    fecha: Date, 
    tipo: string;
    categoria: string;
    descripcion: string;
    historialMedico_id: number;
    
    archivos: Archivos[];
}