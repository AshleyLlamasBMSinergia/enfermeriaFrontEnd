import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';

const routes:Routes = [
  {
    path: 'enfermeria', component:PagesComponent,
    children: [
      {
        path: 'inicio',
        loadChildren: () =>
          import('./enfermeria/enfermeria.module').then((m) => m.EnfermeriaModule),
        data: {
          titulo: 'Inicio',
        },
      },
      {
        path: 'calendario',
        loadChildren: () =>
          import('./calendario/calendario.module').then((m) => m.CalendarioModule),
        data: {
          titulo: 'Calendario',
        },
      },
      {
        path: 'consultas',
        loadChildren: () =>
          import('./consultas/consultas.module').then((m) => m.ConsultasModule),
        data: {
          titulo: 'Consultas',
        },
      },
      {
        path: 'estadisticas',
        loadChildren: () =>
          import('./estadisticas/estadisticas.module').then((m) => m.EstadisticasModule),
        data: {
          titulo: 'Estadísticas',
        },
      },
      {
        path: 'historiales-medicos',
        loadChildren: () =>
          import('./historiales-medicos/historiales-medicos.module').then((m) => m.HistorialesMedicosModule),
        data: {
          titulo: 'Historiales médicos',
        },
      },
      {
        path: 'insumos-medicos',
        loadChildren: () =>
          import('./insumos-medicos/insumos-medicos.module').then((m) => m.InsumosMedicosModule),
        data: {
          titulo: 'Insumos médicos',
        },
      },
      // {
      //   path: 'lotes-medicos',
      //   loadChildren: () =>
      //     import('./lotes-medicos/lotes-medicos.module').then((m) => m.LotesMedicosModule),
      //   data: {
      //     titulo: 'Lotes médicos',
      //   },
      // },
      {
        path: 'requisiciones',
        loadChildren: () =>
          import('./requisiciones/requisiciones.module').then((m) => m.RequisicionesModule),
        data: {
          titulo: 'Requisiciones',
        },
      },
      {
        path: 'estadisticas',
        loadChildren: () =>
          import('./estadisticas/estadisticas.module').then((m) => m.EstadisticasModule),
        data: {
          titulo: 'Estadísticas',
        },
      },
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class PagesRoutingModule { }