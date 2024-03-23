import { AntecedentesPersonalesPatologicos } from "src/app/interfaces/antecedentes-personales-patologicos";
import { AntecedentesPersonalesNoPatologicos } from "src/app/interfaces/antecedentes-personales-no-patologicos";
import { AntecedentesHeredofamiliares } from "src/app/interfaces/antecedentes-heredofamiliares";
import { Image } from "src/app/interfaces/image";
import { ExamenesFisicos } from "src/app/interfaces/examenes-fisicos";
import { ExamenesAntidopings } from "src/app/interfaces/examenes-antidoping";
import { ExamenesEmbarazos } from "src/app/interfaces/examenes-embarazo";
import { ExamenesVistas } from "src/app/interfaces/examenes-vista";
import { Examenes } from "src/app/interfaces/examenes";
import { User } from "./user";
import { Dependientes } from "./dependientes";
import { Puestos } from "./puestos";
import { Empleados } from "./empleados";
import { Incapacidades } from "./incapacidades";

export interface HistorialesMedicos {
    id: number;
    talla: number;
    peso: number;
    pacientable_id: number;
    pacientable_type: string;
    
    user?: User;

    pacientable?: {
      numero: number;
      nombre: string;
      RFC: string;
      curp: string;
      IMSS: string;
      sexo: string;
      fechaNacimiento: Date;
      estadoCivil: string;
      telefono: string;
      correo: string;
      direccion_id: number;
      estatus: string;
      puesto_id: number;
      clinica: string;
      user_id: number;
      created_at: Date;
      updated_at: Date;

      image: Image

      dependientes?: Dependientes [];

      incapacidades?: Incapacidades[];

      puesto?: Puestos;

      empleado?: Empleados;
    };

    APPatologicos_id: number;
    APNPatologicos_id: number;
    AHeredofamiliares_id: number;

    antecedentes_personales_patologicos?: AntecedentesPersonalesPatologicos;
    antecedentes_personales_no_patologicos?: AntecedentesPersonalesNoPatologicos;
    antecedentes_heredofamiliares?: AntecedentesHeredofamiliares;

    examenes_fisicos?: ExamenesFisicos [];
    examenes_antidoping?: ExamenesAntidopings [];
    examenes_embarazo?: ExamenesEmbarazos [];
    examenes_vista?: ExamenesVistas [];

    examenesPorCategoria?: Record<string, Examenes[]>; 
    examenes?: Examenes [];
  }