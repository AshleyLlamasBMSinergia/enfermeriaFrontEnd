import { DecimalPipe } from "@angular/common";
import { Binary } from "@angular/compiler";
import { AntecedentesPersonalesPatologicos } from "./antecedentes-personales-patologicos";

export interface HistorialesMedicos {
    HistorialMedico: number,
    pacientable_id: number;
    pacientable_type: string;
    
    Usuario: {
      Usuario: string;
      Nombre: string;
    };

    pacientable?: {
      Empleado: number;
      Paterno: string;
      Materno: string;
      Nombres: string;
      Nombre: string;
      RFC: string;
      Curp: string;
      Imss: string;
      Sexo: string;
      FechaNacimiento: Date;
      EstadoCivil: null;
      Telefono: string;
      Calle: string;
      Exterior: string;
      Interior: string;
      Colonia: string;
      CP: string;
      Localidad: string;
      Correo: string;
      Puesto: number;
      Departamento: number;
      Leyenda: string;
      Plaza: number;
      Categoria: number;
      Jefe: number;
      Contrato: number;
      DiasContrato: number;
      DiasSemana: number;
      Horario: number;
      Sueldo: DecimalPipe;
      SDI: DecimalPipe;
      Integrado: DecimalPipe;
      FechaIngreso: Date;
      FechaBaja: Date;
      CausaBaj: string;
      Sindicato: boolean;
      ValeElectronico: boolean;
      PagoElectronico: boolean;
      Cuenta: string;
      Sodexo: string;
      Baja: boolean;
      Observaciones: string;
      Observaciones2: string;
      Observaciones3: string;
      Foto: Binary;
      Neto: boolean;
      Clinica: number;
      Orden: number;
      Usuario: string;
      Fonacot: string;
      Autorizacion: boolean;
      CuentaHSBC: string;
      Clabe: string;
      Enviar: boolean;
      CorreoEmpresa: string;
      TelEmpresa: string;
      DiaDescanso: string;
      Escolaridad: string;
      Profesion: string;
      ClaveEscolaridad: number;
      ClaveDocumento: number;
      ClaveInstitucion: number;
      CausaBajaReal: number;
      Cc: number;
      ClaveFactor: number;
      EsNuevo: boolean;
      FechaBajaR: Date;
      CpCfdi: string;
      NombreCfdi: string;
      Temporal: number;
      EsCorporativo: boolean;
      ReemplazaA: number;
      created_at: Date;
      updated_at: Date;

      puesto?: {
        Puesto: number;
        Nombre: string;
      }
    };

    APPatologicos: number;
    
    antecedentes_personales_patologicos?: AntecedentesPersonalesPatologicos;

    antecedentes_personales_no_patologicos: number,
    antecedentes_heredofamiliares: number
  }