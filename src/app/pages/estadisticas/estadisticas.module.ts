import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasIndexComponent } from './index/index.component';
import { EstadisticasRoutingModule } from './estadisticas-routing-module';



@NgModule({
  declarations: [
    EstadisticasIndexComponent
  ],
  imports: [
    CommonModule,
    EstadisticasRoutingModule
  ]
})
export class EstadisticasModule { }
