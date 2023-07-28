import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menu:any[] = [
    {
      titulo: 'Inicio',
      icono: 'nav-icon fas fa-th',
      url: ''
    },
    {
      titulo: 'Calendario',
      icono: 'nav-icon fas fa-calendar',
      url: 'calendario'
    },
    {
      titulo: 'Consultas',
      icono: 'nav-icon fas fa-solid fa-hospital-user',
      url: 'consultas'
    },
    {
      titulo: 'Historiales médicos',
      icono: 'nav-icon fas fa-solid fa-book-medical',
      url: 'historiales-medicos'
    },
    {
      titulo: 'Insumos médicos',
      icono: 'nav-icon fas fa-solid fa-pills',
      url: 'insumos-medicos'
    },
    {
      titulo: 'Requisiciones',
      icono: 'nav-icon fas fa-shopping-cart',
      url: 'requisiciones'
    },
    {
      titulo: 'Estadisticas',
      icono: 'nav-icon fas fa-solid fa-chart-pie',
      url: 'estadisticas'
    }    
  ]
}
