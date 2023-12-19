import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Incapacidades } from 'src/app/interfaces/incapacidades';
import { NotificationService } from 'src/app/services/notification.service';
import { IncapacidadesService } from '../incapacidades.service';
import { CapitalizarTextoService } from 'src/app/services/capitalizar-texto.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IncapacidadesIndexComponent {
  incapacidades: Incapacidades[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private incapacidadesService: IncapacidadesService,
    private notificationService: NotificationService,
    private capitalizarTextoService: CapitalizarTextoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
      this.getIncapacidades();
  }

  getTextoCapitalizado(texto:any): string {
    return this.capitalizarTextoService.capitalizarTexto(texto);
  }

  getIncapacidades(): void {
    this.incapacidadesService.getIncapacidades().subscribe(
      (incapacidades: Incapacidades[]) => {
        this.incapacidades = incapacidades;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showIncapacidad(id: number) {
    this.router.navigate(['/enfermeria/incapacidades', id]);
  }

  editIncapacidad(id: number) {
    this.router.navigate(['/enfermeria/incapacidades/edit', id]);
  }
}
