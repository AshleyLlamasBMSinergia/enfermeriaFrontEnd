import { Component, ViewEncapsulation } from '@angular/core';
import { EmpleadosService } from '../../empleados/empleados.service';
import { ExternosService } from '../../externos/externos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultasCreateComponent {
  selectData: any = [];
  fechaActual: string | null = null;
  horaActual: string | null = null;

  constructor(
    private empleadosService: EmpleadosService,
    private externosService: ExternosService,
    private datePipe: DatePipe
  ) 
  {
    this.obtenerFechaHoraActual();
  }

  ngOnInit(): void {
    // Llamada a los servicios para obtener los datos de empleados y externos
    this.empleadosService.getEmpleados().subscribe((empleados) => {
      this.selectData.push({
        label: 'Empleados',
        options: empleados.map((empleado: any) => ({
          'data-pacientable_id': empleado.Empleado,
          'data-pacientable_type': 'App//Models//NomEmpleado',
          label: empleado.Nombres,
        }))
      });
    });

    this.externosService.getExternos().subscribe((externos) => {
      this.selectData.push({
        label: 'Externos',
        options: externos.map((externo: any) => ({
          'data-pacientable_id': externo.Externo,
          'data-pacientable_type': 'App//Models//Externo',
          label: externo.Nombres,
        }))
      });
    });
  }

  obtenerFechaHoraActual() {
    const now = new Date();
    this.fechaActual = this.datePipe.transform(now, 'dd/MM/yyyy');
    this.horaActual = this.datePipe.transform(now, 'hh:mm a');
  }
}
