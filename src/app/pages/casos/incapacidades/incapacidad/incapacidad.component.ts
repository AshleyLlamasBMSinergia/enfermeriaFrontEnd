import { Component, Input } from '@angular/core';
import { Incapacidades } from 'src/app/interfaces/incapacidades';

@Component({
  selector: 'app-incapacidad',
  templateUrl: './incapacidad.component.html',
  styleUrls: ['./incapacidad.component.css']
})
export class IncapacidadComponent {
  incapacidad?: Incapacidades;

  @Input()
  set inputIncapacidad(value: Incapacidades | undefined) {
    this.incapacidad = value;
    this.actualizarFechaFinal();
  }

  fechaFinal: any;

  onInit(){
    this.fechaFinal = this.obtenerFechaFinal(this.incapacidad!.fechaEfectiva, this.incapacidad!.dias);
  }

  private actualizarFechaFinal() {
    if (this.incapacidad) {
      this.fechaFinal = this.obtenerFechaFinal(this.incapacidad.fechaEfectiva, this.incapacidad.dias);
    }
  }

  obtenerFechaFinal(fechaInicial: any, dias: number): Date | null {
    if (!fechaInicial) {
        return null;
    }

    const fechaInicialTimestamp = Date.parse(fechaInicial);

    if (isNaN(fechaInicialTimestamp)) {
      return null;
    }

    const fechaInicialDate = new Date(fechaInicialTimestamp);
    const fechaFinal = new Date(fechaInicialDate.getTime() + dias * 24 * 60 * 60 * 1000);

    return fechaFinal;
  }
}
