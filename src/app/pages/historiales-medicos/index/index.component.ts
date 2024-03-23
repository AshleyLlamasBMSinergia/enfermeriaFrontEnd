import { Component } from '@angular/core';
import { HistorialesMedicosService } from '../historiales-medicos.service';
import { Router } from '@angular/router';
import { Subject, debounceTime  } from 'rxjs';
import { NotificationService } from 'src/app/services/notification.service';
import { HistorialesMedicos } from 'src/app/interfaces/historiales-medicos';
import { CapitalizarTextoService } from 'src/app/services/capitalizar-texto.service';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})

export class HistorialesMedicosIndexComponent {
  historialesMedicos: HistorialesMedicos[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  
  search: string = '';
  private searchTerms = new Subject<string>();
  
    constructor(
      private historialesMedicosService: HistorialesMedicosService,
      private notificationService: NotificationService,
      private capitalizarTextoService: CapitalizarTextoService,
      private router: Router,
    ) { }
  
    ngOnInit(): void {
      this.estadisticaPacientesConMasConsultas();
      this.getHistorialesMedicos();

      this.searchTerms.pipe(
        debounceTime(500)
      ).subscribe(() => {
        this.realizarBusqueda();
      });
    }

    getTextoCapitalizado(texto:any): string {
      return this.capitalizarTextoService.capitalizarTexto(texto);
    }

    buscarPaciente() {
      this.searchTerms.next(this.search.trim());
    }

    //Por enter
    realizarBusqueda(): void {
        this.historialesMedicosService.buscador(this.search)
        .subscribe(
          historiales => this.historialesMedicos = historiales,
          error => console.error(error)
        );
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

    estadisticaPacientesConMasConsultas(){
      this.historialesMedicosService.getEstadisticaPacientesConMasConsultas().subscribe(
        (datos: any) => {
          const pacientesConMasConsultas = document.getElementById('myChart');
          const myChart = new Chart("pacientesConMasConsultas", {
              type: 'bar',
              data: {
                labels: datos.labels,
                datasets: [{
                    label: 'Consultas',
                    data: datos.data,
                    backgroundColor: datos.backgroundColor,
                    borderColor: datos.backgroundColor,
                    borderWidth: 1,
                }]
              },
              options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                plugins: {
                  title: {
                      display: true,
                  },
                  
              }
            }
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

    async destroyHistorialMedico(id: number | undefined) {
      if (id !== undefined) {
        const confirmacion = await this.notificationService.confirmarEliminacion('historial médico junto sus citas');
    
        if (confirmacion) {
          this.historialesMedicosService.destroyHistorialMedico(id).subscribe(
            (response) => {
              this.notificationService.mensaje(response);
            },
            (error) => {
              console.error('Error al eliminar el historial médico:', error);
              this.notificationService.error('Hubo un error al eliminar el historial médico');
            }
          );
        }
      } else {
        this.notificationService.error('No se encontró el historial médico');
      }
    }
}
