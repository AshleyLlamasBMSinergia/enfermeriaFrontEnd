import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menu:any[] = [
    {
      titulo: 'Inicio',
      icono: 'assets/icons/inicio.svg',
      url: 'inicio'
    },
    {
      titulo: 'Calendario',
      icono: 'assets/icons/calendario.svg',
      url: 'calendario'
    },
    {
      titulo: 'Consultas',
      icono: 'assets/icons/consultas.svg',
      url: 'consultas'
    },
    {
      titulo: 'Historiales médicos',
      icono: 'assets/icons/historialesMedicos.svg',
      url: 'historiales-medicos'
    },
    // {
    //   titulo: 'Insumos médicos',
    //   icono: 'assets/icons/insumosMedicos.svg',
    //   url: 'insumos-medicos'
    // },
    // {
    //   titulo: 'Requisiciones',
    //   icono: 'assets/icons/requisiciones.svg',
    //   url: 'requisiciones'
    // },
    {
      titulo: 'Inventarios',
      icono: 'assets/icons/insumosMedicos.svg',
      url: 'inventarios'
    },
    {
      titulo: 'Estadisticas',
      icono: 'assets/icons/estadisticas.svg',
      url: 'estadisticas'
    }    
  ]
}
