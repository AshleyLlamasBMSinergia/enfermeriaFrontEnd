import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncapacidadesIndexComponent } from './index/index.component';
import { RouterModule, Routes } from '@angular/router';
import { IncapacidadesCreateComponent } from './create/create.component';
import { IncapacidadesShowComponent } from './show/show.component';
import { IncapacidadesEditComponent } from './edit/edit.component';

const routes:Routes = [
  {
    path: '',
    component: IncapacidadesIndexComponent,
    data: {
      subtitulo: 'Incapacidades',
    },
  },
  {
    path: 'Incapacidades', component:IncapacidadesIndexComponent,
    data: {
      subtitulo: 'Incapacidades'
    }
  },
  {
    path: 'create', component:IncapacidadesCreateComponent,
    data: {
      subtitulo: 'Nueva incapacidad'
    }
  },
  {
    path: ':id', component:IncapacidadesShowComponent,
    data: {
      subtitulo: 'Ver incapacidad'
    }
  },
  {
    path: 'edit/:id', component:IncapacidadesEditComponent,
    data: {
      subtitulo: 'Editar incapacidad'
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
export class IncapacidadesRoutingModule { }
