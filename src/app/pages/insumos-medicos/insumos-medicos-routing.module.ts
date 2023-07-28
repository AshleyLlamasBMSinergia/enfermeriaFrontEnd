import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { IndexComponent } from './index/index.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

const routes:Routes = [
  {
    path: 'enfermeria', component:PagesComponent,
    children: [
      {
        path: 'insumos-medicos', component:IndexComponent,
        data: {
          titulo: 'Insumos médicos',
          subtitulo: 'Insumos médicos'
        }
      },
      {
        path: 'insumos-medicos/create', component:CreateComponent,
        data: {
          titulo: 'Insumos médicos',
          subtitulo: 'Registrar nuevo insumo médico'
        }
      },
      {
        path: 'insumos-medicos/postId/edit', component:EditComponent,
        data: {
          titulo: 'Insumos médicos',
          subtitulo: 'Editar insumo médico'
        }
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
export class InsumosMedicosRoutingModule { }
