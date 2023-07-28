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
        path: 'requisiciones', component:IndexComponent,
        data: {
          titulo: 'Requisiciones',
          subtitulo: 'Requisiciones'
        }
      },
      {
        path: 'requisiciones/create', component:CreateComponent,
        data: {
          titulo: 'Requisiciones',
          subtitulo: 'Nueva requisición'
        }
      },
      {
        path: 'requisiciones/postId/edit', component:EditComponent,
        data: {
          titulo: 'Requisiciones',
          subtitulo: 'Editar requisición'
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
export class RequisicionesRoutingModule { }
