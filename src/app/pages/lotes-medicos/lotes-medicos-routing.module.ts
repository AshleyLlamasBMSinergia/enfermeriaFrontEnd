import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { LotesMedicosIndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: LotesMedicosIndexComponent,
    data: {
      subtitulo: 'Lotes médicos',
    },
  },
];

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
export class LotesMedicosRoutingModule { }
