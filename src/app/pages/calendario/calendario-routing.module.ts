import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarioIndexComponent } from './index/index.component';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path: '',
    component: CalendarioIndexComponent,
    data: {
      subtitulo: 'Calendario',
    },
  },
  {
    path: 'calendario', component:CalendarioIndexComponent,
    data: {
      subtitulo: 'Calendario'
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
export class CalendarioRoutingModule { }
