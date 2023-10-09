import { Empleados } from "./empleados";
import { HistorialesMedicos } from "./historiales-medicos";
import { Image } from "./image";

export interface Dependientes {
    id: number;
    nombre: string;
    empleado_id: number;
    sexo: string;
    fechaNacimiento: Date;
    telefono: string;
    correo: string;
    parentesco: string;
    estatus: string;

    image: Image;

    empleado: Empleados;

    historial_medico: HistorialesMedicos;
}
