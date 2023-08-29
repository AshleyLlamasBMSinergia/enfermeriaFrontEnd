import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasIndexComponent } from './index/index.component';
import { EstadisticasRoutingModule } from './estadisticas-routing-module';
import { BrowserModule } from '@angular/platform-browser';
import { NgChartjsModule } from 'ng-chartjs';



@NgModule({
  declarations: [
    EstadisticasIndexComponent
  ],
  imports: [
    CommonModule,
    EstadisticasRoutingModule,
    BrowserModule,
    NgChartjsModule
  ]
})
export class EstadisticasModule { }
