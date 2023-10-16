import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { LotesMedicosIndexComponent } from './index/index.component';
import { LotesMedicosCreateComponent } from './create/create.component';
import { LotesMedicosShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: '',
    component: LotesMedicosIndexComponent,
    data: {
      subtitulo: 'Lotes médicos',
    },
  },
  {
    path: 'create', 
    component: LotesMedicosCreateComponent,
    data: {
      subtitulo: 'Crear Lotes médicos',
    },
  },
  {
    path: ':id', component:LotesMedicosShowComponent,
    data: {
      subtitulo: 'Ver Lote médico'
    }
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
