import { DecimalPipe } from "@angular/common";
import { Binary } from "@angular/compiler";

export interface Calendario {
    id: number;
    fecha: Date;
    tipo: string;
    color: string;
    motivo: string;
    paciente?: {
        historialMedico_id: number,
        pacientable_id: number;
        pacientable_type: string;
        
        user: {
          id: string;
          name: string;
        };
    
        pacientable?: {
    
          id: number;
          paterno: string;
          materno: string;
          nombre: string;
        };
    };
    profesional?: {
        id: number;
        paterno: string;
        materno: string;
        nombres: string;
    };
}