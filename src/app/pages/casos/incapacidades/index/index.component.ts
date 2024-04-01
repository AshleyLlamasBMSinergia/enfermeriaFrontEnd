import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Incapacidades } from 'src/app/interfaces/incapacidades';
import { SharedDataService } from 'src/app/pagination/shared-data.service';
import { CapitalizarTextoService } from 'src/app/services/capitalizar-texto.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IncapacidadesIndexComponent {
  incapacidades: Incapacidades[] = [];

  filtros:any = {
    folio: '',
    caso: '',
    numeroEmpleado: '',
    empleado: '',
    tipoDeincidencia: '',
    fecha: '',
    exportado: '',
  };

  constructor(
    private sharedDataService: SharedDataService,
    private capitalizarTextoService: CapitalizarTextoService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.loadIncapacidades();
  }

  loadIncapacidades(){
    this.sharedDataService.solicitudes$.subscribe(solicitudes => {
      console.log(solicitudes);
      this.incapacidades = solicitudes;
    });
  }

  getTextoCapitalizado(texto:any): string {
    return this.capitalizarTextoService.capitalizarTexto(texto);
  }

  showIncapacidad(id: number) {
    this.router.navigate(['/enfermeria/casos/incapacidades', id]);
  }

  showCaso(id: number) {
    this.router.navigate(['/enfermeria/casos', id]);
  }

  submitForm() {
    console.log(this.filtros);
    this.sharedDataService.updateFiltros(this.filtros);
    this.loadIncapacidades();
  }
}
