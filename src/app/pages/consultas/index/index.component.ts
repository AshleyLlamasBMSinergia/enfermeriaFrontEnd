import { Component, OnInit } from '@angular/core';
import { Consultas } from '../consultas';
import { ConsultasService } from '../consultas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class ConsultasIndexComponent implements OnInit{
  consultas: Consultas[] = [];
  loading: boolean = false;

    constructor(
      private consultasService: ConsultasService,
      private router: Router,
    ) { }
  
    ngOnInit(): void {
      this.getConsultas();
    }
  
    getConsultas(): void {
      this.consultasService.getConsultas().subscribe(
        (consultas: Consultas[]) => {
          this.consultas = consultas.map((consulta) => {
            return this.consultasService.pacientable(consulta);
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }

    showConsulta(id: number) {
      this.router.navigate(['/enfermeria/consultas', id]);
    }

  }