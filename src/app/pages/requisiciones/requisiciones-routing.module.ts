import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { RequisicionesIndexComponent } from './index/index.component';

const routes:Routes = [
  {
    path: '',
    component: RequisicionesIndexComponent,
    data: {
      subtitulo: 'Requisiciones',
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
export class RequisicionesRoutingModule { }
