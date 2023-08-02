import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { ConsultasIndexComponent } from './index/index.component';
import { ConsultasCreateComponent } from './create/create.component';
import { ConsultasEditComponent } from './edit/edit.component';
import { ConsultasShowComponent } from './show/show.component';

const routes:Routes = [
  {
    path: '',
    component: ConsultasIndexComponent,
    data: {
      subtitulo: 'Consultas',
    },
  },
  {
    path: 'consultas', component:ConsultasIndexComponent,
    data: {
      subtitulo: 'Consultas'
    }
  },
  {
    path: 'create', component:ConsultasCreateComponent,
    data: {
      subtitulo: 'Nueva consulta'
    }
  },
  {
    path: ':Consulta/edit', component:ConsultasEditComponent,
    data: {
      subtitulo: 'Editar consulta'
    }
  },
  {
    path: ':Consulta', component:ConsultasShowComponent,
    data: {
      subtitulo: 'Ver consulta'
    }
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
export class ConsultasRoutingModule { }
