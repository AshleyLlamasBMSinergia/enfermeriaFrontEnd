import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequisicionesRoutingModule } from './requisiciones-routing.module';
import { RequisicionesIndexComponent } from './index/index.component';



@NgModule({
  declarations: [
    RequisicionesIndexComponent
  ],
  imports: [
    CommonModule,
    RequisicionesRoutingModule
  ]
})
export class RequisicionesModule { }
