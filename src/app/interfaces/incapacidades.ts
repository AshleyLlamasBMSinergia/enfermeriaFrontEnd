import { Accidentes } from "./accidentes";
import { Altas } from "./altas";
import { Archivos } from "./archivos";
import { Empleados } from "./empleados";
import { NomIncidencias } from "./nomIncidencias";
import { Profesionales } from "./profesionales";
import { Revisiones } from "./revisiones";
import { zonasAfectadas } from "./zonas-afectadas";

export interface Incapacidades {
    id: number,
    folio: string,
    fechaEfectiva: Date,
    dias: number,
    TipoIncidencia: string,
    TipoRiesgo: string,
    Secuela: string,
    ControlIncapacidad: string,
    TipoPermiso: string,

    diagnostico: string,
    observaciones: string,
    empleado_id: number,
    profesional_id: number,

    profesional: Profesionales;

    zonas_afectadas: zonasAfectadas[];

    tipo_incidencia: {
        TipoIncidencia: string,
        Nombre: string,
        DamosVales: string,
        Vacaciones: string,
        Incapacidad: string,
        Tipo: string,
        PorCiento: string,
        RamaSeguro: string,
        Grupo: string,
        Ptu: string
    },

    secuela: {
        Secuela: string,
        Nombre: string
    },

    tipo_riesgo: {
        TipoRiesgo: string,
        Nombre: string
    },

    control_incapacidad: {
        ControlIncapacidad: string
        Nombre: string
    },

    tipo_permiso: {
        TipoPermiso: string,
        Nombre: string
    },

    nom_incidencias: NomIncidencias[]
}