import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { EnfermeriaComponent } from './enfermeria/enfermeria.component';
const routes:Routes = [
  {
    path: 'enfermeria', component:PagesComponent,
    children: [
      {
        path: '', component:EnfermeriaComponent,
        data: {
          titulo: 'Inicio',
          subtitulo: 'Inicio'
        }
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
        path: 'historiales-medicos',
        loadChildren: () =>
          import('./historiales-medicos/historiales-medicos.module').then((m) => m.HistorialesMedicosModule),
        data: {
          titulo: 'Historiales médicos',
        },
      },
      {
        path: 'estadisticas', component:EstadisticasComponent,
        data: {
          titulo: 'Estadísticas',
          subtitulo: 'Estadísticas'
        }
      }
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