import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesComponent } from './pages.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HistorialesMedicosModule } from './historiales-medicos/historiales-medicos.module';
import { HistorialesMedicosRoutingModule } from './historiales-medicos/historiales-medicos-routing.module';

@NgModule({
  declarations: [
    PagesComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    HistorialesMedicosModule,
    HistorialesMedicosRoutingModule,
  ],
  exports: [
    PagesComponent
  ]
})
export class PagesModule { }
