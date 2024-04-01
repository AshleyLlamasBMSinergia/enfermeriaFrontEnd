import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Casos } from 'src/app/interfaces/casos';
import { SharedDataService } from 'src/app/pagination/shared-data.service';
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
  casoSeleccionado?: Casos;

  filtros:any = {
    caso: '',
    empleado: '',
    puesto: '',
    departamento: '',
    fecha: '',
    estatus: '',
  };
  
  constructor(
    private sharedDataService: SharedDataService,
    private capitalizarTextoService: CapitalizarTextoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadCasos();
  }


  loadCasos(){
    this.sharedDataService.solicitudes$.subscribe(solicitudes => {
      this.casos = solicitudes;
    });
  }

  getTextoCapitalizado(texto:any): string {
    return this.capitalizarTextoService.capitalizarTexto(texto);
  }

  showCaso(id: number) {
    this.router.navigate(['/enfermeria/casos', id]);
  }

  editCaso(caso: Casos) {
    this.casoSeleccionado = caso;
  }

  submitForm() {
    this.sharedDataService.updateFiltros(this.filtros);
    this.loadCasos();
  }
}
