import { Component } from '@angular/core';
import { HistorialesMedicos } from '../historiales-medicos';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class HistorialesMedicosIndexComponent {
  historialesMedicos: HistorialesMedicos[] = [];
  loading: boolean = false;
  
    constructor(
      private historialesMedicosService: HistorialesMedicosService,
      private router: Router,
    ) { }
  
    ngOnInit(): void {
      this.getHistorialesMedicos();
    }
  
    getHistorialesMedicos(): void {
      this.historialesMedicosService.getHistorialesMedicos().subscribe(
        (historialesMedicos: HistorialesMedicos[]) => {
          this.historialesMedicos = historialesMedicos.map((historialMedico) => {
            return this.historialesMedicosService.pacientable(historialMedico);
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }
    
    showHistorialMedico(id: number) {
      this.router.navigate(['/enfermeria/historiales-medicos', id]);
    }

    editHistorialMedico(id: number) {
      this.router.navigate(['/enfermeria/historiales-medicos/edit', id]);
    }
}
