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
    {
      titulo: 'Almacenes',
      icono: 'assets/icons/insumosMedicos.svg',
      url: 'almacenes'
    },
    {
      titulo: 'Casos de incapacidades',
      icono: 'assets/icons/incapacidades.svg',
      url: 'casos'
    },   
  ]
}
