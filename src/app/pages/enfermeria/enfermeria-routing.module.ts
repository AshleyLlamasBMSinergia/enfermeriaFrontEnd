import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from '../pages.component';
import { IndexComponent } from './index/index.component';

const routes:Routes = [
  {
    path: 'enfermeria', component:PagesComponent,
    children: [
      {
        path: 'enfermeria', component:IndexComponent,
        data: {
          titulo: 'enfermeria',
          subtitulo: 'enfermeria'
        }
      }
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
export class EnfermeriaRoutingModule { }
