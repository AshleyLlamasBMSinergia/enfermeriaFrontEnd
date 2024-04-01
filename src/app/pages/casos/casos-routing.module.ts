import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CasosIndexComponent } from './index/index.component';
import { RouterModule, Routes } from '@angular/router';
import { CasosCreateComponent } from './create/create.component';
import { CasosShowComponent } from './show/show.component';
import { IncapacidadesIndexComponent } from './incapacidades/index/index.component';
import { IncapacidadesShowComponent } from './incapacidades/show/show.component';

const routes:Routes = [
  {
    path: '', component: CasosIndexComponent,
    data: {
      subtitulo: 'Casos',
    },
  },
  {
    path: 'incapacidades', component: IncapacidadesIndexComponent,
    data: {
      subtitulo: 'Incapacidades',
    },
  },
  {
    path: 'incapacidades/:id', component:IncapacidadesShowComponent,
    data: {
      subtitulo: 'Ver incapacidad'
    }
  },
  {
    path: 'create', component:CasosCreateComponent,
    data: {
      subtitulo: 'Nuevo caso de incapacidad'
    }
  },
  {
    path: ':id', component:CasosShowComponent,
    data: {
      subtitulo: 'Ver caso'
    }
  },
  // {
  //   path: 'edit/:id', component:IncapacidadesEditComponent,
  //   data: {
  //     subtitulo: 'Editar incapacidad'
  //   }
  // },
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
export class CasosRoutingModule { }
