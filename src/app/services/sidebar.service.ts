import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  menu:any[] = [
    // {
    //   titulo: 'Inicio',
    //   icono: 'assets/icons/inicio.svg',
    //   url: 'inicio'
    // },
    {
      titulo: 'Calendario',
      icono: 'assets/icons/calendario.svg',
      submenu: [
        {
          titulo: 'Mis citas',
          url: 'calendario',
        },
      ]
    },
    {
      titulo: 'Consultas',
      icono: 'assets/icons/consultas.svg',
      submenu: [
        {
          titulo: 'Todas las consultas',
          url: 'consultas',
        },
      ]
    },
    {
      titulo: 'Historiales médicos',
      icono: 'assets/icons/historialesMedicos.svg',
      submenu: [
        {
          titulo: 'Todos los historiales',
          url: 'historiales-medicos',
        },
      ]
    },
    {
      titulo: 'Almacenes',
      icono: 'assets/icons/insumosMedicos.svg',
      submenu: [
        {
          titulo: 'Mis almacenes',
          url: 'almacenes',
        },
      ]
    },  
    {
      titulo: 'Casos e incapacidades',
      icono: 'assets/icons/incapacidades.svg',
      submenu: [
        {
          titulo: 'Todos los Casos',
          url: 'casos',
        },
        {
          titulo: 'Todas las incapacidades',
          url: 'casos/incapacidades',
        }
      ]
    } 
  ]
}
