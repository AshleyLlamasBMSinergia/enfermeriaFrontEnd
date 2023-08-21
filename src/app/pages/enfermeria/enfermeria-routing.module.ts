import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { EnfermeriaIndexComponent } from './index/index.component';

const routes:Routes = [
  {
    path: '',
    component: EnfermeriaIndexComponent,
    data: {
      subtitulo: 'Inicio',
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
export class EnfermeriaRoutingModule { }
