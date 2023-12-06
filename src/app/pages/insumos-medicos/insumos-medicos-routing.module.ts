import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { InsumosMedicosIndexComponent } from './index/index.component';
import { LotesMedicosIndexComponent } from '../lotes-medicos/index/index.component';
import { InsumosMedicosEditComponent } from './edit/edit.component';
import { InsumosMedicosCreateComponent } from './create/create.component';
const routes: Routes = [
  {
    path: '',
    component: InsumosMedicosIndexComponent,
    data: {
      subtitulo: 'Insumos médicos',
    },
  },
  {
    path: 'create', 
    component: InsumosMedicosCreateComponent,
    data: {
      subtitulo: 'Crear insumo',
    },
  },
  {
    path: ':id',
    component: LotesMedicosIndexComponent,
    data: {
      subtitulo: 'Ver insumo',
    },
  },
  {
    path: 'edit/:id',
    component: InsumosMedicosEditComponent,
    data: {
      subtitulo: 'Editar insumo',
    }
  }
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
