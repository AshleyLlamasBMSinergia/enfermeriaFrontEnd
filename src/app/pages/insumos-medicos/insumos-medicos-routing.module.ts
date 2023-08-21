import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { InsumosMedicosIndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    component: InsumosMedicosIndexComponent,
    data: {
      subtitulo: 'Insumos médicos',
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
export class InsumosMedicosRoutingModule { }
