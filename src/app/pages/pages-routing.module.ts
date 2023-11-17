import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { AuthGuard } from '../auth/auth.guard';

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
        canActivate: [AuthGuard,]
      },
      {
        path: 'calendario',
        loadChildren: () =>
          import('./calendario/calendario.module').then((m) => m.CalendarioModule),
        data: {
          titulo: 'Calendario',
        },
        canActivate: [AuthGuard,]
      },
      {
        path: 'consultas',
        loadChildren: () =>
          import('./consultas/consultas.module').then((m) => m.ConsultasModule),
        data: {
          titulo: 'Consultas',
        },
        canActivate: [AuthGuard,]
      },
      {
        path: 'estadisticas',
        loadChildren: () =>
          import('./estadisticas/estadisticas.module').then((m) => m.EstadisticasModule),
        data: {
          titulo: 'Estadísticas',
        },
        canActivate: [AuthGuard,]
      },
      {
        path: 'historiales-medicos',
        loadChildren: () =>
          import('./historiales-medicos/historiales-medicos.module').then((m) => m.HistorialesMedicosModule),
        data: {
          titulo: 'Historiales médicos',
        },
        canActivate: [AuthGuard,]
      },
      {
        path: 'almacenes',
        loadChildren: () =>
          import('./inventarios/inventarios.module').then((m) => m.InventariosModule),
        data: {
          titulo: 'Almacenes',
        },
        canActivate: [AuthGuard,]
      },
      {
        path: 'incapacidades',
        loadChildren: () =>
          import('./incapacidades/incapacidades.module').then((m) => m.IncapacidadesModule),
        data: {
          titulo: 'Incapacidades',
        },
        canActivate: [AuthGuard,]
      },
      {
        path: 'estadisticas',
        loadChildren: () =>
          import('./estadisticas/estadisticas.module').then((m) => m.EstadisticasModule),
        data: {
          titulo: 'Estadísticas',
        },
        canActivate: [AuthGuard,]
      },
    ]
  }
]

// const routes: Routes = [
//   {
//     path: 'enfermeria/inicio',
//     loadChildren: () =>
//       import('./enfermeria/enfermeria.module').then((m) => m.EnfermeriaModule),
//     data: {
//       titulo: 'Inicio',
//     },
//     canActivate: [AuthGuard,]
//   },
//   {
//     path: 'enfermeria/calendario',
//     loadChildren: () =>
//       import('./calendario/calendario.module').then((m) => m.CalendarioModule),
//     data: {
//       titulo: 'Calendario',
//     },
//     canActivate: [AuthGuard,]
//   },
//   {
//     path: 'enfermeria/consultas',
//     loadChildren: () =>
//       import('./consultas/consultas.module').then((m) => m.ConsultasModule),
//     data: {
//       titulo: 'Consultas',
//     },
//     canActivate: [AuthGuard,]
//   },
//   {
//     path: 'enfermeria/estadisticas',
//     loadChildren: () =>
//       import('./estadisticas/estadisticas.module').then((m) => m.EstadisticasModule),
//     data: {
//       titulo: 'Estadísticas',
//     },
//     canActivate: [AuthGuard,]
//   },
//   {
//     path: 'enfermeria/historiales-medicos',
//     loadChildren: () =>
//       import('./historiales-medicos/historiales-medicos.module').then((m) => m.HistorialesMedicosModule),
//     data: {
//       titulo: 'Historiales médicos',
//     },
//     canActivate: [AuthGuard,]
//   },
//   {
//     path: 'enfermeria/almacenes',
//     loadChildren: () =>
//       import('./inventarios/inventarios.module').then((m) => m.InventariosModule),
//     data: {
//       titulo: 'Almacenes',
//     },
//     canActivate: [AuthGuard,]
//   },
//   // {
//   //   path: 'insumos-medicos',
//   //   loadChildren: () =>
//   //     import('./insumos-medicos/insumos-medicos.module').then((m) => m.InsumosMedicosModule),
//   //   data: {
//   //     titulo: 'Insumos médicos',

//   //   },
//   //   canActivate: [AuthGuard,]
//   // },
//   // {
//   //   path: 'lotes-medicos',
//   //   loadChildren: () =>
//   //     import('./lotes-medicos/lotes-medicos.module').then((m) => m.LotesMedicosModule),
//   //   data: {
//   //     titulo: 'Lotes médicos',
//   //   },
//   {
//     path: 'enfermeria/estadisticas',
//     loadChildren: () =>
//       import('./estadisticas/estadisticas.module').then((m) => m.EstadisticasModule),
//     data: {
//       titulo: 'Estadísticas',
//     },
//     canActivate: [AuthGuard,]
//   },
// ]

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