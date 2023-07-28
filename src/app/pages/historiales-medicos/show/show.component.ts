import { Component, OnInit } from '@angular/core';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { ActivatedRoute } from '@angular/router';
import { HistorialesMedicos } from '../historiales-medicos';
import { differenceInYears } from 'date-fns';

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class HistorialesMedicosShowComponent implements OnInit {
  historialMedico!: HistorialesMedicos | null;
  edad: number | null = null;
  terminado: boolean = false;

  constructor(
    private historialesMedicosService: HistorialesMedicosService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getHistorialMedico();
  }

  calcularEdad() {
    if (this.historialMedico!.pacientable?.FechaNacimiento) {
      const fechaNacimiento = new Date(this.historialMedico!.pacientable?.FechaNacimiento);
      this.edad = differenceInYears(new Date(), fechaNacimiento);
    }
  }

  getHistorialMedico() {
    const historialMedicoId = +this.route.snapshot.paramMap.get('HistorialMedico')!;
    this.historialesMedicosService.getHistorialMedico(historialMedicoId)
      .subscribe(historialMedico => {
        console.table(historialMedico)
        this.historialMedico = historialMedico;
        this.calcularEdad();
        this.terminado = true;
      });
  }
}
