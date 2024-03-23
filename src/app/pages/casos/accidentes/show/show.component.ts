import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Accidentes } from 'src/app/interfaces/accidentes';
import { Casos } from 'src/app/interfaces/casos';

@Component({
  selector: 'app-accidentes-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class AccidentesShowComponent {
  @Input() caso?: Casos;
  accidente!: Accidentes;

  ngOnInit(): void {
    this.accidente = this.caso!.accidente;
    console.log(this.accidente);
  }

  getTotalCostoEstudios(): number {
    let total = 0;
    for (let costEstudio of this.accidente.accidente_cost_estudios) {
      if (!isNaN(costEstudio.monto)) {
        total += costEstudio.monto;
      }
    }
    return total;
  }  

  getTotalCosto() {
    let total = 0;
    total = this.getTotalCostoEstudios() + 
            (this.accidente?.costoIncInterna ?? 0) +
            (this.accidente?.costoConsulta ?? 0) +
            (this.accidente?.costoMedicamento ?? 0);
    return total;
  }  
  
}
