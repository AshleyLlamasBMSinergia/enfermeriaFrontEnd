import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Casos } from 'src/app/interfaces/casos';
import { CapitalizarTextoService } from 'src/app/services/capitalizar-texto.service';
import { CasosService } from 'src/app/services/casos.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class CasosIndexComponent {
  casos: Casos[] = [];
  loading: boolean = false;

  paginaActual = 1;
  elementosPorPagina = 10;

  constructor(
    private casosService: CasosService,
    private notificationService: NotificationService,
    private capitalizarTextoService: CapitalizarTextoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getCasos();
  }

  getTextoCapitalizado(texto:any): string {
    return this.capitalizarTextoService.capitalizarTexto(texto);
  }

  getCasos(): void {
    this.casosService.getCasos().subscribe(
      (casos: Casos[]) => {
        this.casos = casos;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  showCaso(id: number) {
    this.router.navigate(['/enfermeria/casos', id]);
  }

}
