import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { EstadisticasIndexComponent } from './index/index.component';

const routes:Routes = [
  {
    path: '',
    component: EstadisticasIndexComponent,
    data: {
      subtitulo: 'Estadísticas',
    },
  },
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
export class EstadisticasRoutingModule { }
